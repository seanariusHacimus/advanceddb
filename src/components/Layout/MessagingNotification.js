import React, { useState, useMemo, useEffect, useRef, } from 'react';
import { StyledMessagingNotifications } from '../../styles/header';
import { Mail } from 'lucide-react';
import { Badge } from '../UI/shadcn';
import { useHistory } from 'react-router-dom';
import socket, { socketLogin } from '../../utils/socket';
import { rocketAxios } from '../../utils/axios';
import useInterval from '@use-it/interval';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { rocketLogin } from '../../store/RocketAuth/actions';

const MessagingNotifications = (props) => {
  const [notifications, setNotifications] = useState([]);
  const rocketAuth = useSelector(state => state.rocketAuth);
  const dispatch = useDispatch();
  const history = useHistory();
  const parentRef = useRef();

  useEffect(() => {
    dispatch(rocketLogin())
  }, []);

  useEffect(() => {
    if (rocketAuth.token && socket.readyState === 1) {
      socketLogin(rocketAuth.token);
    }
  }, [rocketAuth]);

  function getNotifications() {
    socket.send(JSON.stringify(
      {
        "msg": "method",
        "method": "subscriptions/get",
        "id": "getNotifications",
        " params": [{ "$date": moment().subtract(10, 'seconds').valueOf() }]
      }
    ))
  }

  useEffect(() => {
    socket.onmessage = event => {
      const res = JSON.parse(event.data);
      if (res.msg === 'ping') {
        console.log('PING');
        socket.send(JSON.stringify({ msg: "pong" }));
      }
      if (res.msg === 'added' && res.id) {
        getNotifications();
      } else if (res.id === 'getNotifications') {
        console.log(res);
      }
    }

  }, [socket.readyState]);

  useInterval(async () => {
    if (rocketAuth.token) {
      try {
        const { token, user_id: userId } = rocketAuth;
        const sub = await rocketAxios.get('/subscriptions.get', { headers: { 'X-Auth-Token': `${token}`, 'X-User-Id': userId } });
        if (sub?.data) {
          const { update } = sub.data;
          setNotifications(update);
        }
      } catch (err) {
        console.log(err.response);
        return []
      }
    }
  }, 10000);

  const count = useMemo(() => notifications.reduce((total, item) => total += item.unread, 0));

  return (
    <StyledMessagingNotifications ref={parentRef} onClick={() => history.push('/dashboard/messaging')} className="clickable">
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <Mail style={{ fontSize: '18px', width: '18px', height: '18px', color: 'hsl(var(--foreground))' }} />
        {count > 0 && (
          <Badge 
            variant="destructive" 
            style={{ 
              position: 'absolute', 
              top: '-8px', 
              right: '-8px',
              minWidth: '16px',
              height: '16px',
              padding: '0 4px',
              fontSize: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px'
            }}
          >
            {count}
          </Badge>
        )}
      </div>
    </StyledMessagingNotifications>
  );
};

export default MessagingNotifications;

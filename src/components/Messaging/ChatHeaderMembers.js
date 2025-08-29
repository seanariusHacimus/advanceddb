import React, { useCallback, useState } from 'react';
import { StyledChatHeaderMembers } from '../../styles/messaging';
import { rocketAxios } from '../../utils/axios';

export default function ChatHeaderMembers(props) {
  const [members, setMembers] = useState([])

  const fetchGroupMembers = useCallback(async () => {
    const { token, user_id: userId } = rocketAuth;
    if (selectedUser._id) {
      const res = await rocketAxios.get('/groups.members?roomId=' + selectedUser._id,
        {
          headers: { 'X-Auth-Token': `${token}`, 'X-User-Id': userId }
        });
      if (res.data.success) {
        setMembers(res.data.members)
      }
    };
  }, [selectedUser, rocketAuth]);

  return (
    <StyledChatHeaderMembers>
      {members.map(item => (
        <div>
          <img src={item.photo.url} role="presentation" />
          {`${item.first_name} ${item.last_name}`}
        </div>
      )
      )}
    </StyledChatHeaderMembers>
  )
}

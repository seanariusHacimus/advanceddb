import { v4 } from 'uuid';
const url = process.env.REACT_APP_ROCKET_SOCKET_URL;
let socket = new WebSocket(url);

socket.onopen = () => {
  var connectRequest = {
    "msg": "connect",
    "version": "1",
    "support": ["1", "pre2", "pre1"]
  }
  socket.send(JSON.stringify(connectRequest));
}

function socketLogin(token) {
  socket.send(JSON.stringify({
    "msg": "method",
    "method": "login",
    "id": v4(),
    "params": [
      { "resume": token }
    ]
  }))
}

socket.onmessage = event => {
  const { msg } = JSON.parse(event.data);
  if (msg === 'ping') {
    socket.send(JSON.stringify({ msg: "pong" }));
  }
};

export { socketLogin, socket as default };

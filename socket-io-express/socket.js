import { Server } from 'socket.io';

const handleSocket = (server) => {
  const io = new Server(server);

  io.on('connection', (socket) => {
    socket.on('message', (message) => {
      console.log(message);
    });

    socket.on('disconnect', (socket) => {
      console.log('disconnected');
    });
  });
};

export default handleSocket;

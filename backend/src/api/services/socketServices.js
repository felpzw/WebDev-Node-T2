const { Server } = require('socket.io');

const { validateTotemToken } = require('./totemServices');
const { listValidSlides } = require('./slideServices');

let io; 


const initSocketServer = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*', 
      methods: ['GET', 'POST'],
    },
  });


  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication failed: Token not provided.'));
      }
      const totem = await validateTotemToken(token);

      if (!totem) {
        return next(new Error('authentication failed: Invalid token.'));
      }


      socket.totem = totem;
      next(); 
    } catch (error) {
      console.error('Error on middleware socket:', error.message);
      next(new Error('Authentication error'));
    }
  });


  io.on('connection', async (socket) => {
    console.log(`Totem Connected: ${socket.totem.name} (ID: ${socket.id})`);

    try {
      const slides = await listValidSlides();
      socket.emit('update-slides', slides);
    } catch (error) {
      socket.emit('error', 'Fail to fetch slides');
    }

    socket.on('disconnect', () => {
      console.log(`Totem disconnected: ${socket.totem.name}`);
    });
  });

  return io;
};


const broadcastSlidesUpdate = async () => {
  if (!io) {
    console.warn('Socket.io not initialized or no totem connected.');
    return;
  }

  try {
    const slides = await listValidSlides();
    io.emit('update-slides', slides);
    console.log('Broadcasted slides update to all connected totems.');
  } catch (error) {
    console.error('Failed to broadcast slides:', error);
  }
};

module.exports = {
  initSocketServer,
  broadcastSlidesUpdate,
};
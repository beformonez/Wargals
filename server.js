
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public')); // Serve static files

let players = {}; // Player data
let blocks = {}; // Blocks
let projectiles = {}; // Projectiles

io.on('connection', (socket) => {
  console.log('Player connected to Wargals:', socket.id);
  players[socket.id] = { x: 100, y: 100, direction: 'right' };
  socket.emit('init', { players, blocks, projectiles });

  socket.on('move', (data) => {
    players[socket.id] = data;
    socket.broadcast.emit('updatePlayers', players);
  });

  socket.on('placeBlock', (data) => {
    blocks[data.key] = data.type;
    io.emit('updateBlocks', blocks);
  });

  socket.on('shoot', (data) => {
    const id = Date.now() + socket.id;
    projectiles[id] = { ...data, owner: socket.id };
    io.emit('updateProjectiles', projectiles);
  });

  socket.on('updateProjectile', (data) => {
    if (projectiles[data.id]) {
      projectiles[data.id] = data;
      socket.broadcast.emit('updateProjectiles', projectiles);
    }
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
    io.emit('updatePlayers', players);
  });
});

server.listen(3000, () => {
  console.log('Wargals server running on http://localhost:3000');
});
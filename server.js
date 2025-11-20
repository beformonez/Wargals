
   const express = require('express');
   const http = require('http');
   const socketIo = require('socket.io');

   const app = express();
   const server = http.createServer(app);
   const io = socketIo(server);

   app.use(express.static('public')); // Serve static files (HTML, JS, assets)

   let players = {}; // Store player data: {id: {x, y, direction}}
   let blocks = {}; // Store placed blocks: {x_y: type}
   let projectiles = {}; // Store projectiles: {id: {x, y, vx, vy, owner}}

   io.on('connection', (socket) => {
     console.log('Player connected:', socket.id);

     // Add new player
     players[socket.id] = { x: 100, y: 100, direction: 'right' };
     socket.emit('init', { players, blocks, projectiles });

     // Handle player movement
     socket.on('move', (data) => {
       players[socket.id] = data;
       socket.broadcast.emit('updatePlayers', players);
     });

     // Handle block placement
     socket.on('placeBlock', (data) => {
       blocks[data.key] = data.type;
       io.emit('updateBlocks', blocks);
     });

     // Handle projectile shooting
     socket.on('shoot', (data) => {
       const id = Date.now() + socket.id; // Unique ID
       projectiles[id] = { ...data, owner: socket.id };
       io.emit('updateProjectiles', projectiles);
     });

     // Handle projectile updates (movement)
     socket.on('updateProjectile', (data) => {
       if (projectiles[data.id]) {
         projectiles[data.id] = data;
         socket.broadcast.emit('updateProjectiles', projectiles);
       }
     });

     // Handle disconnect
     socket.on('disconnect', () => {
       delete players[socket.id];
       io.emit('updatePlayers', players);
     });
   });

   server.listen(3000, () => {
     console.log('Server running on http://localhost:3000');
   });
   
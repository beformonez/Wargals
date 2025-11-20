const socket = io();

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#87ceeb',
  physics: { default: 'arcade' },
  scene: { preload, create, update }
};

let player, cursors, players = {};

const game = new Phaser.Game(config);

function preload() {
  this.load.image('player', 'https://i.imgur.com/6X2xR5R.png'); // 16x16 pixel character
}

function create() {
  cursors = this.input.keyboard.createCursorKeys();

  socket.on('players', (data) => {
    for (let id in data) {
      if (!players[id]) {
        players[id] = this.add.image(data[id].x, data[id].y, 'player');
      } else {
        players[id].x = data[id].x;
        players[id].y = data[id].y;
      }
    }
    for (let id in players) {
      if (!data[id]) {
        players[id].destroy();
        delete players[id];
      }
    }
  });
}

function update() {
  if (!players[socket.id]) return;
  let moved = false;
  const speed = 2;
  const p = players[socket.id];

  if (cursors.left.isDown) { p.x -= speed; moved = true; }
  if (cursors.right.isDown) { p.x += speed; moved = true; }
  if (cursors.up.isDown) { p.y -= speed; moved = true; }
  if (cursors.down.isDown) { p.y += speed; moved = true; }

  if (moved) socket.emit('move', { x: p.x, y: p.y });
}
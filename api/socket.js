import { Server } from "socket.io";

let io;

export default function handler(req, res) {
  if (!io) {
    io = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
    });

    io.on("connection", (socket) => {
      console.log("Player connected");
      socket.emit("pingTest", "Server working!");
    });

    console.log("Socket.io server started");
  }
  res.end();
}

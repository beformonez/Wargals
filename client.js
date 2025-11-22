const socket = io("/", { path: "/api/socket" });
const s = document.getElementById('s');

socket.on("connect", () => { s.textContent = "Connected"; });
socket.on("pingTest", msg => { console.log("Server:", msg); });

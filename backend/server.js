const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const messages = [];

io.on("connection", (socket) => {
  console.log("usr connected:", socket.id);

  // trimitem istoricul la noul user conectat
  socket.emit("history", messages);

  socket.on("user_joined", (username) => {
    const joinMsg = {
      type: "system",
      text: `${username} a intrat in chat`,
      timestamp: Date.now()
    };
    // nu salvam system messages in history, doar broadcastam
    socket.broadcast.emit("system_message", joinMsg);
  });

  socket.on("send_message", (data) => {
    const msg = {
      id: Date.now() + Math.random(), // id unic pt fiecare mesaj
      username: data.username,
      text: data.text,
      timestamp: Date.now()
    };

    messages.push(msg);

    // trimitem la toti inclusiv cel care a trimis
    io.emit("new_message", msg);
  });

  socket.on("disconnect", () => {
    console.log("usr disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("srv running port 3000");
});
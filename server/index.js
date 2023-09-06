var express = require("express");
const http = require("http");
var app = express();
const server = http.createServer(app);

const socketIo = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

socketIo.on("connection", (socket) => {
  console.log("New client connected" + socket.id);
  socket.on("sendDataClient", function (data) {
    socketIo.emit("sendDataServer", { data });
  });

  socket.on("sendGameTimeClient", function (data) {
    socketIo.emit("sendGameTimeServer", { data });
  });

  socket.on("sendDisableClient", function (data) {
    socketIo.emit("sendDisableServer", { data });
  });

  socket.on("sendDataClientMess", function (data) {
    socketIo.emit("sendDataServerMess", { data });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(4002, () => {
  console.log("Server đang chay tren cong 4002");
});

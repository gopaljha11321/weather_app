const app = require("express")();
const port = process.env.PORT || 6003;
const http = require("http").Server(app);

const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

var ioClient = require("socket.io-client");
var socket = ioClient.connect("http://wssc.datakick.in:6000", {
  reconnect: true,
});

socket.on("connect", function () {
  socket.emit("room", "rate_SkyLive");
});

socket.on("LiveData", function (data) {
  io.sockets.emit("LiveData", data);
  console.log(data);
});

socket.on("disconnect reason", function (msg) {
  console.log(msg);
  process.exit(1);
});

socket.on("welcome message", function (msg) {
  console.log(msg);
});

io.on("connection", function (socket) {
  // send message
  socket.on("send message", function (data) {
    io.sockets.emit("new message", { msg: data, nick: socket.nickname });
  });
  //disconnected
  socket.on("disconnect", function (data) {
    if (!socket.nickname) return;
  });
});

http.listen(port, function () {
  console.log("listening on *:" + port);
});

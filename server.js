const express = require("express");
const app = express();
const http = require("http");
const authRouter = require("./routes/auth");
const server = http.createServer(app);
const io = require("socket.io")(server);

require("dotenv").config();

const port = process.env.PORT || 8000;

// check working server
app.get("/", (req, res, next) => {
  return res.send({ message: "working fine!!" });
});

app.get(authRouter);

io.on("connection", (socket) => {
  console.log("connected to socket");
});

server.listen(port, () => {
  console.log(`Server listening to ${port}`);
});

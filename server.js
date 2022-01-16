const express = require("express");
const http = require("http");
const authRouter = require("./routes/auth");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);
const cors = require("cors");

const mongoose = require("mongoose");

require("dotenv").config();

const port = process.env.PORT;
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// check working server
app.get("/", (req, res, next) => {
  return res.send({ message: "working fine!!" });
});

app.use(authRouter);

io.on("connection", (socket) => {
  console.log("connected to socket");
});

server.listen(port, () => {
  console.log(`Server listening to ${port}`);
});

mongoose
  .connect(`${process.env.DATABASE}`)
  .then((result) => {
    console.log("connected to database!!");
  })
  .catch((err) => {
    console.log("connection failed!!");
    console.log(err);
  });

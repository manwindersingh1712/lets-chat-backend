const express = require("express");
const http = require("http");
const Room = require("./models/Room");
const authRouter = require("./routes/auth");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: ["*"], // For All origin
  },
});

const cors = require("cors");

const mongoose = require("mongoose");
const User = require("./models/User");

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
app.use(require("./routes/room"));

io.on("connection", (socket) => {
  console.log("connected to socket");
  socket.on("join", async (joinerID) => {
    const { roomIds } = await User.findOne({ _id: joinerID });

    roomIds.map((room) => {
      socket.join(JSON.stringify(room));
    });
  });
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

// Error handling
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ err: error, message });
});

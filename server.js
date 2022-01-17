const express = require("express");
const http = require("http");
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
const Message = require("./models/message");

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
app.use(require("./routes/message"));

io.on("connection", async (socket) => {
  console.log("connected to socket");
  socket.on("join", async (joinerID) => {
    const { roomIds } = await User.findOne({ _id: joinerID });

    roomIds.map((room) => {
      console.log(room);
      socket.join(room.toString());
    });
    console.log(socket.rooms);
  });

  socket.on("send-message", async (data) => {
    try {
      const { from, msg, roomId, createdAt, id } = data;
      io.sockets.to(roomId).emit("get-message", { ...data });
      let newMessage = new Message({
        _id: id,
        from,
        msg,
        roomId,
        createdAt,
      });
      newMessage.save();

      const { roomIds } = await User.findOne({ _id: joinerID });
      await roomIds.findOneAndUpdate({ _id: roomId });
    } catch (err) {
      console.log(err);
    }
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

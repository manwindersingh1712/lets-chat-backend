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

io.on("connection", (socket) => {
  socket.on("join", (joinerID) => {
    rooms
      .find({ $or: [{ p1: joinerID }, { p2: joinerID }] })
      .then(async (rooms) => {
        rooms.map((room) => {
          socket.join(JSON.stringify(room._id));
        });
      });
  });

  socket.on("send-message", async (data) => {
    try {
      const { from, msg, roomID } = data;
      const roomDoc = await rooms.findById(roomID);
      let { read, p1, p2 } = roomDoc;

      const to = p1.equals(mongoose.Types.ObjectId(from)) ? p2 : p1;
      socket.to(JSON.stringify(roomID)).emit("get-message", { ...data, to });
      let newMessage = new messages({
        roomID,
        from,
        to,
        msg,
      });
      newMessage.save();

      // updating cache for new message after saving it to DB
      updateCachedRoomMessages(roomID, newMessage);

      read = {
        p1: mongoose.Types.ObjectId(from).equals(p1),
        p2: mongoose.Types.ObjectId(from).equals(p2),
      };
      await rooms.findOneAndUpdate(
        { _id: roomID },
        {
          read,
        }
      );
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("update-read", async (data) => {
    try {
      const { roomID, user } = data;
      const room = await rooms.findById(data.roomID);
      let { p1, read } = room;
      if (mongoose.Types.ObjectId(user).equals(p1))
        read = { ...read, p1: true };
      else read = { ...read, p2: true };
      await rooms.findOneAndUpdate(
        {
          _id: roomID,
        },
        {
          read,
        },
        {
          timestamps: false,
        }
      );
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

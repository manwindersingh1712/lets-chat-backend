const Room = require("../models/Room");
const User = require("../models/User");
const middleware = require("./middleware");

const router = require("express").Router();

router.post("/create-room", middleware, async (req, res, next) => {
  const { name, userId } = req.body;

  try {
    const room = await Room.findOne({ name: name });
    if (room) {
      const error = new Error("Room already exists!");
      error.statusCode = 402;
      throw error;
    }

    const user = await User.findOne({ _id: userId });
    if (!user) {
      const error = new Error("Use not found!");
      error.statusCode = 404;
      throw error;
    }

    const myRoom = new Room({
      users: [userId],
      name,
    });

    const { _id } = await myRoom.save();
    const { roomIds } = user;
    user.roomIds = [...roomIds, _id];
    user.save();
    res.status(201).json({ message: "New Room created" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
});

router.put("/joinroom", middleware, async (req, res, next) => {
  const { userId, name } = req.body;

  try {
    const room = await Room.findOne({ name: name });
    if (!room) {
      const error = new Error("Room does not exists!");
      error.statusCode = 402;
      throw error;
    }

    const user = await User.findOne({ _id: userId });
    if (!user) {
      const error = new Error("Use not found!");
      error.statusCode = 404;
      throw error;
    }

    const { roomIds } = user;
    const { users, _id } = room;
    if (roomIds.includes(_id)) {
      const error = new Error("User is already in room!");
      error.statusCode = 403;
      throw error;
    }

    user.roomIds = [...roomIds, _id];
    user.save();

    room.users = [...users, userId];
    room.save();

    res.status(201).json({ message: "New Room created" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
});

module.exports = router;

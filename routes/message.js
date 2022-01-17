const router = require("express").Router();
const middleware = require("./middleware");
const message = require("../models/message");

// get users
router.get(
  "/getallmessages/:roomid",
  middleware,
  async (req, res, next) => {
    const { roomid } = req.params;

    try {
      const messages = await message.find({ roomId: roomid });
      //   If room id is not found
      if (!message) {
        const error = new Error("Message not found!");
        error.statusCode = 404;
        throw error;
      }

      res.send(messages);
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
);

module.exports = router;

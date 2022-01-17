const Room = require("../models/Room");

const router = require("express").Router();

router.post("/create-room", async (req, res, next) => {
  const { name } = req.body;

  try {
    const room = await Room.findOne({ name: name });

    if (room) {
        
    }

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
});

module.exports = router;

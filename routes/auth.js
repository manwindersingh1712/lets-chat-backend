const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const User = require("../models/User");

// Sign up
router.post("/signup", async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed!!");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  try {
    const hashedPass = await bcrypt.hash(password, 12);
    const user = new User({
      name: name,
      email: email,
      password: hashedPass,
      roomIds: [""],
    });

    user.save();
    res.status(201).json({ message: "New admin Registered" });
  } catch (err) {
    console.log(err);
  }
});

// Login
router.post("/login", (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("User not found with the given email!");
      error.statusCode = 400;
      throw error;
    }

    const isPassCorrect = await bcrypt.compare(password, loadAdmin.password);

    if (!isPassCorrect) {
      const error = new Error("Password didn't match!");
      error.statusCode = 400;
      throw error;
    }

    const token = jwt.sign(
      {
        email: user.email,
        adminId: user._id.toString(),
      },
      process.env.TOP_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token: token, userId: user._id.toString() });
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("User not found with the given email!");
      error.statusCode = 400;
      throw error;
    }

    const isPassCorrect = await bcrypt.compare(password, loadAdmin.password);

    if (!isPassCorrect) {
      const error = new Error("Password didn't match!");
      error.statusCode = 400;
      throw error;
    }

    const token = jwt.sign(
      {
        email: user.email,
        adminId: user._id.toString(),
      },
      process.env.TOP_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token: token, userId: user._id.toString() });
  } catch (error) {
    console.log(error);
  }
});



module.exports = router;

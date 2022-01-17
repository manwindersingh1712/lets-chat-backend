const authRouter = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const middleware = require("./middleware");
const User = require("../models/User");

// get users
authRouter.get("/getuser/:userId", middleware, async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ _id: userId }).populate("roomIds");
    //   If user doesnot exists send error
    if (!user) {
      const error = new Error("User not found!");
      error.statusCode = 404;
      throw error;
    }

    res.send(user);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
});

// Sign up
authRouter.post("/signup", async (req, res, next) => {
  const { email, name, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    //   If user doesnot exists return
    if (user) {
      const error = new Error("User already exists!");
      error.statusCode = 409;
      throw error;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation Failed!!");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const hashedPass = await bcrypt.hash(password, 12);
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPass,
      roomIds: [],
    });

    newUser.save();
    res.status(201).json({ message: "New admin Registered" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
});

// Login
authRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("User not found with the given email!");
      error.statusCode = 400;
      throw error;
    }

    const isPassCorrect = await bcrypt.compare(password, user.password);

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
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
});

module.exports = authRouter;

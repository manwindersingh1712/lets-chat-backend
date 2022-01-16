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

module.exports = router;

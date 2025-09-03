const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const jWT_secret = "nisargisagood$boy";
var fetchuser = require("../middleware/fetchuser");
router.post(
  "/createuser",
  [
    body("name", "Name must be at least 3 characters").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 3 characters").isLength({
      min: 3,
    }),
  ],
  async (req, res) => {
    let success = false; // declare success here
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ success, errors: result.array() });
      }

      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success, error: "Sorry, email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secpass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secpass,
      });

      const data = { user: { id: user.id } };
      const authToken = jwt.sign(data, jWT_secret);

      success = true;
      return res.json({ success, authToken }); // send one object
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ success, error: "Internal Server Error" });
    }
  }
);

// login of a user /api/auth/login ( login required)
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 3 characters").exists(),
  ],
  async (req, res) => {
    let success = false;
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }
      const { email, password } = req.body;
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success, error: "Please type correct crediantioals" });
      }
      const passCompare = await bcrypt.compare(password, user.password);
      if (!passCompare) {
        success = false;
        return res
          .status(400)
          .json({ success, error: "Please type correct crediantioals" });
      }
      const data = { user: { id: user.id } };
      const authToken = jwt.sign(data, jWT_secret);
      success = true;
      res.send({ message: "Logged is Successfully", authToken, success });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ error: "internal server erro" });
    }
  }
);

//// Get all notes of a user /api/auth/getnotes ( login required)
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    let user = await User.findById(userId).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal server error" });
  }
});

module.exports = router;

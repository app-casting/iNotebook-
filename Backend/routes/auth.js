const express = require("express");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "Hey welcome to your note's";
const fetchUser = require("../middleware/fetchUser");

// const app = express();

// app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }))

// ROUTE 1:create a user using   POST "api/auth/createuser"
router.post(
  "/createuser",
  [
    check("email", "Enter a valid email ID").isEmail(),
    check(
      "password",
      "Password length should be a minimum of 8 characters"
    ).isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      return res
        .status(400)
        .json({ error: "User with the mail ID already exist" });
    }
    try {
      const saltRounds = await bcrypt.genSalt(10);
      let secPassword = await bcrypt.hash(req.body.password, saltRounds);
      const newuser = new User({
        name: req.body.name,
        password: secPassword,
        email: req.body.email,
      });

      const data = {
        user: {
          id: newuser.id,
        },
      };

      // handling the jwt
      const authToken = jwt.sign(data, JWT_SECRET);
      newuser.save();
      res.json({ authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
// ROUTE 2:Logging in the  user using   POST "api/auth/login"
router.post(
  "/login",
  [
    check("email", "Enter a valid email ID").isEmail(),
    check("password", "Password cannot be empty").exists({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let newUser = await User.findOne({ email });
      if (!newUser) {
        return res
          .status(400)
          .json({ error: "Please enter vaild credintials" });
      }
      const passwordCompare = await bcrypt.compare(password, newUser.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please enter vaild credintials" });
      }
      const data = {
        user: {
          id: newUser.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
// ROUTE 3: Get logged in user details using POST "api/auth/getuser Login required

router.post("/getuser",fetchUser, async (req, res) => {
  try {
    let userID = req.user.id;
    const user = await User.findById(userID).select("-password");
    res.send(user)
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;

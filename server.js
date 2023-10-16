const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var cors = require("cors");
require("dotenv").config();

const { userModel } = require("./models/User.model");
const { connection } = require("./Connection/connection");
const { authenticate } = require("./MiddleWares/Authenticate");
const { EmpRoutes } = require("./routes/emp.route");

const app = express();

app.use(express.json());
app.use(cors());
app.get("/user", authenticate, async (req, res) => {
  const user = await userModel.findOne({ _id: req.userID });
  if (user) {
    res.status(200).send(user);
  } else {
    res.status(400).send({ msg: "bad request" });
  }
});
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    bcrypt.hash(password, 5, async function (err, hash) {
      await userModel.create({ email, password: hash });
      console.log(hash);
      res.status(201).json({ response: "User created successfully" });
    });
  } catch (error) {
    res.status(500).json({ response: "Error occurred" });
  }
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      const hash = user?.password;
      console.log(user);
      bcrypt.compare(password, hash, function (err, result) {
        if (!err && result) {
          var token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET);
          res.status(200).json({ response: "Login successful", token: token });
        } else {
          res.status(401).json({ message: "Incorrect credentials" });
        }
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ response: "Error occurred" });
  }
});
app.use(authenticate);
app.use("/employees", EmpRoutes);

app.listen(8000, async () => {
  try {
    await connection;
    console.log("DB connected");
  } catch (error) {
    console.log("DB connection failed");
  }
  console.log("listening at 8000");
});

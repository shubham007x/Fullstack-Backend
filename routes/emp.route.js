const express = require("express");
const { EmpModel } = require("../models/Emp.model");
const EmpRoutes = express.Router();
EmpRoutes.post("/", async (req, res) => {
  const userID = req.userID;

  const { name, lastname, email, department, salary } = req.body;
  console.log(name, lastname, email, department, salary);

  try {
    const data = await EmpModel.create({
      name,
      lastname,
      email,
      department,
      salary,
    });
    res
      .status(201)
      .json({ response: "Feed Uploaded Successfully", data: data });
  } catch (error) {
    res.status(500).json({ response: "Emp Create Failed" });
    console.log(error);
  }
});

EmpRoutes.get("/get", async (req, res) => {
  try {
    const data = await EmpModel.find();
    console.log(data);
    res.status(201).json({ data: data });
  } catch (error) {
    res.status(500).json({ response: "Failed" });
  }
});
EmpRoutes.delete("/:EmpID", async (req, res) => {
  try {
    const { EmpID } = req.params;

    const authorID = req.userID;

    const feed = await EmpModel.findOne({ _id: EmpID });
    console.log(feed);
    if (feed?.authorID == authorID) {
      await FeedModel.findByIdAndDelete(EmpID);
      res.status(200).json({ response: "Feed Deleted Successfully" });
    } else {
      res.status(401).json({ response: "Not Authorized" });
    }
  } catch (error) {
    res.status(400).json({ response: "Feed Delete Failed" });
  }
});
module.exports = { EmpRoutes };

const mongoose = require("mongoose");

const EmpSchema = mongoose.Schema({
  name: { type: String, require: true },
  lastname: { type: String, require: true },
  email: { type: String, required: true },
  department: { type: String, required: true },
  salary: { type: String, required: true },
});

const EmpModel = mongoose.model("employee", EmpSchema);
module.exports = { EmpModel };

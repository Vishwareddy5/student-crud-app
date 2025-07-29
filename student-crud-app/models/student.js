const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  roll: {
    type: Number,
    required: true,
    unique: true,
  },
  branch: String,
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;

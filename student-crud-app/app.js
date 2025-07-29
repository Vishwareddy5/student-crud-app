const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const app = express();
const Student = require("./models/student");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose
  .connect("mongodb://127.0.0.1:27017/studentDB", {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(`Mongo connection faild due to \nError : ${err}`);
  });

app.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.render("index", { students: students });
  } catch (err) {
    console.log("Error retreiving students", err);
    res.status(500).send("Error retreiving students");
  }
});

// Add a student
app.get("/students/new", (req, res) => {
  try {
    res.render("new");
  } catch (err) {
    console.log("Error while routing to /students/new:\n", err);
    res.status(500).send("Error while routing to /students/new :\n", err);
  }
});
app.post("/students", async (req, res) => {
  try {
    const student = new Student({
      name: req.body.name,
      roll: req.body.roll,
      branch: req.body.branch,
    });
    await student.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error saving student\n", err);
  }
});
//Edit route
app.get("/students/:id/edit", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    res.render("edit", { student });
  } catch (err) {
    console.log("Error fetching student ", err);
    res.status(500).send("student not found");
  }
});
app.put("/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      roll: req.body.roll,
      branch: req.body.branch,
    });
    res.redirect("/");
  } catch (err) {
    console.error(" Error updating student:", err);
    res.status(500).send("Failed to update student");
  }
});
// delete route
app.delete("/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    console.error("❌ Error deleting student:", err);
    res.status(500).send("Failed to delete student");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});

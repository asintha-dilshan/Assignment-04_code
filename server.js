/*********************************************************************************
 *  WEB700 – Assignment 03
 *  I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including 3rd party web sites) or distributed to other students.
 *
 *  Name: Asintha Dilshan Jayasekara Wisurumana Arachchige
 *  Student ID: 170388235
 *  Date: 02/16/2025
 ********************************************************************************/

const express = require("express");
const path = require("path");
const collegeData = require("./modules/collegeData");
const bodyParser = require("body-parser");
const app = express();
app.use(express.static("public"));
const HTTP_PORT = process.env.PORT || 8080;

// 404 Page Route
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse form data (addStudenyt)
app.use(express.urlencoded({ extended: true }));

// Route to Serve addStudent.html
app.get("/students/add", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "addStudent.html"));
});

// Home Page Route
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

// About Page Route
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});

// HTML Demo Page Route
app.get("/htmlDemo", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "htmlDemo.html"));
});

// Get all students or by course
app.get("/students", (req, res) => {
  if (req.query.course) {
    collegeData
      .getStudentsByCourse(req.query.course)
      .then((students) => res.json(students))
      .catch(() => res.json({ message: "no results" }));
  } else {
    collegeData
      .getAllStudents()
      .then((students) => res.json(students))
      .catch(() => res.json({ message: "no results" }));
  }
});

// Get all Teaching Assistants
app.get("/tas", (req, res) => {
  collegeData
    .getTAs()
    .then((tas) => res.json(tas))
    .catch(() => res.json({ message: "no results" }));
});

// Get all courses
app.get("/courses", (req, res) => {
  collegeData
    .getCourses()
    .then((courses) => res.json(courses))
    .catch(() => res.json({ message: "no results" }));
});

// Get a student by student number
app.get("/student/:num", (req, res) => {
  collegeData
    .getStudentByNum(req.params.num)
    .then((student) => res.json(student))
    .catch(() => res.json({ message: "no results" }));
});

app.get("/students", (req, res) => {
  collegeData
    .getAllStudents()
    .then((students) => {
      console.log("Students Retrieved:", students.length);
      res.json(students);
    })
    .catch((err) => res.status(500).send("Error retrieving students"));
});

// Route to Handle Form Submission
app.post("/students/add", (req, res) => {
  collegeData
    .addStudent(req.body)
    .then(() => {
      res.send(`
                <html>
                <head>
                    <title>Student Added</title>
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
                </head>
                <body class="d-flex justify-content-center align-items-center vh-100">
                    <div class="text-center">
                        <h2 class="mb-4">Student Added Successfully!</h2>
                        <a href="/home" class="btn btn-primary">Go Back to Home</a>
                        <a href="/students" class="btn btn-success">View All Students</a>
                    </div>
                </body>
                </html>
            `);
    })
    .catch((err) => res.status(500).send(err));
});

// Handle 404 Errors
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

(async () => {
  try {
    await collegeData
      .initialize()
      .then(() => {
        app.listen(process.env.PORT, () => {
          console.log(`Server listening on port ${process.env.PORT}`);
        });
      })
      .catch((err) => {
        console.error("Failed to initialize data: ", err);
      });
    console.log("Data initialized successfully");
  } catch (err) {
    console.error("Failed to initialize data: ", err);
  }
})();

// Export app for Vercel
module.exports = app;

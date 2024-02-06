const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const {
  signIn,
  register,
} = require("./src/controllers/authController/authController");
const {
  createProject,
  getProject,
  deleteProject,
  updateProject,
} = require("./src/controllers/projectController/projectController");
const dotenv = require("dotenv");
const {
  createProjectUser,
  getProjectUsers,
  deleteProjectUser,
  updateProjectUser,
} = require("./src/controllers/userController/userController");
const {
  createTask,
  getTasks,
  deleteTask,
  updateTask,
} = require("./src/controllers/taskController/taskController");

dotenv.config();

const app = express();
const PORT = 3000;
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200);
  res.send("Welcome to root URL of Server");
});

app.post("/signin", signIn);
app.post("/register", register);
app.post("/create-project", createProject);
app.post("/get-project", getProject);
app.delete("/delete-project/:id", deleteProject);
app.patch("/update-project/:id", updateProject);
app.post("/create-user", createProjectUser);
app.post("/get-users", getProjectUsers);
app.delete("/delete-user/:id", deleteProjectUser);
app.patch("/update-user/:id", updateProjectUser);
app.post("/create-task", createTask);
app.post("/get-task", getTasks);
app.delete("/delete-task/:id", deleteTask);
app.patch("/update-task/:id", updateTask);

app.listen(PORT, (error) => {
  if (!error) {
    console.log(
      `Server is Successfully Running, and App is listening on port ${PORT}`
    );
  } else {
    console.error("Error occurred, server can't start", error);
  }
});

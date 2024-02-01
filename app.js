const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const {signIn,register} = require("./src/controllers/authController/authController")
const { createProject, getProject } = require("./src/controllers/projectController/projectController");
const dotenv= require("dotenv");

dotenv.config()

const app = express();
const PORT = 3000;
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200);
  res.send("Welcome to root URL of Server");
});

app.post('/signin', signIn);

app.post('/register', register);
app.post('/create-project', createProject);
app.get('/get-project', getProject);

app.listen(PORT, (error) => {
  if (!error) {
    console.log(
      `Server is Successfully Running, and App is listening on port ${PORT}`
    );
  } else {
    console.error("Error occurred, server can't start", error);
  }
});

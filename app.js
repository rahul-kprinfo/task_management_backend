const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const projectRouter = require("./src/routes/projectRouter");
const taskRouter = require("./src/routes/taskRouter");
const userRouter = require("./src/routes/userRouter");
const authRouter = require("./src/routes/authRouter");
const verifyToken = require("./middleware/authMiddleware");
dotenv.config();
const app = express();
const PORT = 3000;
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200);
  res.send("Welcome to root URL of Server");
});

app.use("/project", verifyToken, projectRouter);
app.use("/task", verifyToken, taskRouter);
app.use("/user", verifyToken, userRouter);
app.use("/", authRouter);

app.listen(PORT, (error) => {
  if (!error) {
    console.log(
      `Server is Successfully Running, and App is listening on port ${PORT}`
    );
  } else {
    console.error("Error occurred, server can't start", error);
  }
});

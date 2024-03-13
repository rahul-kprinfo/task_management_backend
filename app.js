// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const dotenv = require("dotenv");
// const projectRouter = require("./src/routes/projectRouter");
// const taskRouter = require("./src/routes/taskRouter");
// const userRouter = require("./src/routes/userRouter");
// const authRouter = require("./src/routes/authRouter");
// const verifyToken = require("./middleware/authMiddleware");
// dotenv.config();
// const app = express();
// const PORT = 3000;
// app.use(cors());
// app.use(bodyParser.json());

// app.get("/", (req, res) => {
//   res.status(200);
//   res.send("Welcome to root URL of Server");
// });

// app.use("/project", verifyToken, projectRouter);
// app.use("/task", verifyToken, taskRouter);
// app.use("/user", verifyToken, userRouter);
// app.use("/", authRouter);

// app.on("connection", (socket) => {
//   console.log(`a user connected ${socket.id}`);

//   socket.on("send_message", (data) => {
//     socket.broadcast.emit("receive_message", data);
//   });
// });

// app.listen(PORT, (error) => {
//   if (!error) {
//     console.log(
//       `Server is Successfully Running, and App is listening on port ${PORT}`
//     );
//   } else {
//     console.error("Error occurred, server can't start", error);
//   }
// });

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const http = require("http");
const socketIo = require("socket.io");
const session = require("express-session");
const sessionSocketIo = require("express-session-socket.io");
const projectRouter = require("./src/routes/projectRouter");
const taskRouter = require("./src/routes/taskRouter");
const userRouter = require("./src/routes/userRouter");
const authRouter = require("./src/routes/authRouter");
const verifyToken = require("./middleware/authMiddleware");
const isValidToken = require("./middleware/jwtHelper");
const prisma = require("./db/prisma");
const authController = require("./src/routes/authRouter");

dotenv.config();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200).send("Welcome to root URL of Server");
});

app.use("/project", verifyToken, projectRouter);
app.use("/task", verifyToken, taskRouter);
app.use("/user", verifyToken, userRouter);
app.use("/", authRouter);

const server = http.createServer(app);

const io = socketIo(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

global.io = io;

io.on("connection", (socket) => {
  socket.on("login", async (email) => {
    try {
      // Find the user by email
      const user = await prisma.user.findMany({
        where: {
          email: email,
        },
      });

      if (!user) {
        // User not found, emit an event to notify the client
        socket.emit("userNotFound", {
          message: "User not found",
        });
        return;
      }

      const activeSessions = await prisma.session.findMany({
        where: {
          userId: user.id,
        },
      });

      if (activeSessions.length > 0) {
        // Notify user on other devices
        socket.emit("multipleLogin", {
          message: "User is already logged in elsewhere",
        });
        console.log("Multiple logins detected");
      } else {
        // No active sessions, proceed with login
        // socket.emit("proceedWithLogin", {
        //   userId: user.id,
        // });
      }
    } catch (error) {
      console.error("Error during login:", error);
      socket.emit("loginError", {
        message: "An error occurred during login",
      });
    }
  });

  socket.on("confirmLogin", async (email) => {
    try {
      const user = await prisma.user.findMany({
        where: {
          email: email,
        },
      });
      await prisma.session.deleteMany({
        where: {
          userId: user.id,
        },
      });

      socket.emit("proceedWithLogin");
    } catch (error) {
      console.error("Error deleting sessions:", error);
    }
  });

  socket.on("disconnect", () => {
    // Handle socket disconnection
  });
});

server.listen(PORT, () => {
  console.log(`Server is running and listening on port ${PORT}`);
});

module.exports = io;

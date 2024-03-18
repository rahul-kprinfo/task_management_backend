const bcrypt = require("bcrypt");
const prisma = require("../../../db/prisma");
const jwt = require("jsonwebtoken");
const cron = require("node-cron");
const { v4: uuidv4 } = require("uuid");
const io = require("../../../app");

function generateSessionId() {
  return uuidv4();
}

// exports.signIn = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const data = await prisma.user.findMany({
//       where: {
//         email: email,
//       },
//     });

//     const user = data;
//     if (user?.length === 0) {
//       res.status(400).json({
//         message: "User is not registered, Sign Up first",
//         status: false,
//       });
//     } else if (user?.[0].active === false) {
//       res.status(400).json({
//         message:
//           "User account is inactive. Please activate your account first.",
//         status: false,
//       });
//     } else {
//       const passwordMatch = await bcrypt.compare(password, user[0]?.password);
//       if (passwordMatch) {
//         const token = jwt.sign(
//           { userId: user[0].id, username: user[0].email },
//           process.env.SECRET_KEY,
//           { expiresIn: "1h" }
//         );

//         await prisma.user.update({
//           where: { id: user[0].id },
//           data: { lastLoginAt: new Date() },
//         });

//         res.json({
//           token,
//           username: user[0]?.name,
//           email: user[0]?.email,
//           message: "Signed In successfully",
//         });
//       } else {
//         res.status(401).json({
//           message: "Invalid password",
//           status: false,
//         });
//       }
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       error: "Database error occurred while signing in!",
//     });
//   }
// };

exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const data = await prisma.user.findMany({
      where: {
        email: email,
      },
    });

    const user = data;
    if (user?.length === 0) {
      res.status(400).json({
        message: "User is not registered, Sign Up first",
        status: false,
      });
    } else if (user?.[0].active === false) {
      res.status(400).json({
        message:
          "User account is inactive. Please activate your account first.",
        status: false,
      });
    } else {
      const passwordMatch = await bcrypt.compare(password, user[0]?.password);
      if (passwordMatch) {
        const activeSessions = await prisma.session.findMany({
          where: {
            userId: user[0].id,
          },
        });

        if (activeSessions.length > 0) {
          return;
        }

        const session = await prisma.session.create({
          data: {
            sessionId: generateSessionId(),
            userId: user[0].id,
          },
        });

        await prisma.user.update({
          where: { id: user[0].id },
          data: { sessionId: session.id.toString() }, // Convert session ID to string
        });

        const token = jwt.sign(
          { userId: user[0].id, username: user[0].email },
          process.env.SECRET_KEY,
          { expiresIn: "7d" }
        );

        await prisma.user.update({
          where: { id: user[0].id },
          data: { lastLoginAt: new Date() },
        });

        res.status(200).json({
          token,
          username: user[0].name,
          email: user[0]?.email,
          id: user[0]?.id,
          sessionId: session?.sessionId,
          message: "Signed In successfully",
        });
      } else {
        res.status(401).json({
          message: "Invalid password",
          status: false,
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Database error occurred while signing in!",
    });
  }
};

exports.logout = async (req, res) => {
  const { userId } = req.body;
  try {
    await prisma.session.deleteMany({
      where: {
        userId: parseInt(userId),
      },
    });

    return res.status(200).json({
      message: "Logged out successfully",
      status: true,
    });
  } catch (error) {
    console.error("Error deleting session from database:", error);
    res.status(500).json({ message: "Failed to log out" });
  }
};

exports.getSession = async (req, res) => {
  const { userId } = req.body;
  try {
    const sessionId = await prisma.session.findMany({
      where: {
        userId: parseInt(userId),
      },
    });

    return res.status(200).json({
      message: "Success",
      status: true,
      sessionId: sessionId[0]?.sessionId,
    });
  } catch (error) {
    console.error("Error deleting session from database:", error);
    res.status(500).json({ message: "Failed to log out" });
  }
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await prisma.user.findMany({
      where: {
        email: email,
      },
    });

    if (existingUser?.length > 0) {
      return res.status(400).json({
        message: "User is already registered",
        status: false,
      });
    }
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(password, saltRound);

    const userData = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });

    return res.status(200).json({
      message: "Registration successful",
      data: userData,
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Database error occurred while registering!",
    });
  }
};

// Logout route

exports.verifyEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await prisma.user.findMany({
      where: {
        email: email,
      },
    });

    if (existingUser?.length === 0) {
      return res.status(400).json({
        message: "User not found",
        status: false,
      });
    }

    return res.status(200).json({
      message: "Email verified",
      data: existingUser,
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Database error occurred while verifying email!",
    });
  }
};

exports.forgotPassword = async (req, res) => {
  const { id, newPassword } = req.body;
  try {
    const saltRound = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRound);

    await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: {
        password: hashedNewPassword,
        active: true,
      },
    });

    return res.status(200).json({
      message: "Password changed successfully",
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while changing password",
    });
  }
};

// Function to de-activate for inactive users
async function deactivateInactiveUsers() {
  try {
    const inactiveUsers = await prisma.user.findMany({
      where: {
        lastLoginAt: {
          lt: new Date(Date.now() - 60 * 1000),
        },
      },
    });

    for (const user of inactiveUsers) {
      await prisma.user.update({
        where: { id: user.id },
        data: { active: false },
      });

      console.log(`User ${user.name} deactivated`);
    }

    console.log(`${inactiveUsers.length} inactive users.`);
  } catch (error) {
    console.error("Error while de-activating user:", error);
  }
}

cron.schedule("0 0 * * *", deactivateInactiveUsers); // this will run every minute

const bcrypt = require("bcrypt");
const prisma = require("../../../db/prisma");
const jwt = require("jsonwebtoken");
const secretKey = "your_secret_key";
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
    } else {
      const passwordMatch = await bcrypt.compare(password, user[0]?.password);
      if (passwordMatch) {
        const token = jwt.sign(
          { userId: user[0].id, username: user[0].email },
          process.env.SECRET_KEY,
          { expiresIn: "1h" }
        );
        res.json({
          token,
          username: user[0]?.name,
          email: user[0]?.email,
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

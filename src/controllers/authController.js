const bcrypt = require("bcrypt");
const prisma = require("../../db/prisma");

const signIn = async (req, res) => {
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
        status:false
      });
    } else {
      const passwordMatch = await bcrypt.compare(password, user[0]?.password);
      if (passwordMatch) {
        res.status(200).json({ message: "Signin successful", user, status:true });
      } else {
        res.status(401).json({
          error: "Invalid password",
          status:false
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

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await prisma.user.findMany({
      where: {
        email: email,
      },
    });
    console.log("existingUser", existingUser);

    if (existingUser.length > 0) {
      return res.status(400).json({
        error: "User is already registered",
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

    return res
      .status(200)
      .json({ message: "Registration successful", data: userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Database error occurred while registering!",
    });
  }
};



module.exports = { signIn, register };

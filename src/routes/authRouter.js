const express = require("express");
const router = express.Router();

const projectControllers = require("../controllers/projectController/projectController");
const authRouter = require("../controllers/authController/authController");

//Auth Routers
router.post("/signin", authRouter.signIn);
router.post("/register", authRouter.register);
router.post("/verifyEmail", authRouter.verifyEmail);
router.patch("/forgotPassword", authRouter.forgotPassword);
module.exports = router;

const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController/userController");
//users Router
router.post("/get", userController.getProjectUsers);
router.post("/create", userController.createProjectUser);
router.patch("/update/:id", userController.updateProjectUser);
router.delete("/delete/:id", userController.deleteProjectUser);

module.exports = router;

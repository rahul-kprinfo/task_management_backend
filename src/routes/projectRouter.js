const express = require("express");
const router = express.Router();

const projectControllers = require("../controllers/projectController/projectController");

//Project Routers
router.post("/get", projectControllers.getProject);
router.post("/create", projectControllers.createProject);
router.patch("/update/:id", projectControllers.updateProject);
router.delete("/delete/:id", projectControllers.deleteProject);

module.exports = router;

const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController/taskController");
//Project Routers
router.post("/get", taskController.getTasks);
router.get("/get-one/:id", taskController.getOneTask);
router.post("/create", taskController.createTask);
router.patch("/update/:id", taskController.updateTask);
router.delete("/delete/:id", taskController.deleteTask);

module.exports = router;

const express = require("express");
const router = express.Router();

const commentController = require("../controllers/commentController/commentController");

//Comments Routers
router.get("/get/:taskId", commentController.getComments);
router.post("/create", commentController.createComment);

module.exports = router;

const express = require("express");
const router = express.Router();

const commentController = require("../controllers/commentController/commentController");

//Comments Routers
router.get("/get/:taskId", commentController.getComments);
router.post("/create", commentController.createComment);
router.delete("/delete/:id", commentController.deleteComment);
router.patch("/update/:id", commentController.updateComment);

module.exports = router;

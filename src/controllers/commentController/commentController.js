const prisma = require("../../../db/prisma");

exports.createComment = async (req, res) => {
  const { taskId, content, userName } = req.body;

  try {
    const createComment = await prisma.comment.create({
      data: {
        taskId: parseInt(taskId),
        content: content,
        userName: userName,
      },
    });

    return res.status(201).json({
      status: true,
      message: "Comment added successfully",
      data: createComment,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({
      status: false,
      error: "Database error occurred while adding comment!",
    });
  }
};

exports.getComments = async (req, res) => {
  const { taskId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: {
        taskId: parseInt(taskId),
      },
    });

    return res.status(200).json({
      message: "Success",
      data: comments, // Sending all comments associated with the task
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Database error occurred while getting comments!",
    });
  }
};

exports.updateComment = async (req, res) => {
  const { id } = req.params;
  const { content, userName } = req.body;

  try {
    const updatedComment = await prisma.comment.update({
      where: {
        id: parseInt(id),
      },
      data: {
        content: content,
        userName: userName,
      },
    });

    return res.status(200).json({
      message: "Comment updated successfully",
      data: comments, // Sending all comments associated with the task
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Database error occurred while getting comments!",
    });
  }
};

exports.deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedComment = await prisma.comment.delete({
      where: {
        id: parseInt(id),
      },
    });

    return res.status(200).json({
      message: "Comment deleted successfully",
      data: deletedComment,
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Database error occurred while deleting!",
    });
  }
};

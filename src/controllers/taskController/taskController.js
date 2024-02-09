const prisma = require("../../../db/prisma");
const _ = require("lodash");

const createTask = async (req, res) => {
  const {
    taskName,
    description,
    priority,
    user,
    projectId,
    estimation,
    projectUserId,
    parentTaskId,
    taskStatus,
    childTaskId,
  } = req.body;

  try {
    const createdTask = await prisma.task.create({
      data: {
        taskName: taskName,
        description: description,
        priority: priority,
        user: user,
        projectId: projectId,
        estimation: estimation,
        projectUserId: projectUserId,
        parentTaskId: parentTaskId,
        taskStatus: taskStatus,
        childTaskId: childTaskId,
      },
    });

    return res.status(201).json({
      status: true,
      message: "Task created successfully",
      data: createdTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({
      status: false,
      error: "Database error occurred while creating task!",
    });
  }
};

const getTasks = async (req, res) => {
  const { projectId, skip, limit } = req.body;
  const page = limit ? limit : 10;

  try {
    const [data, totalCount] = await Promise.all([
      prisma.task.findMany({
        skip: skip,
        take: page,
        where: {
          projectId: projectId,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.task.count({
        where: {
          projectId: projectId,
        },
      }),
    ]);

    return res.status(200).json({
      message: "Success",
      data: data,
      totalCount: totalCount,
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Database error occurred while getting tasks!",
    });
  }
};

const getOneTask = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await prisma.task.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    const getChildData1 = await prisma.task.findMany({
      where: {
        parentTaskId: parseInt(id),
      },
    });

    const ids = data?.childTaskId;
    const getChildData2 = await prisma.task.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    const getChildData = [...getChildData1, ...getChildData2];

    return res.status(200).json({
      message: "Success",
      data: { data, childData: _.unionBy(getChildData, "id") },
      status: true,
    });
  } catch (error) {
    console.error(error);
    S;
    res.status(500).json({
      error: "Database error occurred while getting tasks!",
    });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTask = await prisma.task.delete({
      where: {
        id: parseInt(id),
      },
    });
    const deleteChildTask = await prisma.task.deleteMany({
      where: {
        parentTaskId: parseInt(id),
      },
    });

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found",
        status: false,
      });
    }

    return res.status(200).json({
      message: "Task deleted successfully",
      data: deletedTask,
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Database error occurred while deleting task!",
    });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const {
    taskName,
    description,
    priority,
    user,
    projectId,
    projectUserId,
    parentTaskId,
    taskStatus,
    childTaskId,
  } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: parseInt(id),
      },
      data: {
        taskName: taskName,
        description: description,
        priority: priority,
        user: user,
        projectId: projectId,
        projectUserId: projectUserId,
        parentTaskId: parentTaskId,
        taskStatus: taskStatus,
        childTaskId: childTaskId,
      },
    });

    return res.status(200).json({
      status: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        status: false,
        message: "Task not found",
      });
    }

    return res.status(500).json({
      status: false,
      error: "Database error occurred while updating task!",
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  deleteTask,
  updateTask,
  getOneTask,
};

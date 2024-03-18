const prisma = require("../../../db/prisma");

exports.createProject = async (req, res) => {
  const { projectName } = req.body;

  try {
    const duplicateProjects = await prisma.project.findMany({
      where: {
        projectName: projectName,
      },
    });

    if (duplicateProjects.length > 0) {
      return res.status(409).json({
        status: false,
        message: "The project has already been created.",
      });
    }

    const createdProject = await prisma.project.create({
      data: {
        projectName: projectName,
      },
    });

    return res.status(201).json({
      status: true,
      message: "Project created successfully",
      data: createdProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({
      status: false,
      error: "Database error occurred while creating!",
    });
  }
};

exports.getProject = async (req, res) => {
  const { skip, limit } = req.body;
  const page = limit ? limit : 10;
  try {
    const [data, totalCount] = await Promise.all([
      prisma.project.findMany({
        skip: skip,
        take: page,
        where: {
          status: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.project.count({
        where: {
          status: true,
        },
      }),
    ]);
    const session = await prisma.session.findMany();

    console.log("session", session);

    return res.status(200).json({
      message: "Success",
      data: data,
      totalcount: totalCount,
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Database error occurred while getting!",
    });
  }
};

exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteTask = await prisma.task.deleteMany({
      where: {
        projectId: parseInt(id),
      },
    });
    const deleteUser = await prisma.projectUser.deleteMany({
      where: {
        projectId: parseInt(id),
      },
    });

    const deletedProject = await prisma.project.delete({
      where: {
        id: parseInt(id),
      },
    });

    if (!deletedProject) {
      return res.status(404).json({
        message: "Project not found",
        status: false,
      });
    }

    return res.status(200).json({
      message: "Project deleted successfully",
      data: deletedProject,
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Database error occurred while deleting!",
    });
  }
};

exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { projectName } = req.body;

  try {
    const duplicateProjects = await prisma.project.findMany({
      where: {
        projectName: projectName,
      },
    });

    if (duplicateProjects.length > 0) {
      return res.status(409).json({
        status: false,
        message: "The project has already been created.",
      });
    }

    const updatedProject = await prisma.project.update({
      where: {
        id: parseInt(id),
      },
      data: {
        projectName: projectName,
      },
    });

    return res.status(200).json({
      status: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    console.error("Error updating project:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        status: false,
        message: "Project not found",
      });
    }

    return res.status(500).json({
      status: false,
      error: "Database error occurred while updating!",
    });
  }
};

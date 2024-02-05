const prisma = require("../../../db/prisma");

const createProjectUser = async (req, res) => {
  const { name, email, role, projectId } = req.body;

  try {
    const duplicateProjectUsers = await prisma.projectUser.findMany({
      where: {
        email: email,
        projectId: projectId,
      },
    });

    if (duplicateProjectUsers.length > 0) {
      return res.status(409).json({
        status: false,
        message: "The project user already exists for the specified project.",
      });
    }

    const createdProjectUser = await prisma.projectUser.create({
      data: {
        name: name,
        email: email,
        role: role,
        projectId: projectId,
      },
    });

    return res.status(201).json({
      status: true,
      message: "Project user created successfully",
      data: createdProjectUser,
    });
  } catch (error) {
    console.error("Error creating project user:", error);
    res.status(500).json({
      status: false,
      error: "Database error occurred while creating project user!",
    });
  }
};

const getProjectUsers = async (req, res) => {
  const { projectId, skip, limit } = req.body;
  const page = limit ? limit : 10;

  try {
    const [data, totalCount] = await Promise.all([
      prisma.projectUser.findMany({
        skip: skip,
        take: page,
        // where: {
        //   projectId: projectId,
        // },
        // orderBy: {
        //   createdAt: "desc",
        // },
      }),
      //   prisma.projectUser.count({
      //     where: {
      //       projectId: projectId,
      //     },
      //   }),
    ]);

    return res.status(200).json({
      message: "Success",
      data: data,
      //   totalCount: totalCount,
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Database error occurred while getting project users!",
    });
  }
};

const deleteProjectUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProjectUser = await prisma.projectUser.delete({
      where: {
        id: parseInt(id),
      },
    });

    if (!deletedProjectUser) {
      return res.status(404).json({
        message: "Project user not found",
        status: false,
      });
    }

    return res.status(200).json({
      message: "Project user deleted successfully",
      data: deletedProjectUser,
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Database error occurred while deleting project user!",
    });
  }
};

const updateProjectUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, projectId } = req.body;

  try {
    const duplicateProjectUsers = await prisma.projectUser.findMany({
      where: {
        email: email,
        projectId: projectId,
        NOT: {
          id: parseInt(id),
        },
      },
    });

    if (duplicateProjectUsers.length > 0) {
      return res.status(409).json({
        status: false,
        message: "The project user already exists for the specified project.",
      });
    }

    const updatedProjectUser = await prisma.projectUser.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name: name,
        email: email,
        role: role,
        projectId: projectId,
      },
    });

    return res.status(200).json({
      status: true,
      message: "Project user updated successfully",
      data: updatedProjectUser,
    });
  } catch (error) {
    console.error("Error updating project user:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        status: false,
        message: "Project user not found",
      });
    }

    return res.status(500).json({
      status: false,
      error: "Database error occurred while updating project user!",
    });
  }
};

module.exports = {
  createProjectUser,
  getProjectUsers,
  deleteProjectUser,
  updateProjectUser,
};

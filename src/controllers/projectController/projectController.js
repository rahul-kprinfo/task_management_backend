const prisma = require("../../../db/prisma");

const createProject = async (req, res) => {
  const { projectName } = req.body;
  try {
    const data = await prisma.project.create({
      data: {
        projectName: projectName,
      },
    });

    return res.status(200).json({
      message: "Project created successfully",
      data: data,
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Database error occurred while creating!",
    });
  }
};
const getProject = async (req, res) => {
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
      }),
      prisma.project.count({
        where: {
          status: true,
        },
      }),
    ]);

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

const deleteProject = async (req, res) => {
  const { id } = req.params;
  console.log("idd", id)
  try {
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


module.exports = { createProject, getProject,deleteProject };

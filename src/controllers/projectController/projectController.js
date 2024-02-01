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
    // const data = await prisma.project.findMany({
    //   skip: skip,
    //   take: page,
    //   where: {
    //     status: true,
    //   },
    // });
    // const count = prisma.project.count({
    //   where: {
    //     status: true,
    //     // other conditions if needed
    //   },
    // });
    const [data, totalCount] = await Promise.all([
      prisma.project.findMany({
        skip: 1,
        take: page,
        where: {
          status: true,
          // other conditions if needed
        },
      }),
      prisma.project.count({
        where: {
          status: true,
          // other conditions if needed
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

module.exports = { createProject, getProject };

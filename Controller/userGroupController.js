import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * ✅ GET users for a specific group
 */
export const getUsersForGroup = async (req, res) => {
  try {
    const groupId = Number(req.params.groupId);
    console.log("check:", groupId);

    const userGroups = await prisma.userGroup.findMany({
      where: { groupId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            usertype: true,
            lastLogin: true,
          },
        },
        group: true,
      },
    });

    // Flatten and format user data
    const formatted = userGroups
      .map((ug) => {
        const user = ug.user;
        if (!user) return null; // skip if user relation missing

        return {
          id: user.id,
          username: user.username,
          name:
            user.firstname && user.lastname
              ? `${user.firstname} ${user.lastname}`
              : user.username,
          userType: user.usertype,
          lastLogin: user.lastLogin,
          groupCoursesAdded: ug.groupcourseadd || 0,
          isOwner: ug.isOwner || false,
        };
      })
      .filter(Boolean);

    res.status(200).json(formatted);
  } catch (error) {
    console.error("❌ Error fetching users for group:", error);
    res
      .status(500)
      .json({ message: "Error fetching users for group", error: error.message });
  }
};

/**
 * ✅ POST add user to a group
 */
export const addUserToGroup = async (req, res) => {
  try {
    const { userId, groupId, groupcourseadd } = req.body;
    if (!userId || !groupId) {
      return res
        .status(400)
        .json({ message: "userId and groupId are required" });
    }

    const userExists = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });
    if (!userExists) return res.status(404).json({ message: "User not found" });

    const groupExists = await prisma.group.findUnique({
      where: { id: Number(groupId) },
    });
    if (!groupExists)
      return res.status(404).json({ message: "Group not found" });

    const alreadyExists = await prisma.userGroup.findFirst({
      where: { userId: Number(userId), groupId: Number(groupId) },
    });
    if (alreadyExists)
      return res.status(400).json({ message: "User already in group" });

    const newUserGroup = await prisma.userGroup.create({
      data: {
        userId: Number(userId),
        groupId: Number(groupId),
        groupcourseadd: groupcourseadd || 0,
      },
      include: { user: true, group: true },
    });

    res.status(201).json(newUserGroup);
  } catch (error) {
    console.error("❌ Error adding user:", error);
    res
      .status(500)
      .json({ message: "Error adding user to group", error: error.message });
  }
};

/**
 * ✅ PUT update user in group (e.g., groupcourseadd)
 */
export const updateUserInGroup = async (req, res) => {
  try {
    const { userId, groupId, groupcourseadd } = req.body;
    if (!userId || !groupId) {
      return res
        .status(400)
        .json({ message: "userId and groupId are required" });
    }

    const record = await prisma.userGroup.findFirst({
      where: { userId: Number(userId), groupId: Number(groupId) },
    });

    if (!record) {
      return res.status(404).json({ message: "User not in this group" });
    }

    const updatedRecord = await prisma.userGroup.update({
      where: { id: record.id },
      data: {
        groupcourseadd:
          groupcourseadd !== undefined
            ? Number(groupcourseadd)
            : record.groupcourseadd,
      },
      include: { user: true, group: true },
    });

    res.status(200).json(updatedRecord);
  } catch (error) {
    console.error("❌ Error updating user:", error);
    res
      .status(500)
      .json({ message: "Error updating user in group", error: error.message });
  }
};

/**
 * ✅ GET all users in all groups
 */
export const getAllUsers = async (req, res) => {
  try {
    const userGroups = await prisma.userGroup.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            username: true,
            usertype: true,
            lastLogin: true,
            bio: true,
            email: true,
          },
        },
        group: {
          select: { id: true, name: true },
        },
      },
      orderBy: { userId: "asc" },
    });

    const formatted = userGroups.map((ug) => ({
      id: ug.user?.id || null,
      user: ug.user || null,
      groupId: ug.group?.id || null,
      groupName: ug.group?.name || "",
      isOwner: ug.isOwner || false,
      groupCoursesAdded: ug.groupcourseadd || 0,
    }));


    res.status(200).json(formatted);
   
 {/**    res.status(200).json({
  success: true,
  totalUsers: formatted.length,
  data: formatted,
});
*/}


  } catch (error) {
    console.error("❌ Error fetching all user-groups:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch user-groups", error: error.message });
  }
};

/**
 * ✅ DELETE user from a group
 */
export const removeUserFromGroup = async (req, res) => {
  try {
    const { userId, groupId } = req.body;
    if (!userId || !groupId) {
      return res
        .status(400)
        .json({ message: "userId and groupId are required" });
    }

    const record = await prisma.userGroup.findFirst({
      where: { userId: Number(userId), groupId: Number(groupId) },
    });

    if (!record) {
      return res.status(404).json({ message: "User not in this group" });
    }

    await prisma.userGroup.delete({ where: { id: record.id } });

    res
      .status(200)
      .json({ message: "User removed from group successfully" });
  } catch (error) {
    console.error("❌ Error removing user:", error);
    res
      .status(500)
      .json({ message: "Error removing user from group", error: error.message });
  }
};

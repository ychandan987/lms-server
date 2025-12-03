// Controller/GroupController.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Create a new group
 */
export const createGroup = async (req, res) => {
  try {
    const { name, description, autoenroll, groupkey } = req.body;

    // Validate Boolean fields
    if (typeof groupkey !== 'boolean') {
      return res.status(400).json({ message: 'groupkey must be Boolean' });
    }
    if (typeof autoenroll !== 'boolean') {
      return res.status(400).json({ message: 'autoenroll must be Boolean' });
    }

    // Check for duplicate group name
    const existingGroup = await prisma.group.findFirst({
      where: { name },
    });

    if (existingGroup) {
      return res.status(400).json({
        message: `Group "${name}" already exists`,
      });
    }

    // Create new group
    const newGroup = await prisma.group.create({
      data: {
        name,
        description,
        autoenroll,
        groupkey,
        created_on: new Date(),
      },
    });

    return res.status(201).json(newGroup);
  } catch (error) {
    console.error('Create Group Error:', error);
    return res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
};

/**
 * Get all groups
 */
export const getAllGroups = async (req, res) => {
  try {
    const groups = await prisma.group.findMany({
      orderBy: { id: 'desc' }
    });
    res.json(groups);
  } catch (err) {
    console.error("Error fetching groups:", err);
    res.status(500).json({ message: "Failed to fetch groups" });
  }
};


/**
 * Get a single group by ID
 */
export const getGroupById = async (req, res) => {
  try {
    const { id } = req.params;

    const group = await prisma.group.findUnique({
      where: { id: Number(id) },
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    return res.status(200).json(group);
  } catch (error) {
    console.error('Get Group By ID Error:', error);
    return res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
};

/**
 * Update a group by ID
 */
export const updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, autoenroll, groupkey } = req.body;

    // Validate Boolean fields
    if (typeof groupkey !== 'boolean') {
      return res.status(400).json({ message: 'groupkey must be Boolean' });
    }
    if (typeof autoenroll !== 'boolean') {
      return res.status(400).json({ message: 'autoenroll must be Boolean' });
    }

    // Check if the group exists
    const existingGroup = await prisma.group.findUnique({
      where: { id: Number(id) },
    });

    if (!existingGroup) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Prevent duplicate group name
    const duplicateGroup = await prisma.group.findFirst({
      where: {
        name,
        NOT: { id: Number(id) },
      },
    });

    if (duplicateGroup) {
      return res.status(400).json({
        message: `Another group with name "${name}" already exists`,
      });
    }

    // Update the group
    const updatedGroup = await prisma.group.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        autoenroll,
        groupkey,
      },
    });

    return res.status(200).json(updatedGroup);
  } catch (error) {
    console.error('Update Group Error:', error);
    return res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
};

/**
 * Delete a group by ID
 */
export const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;

    const existingGroup = await prisma.group.findUnique({
      where: { id: Number(id) },
    });

    if (!existingGroup) {
      return res.status(404).json({ message: 'Group not found' });
    }

    await prisma.group.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Delete Group Error:', error);
    return res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
};

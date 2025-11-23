// routes/groupRoutes.js
import express from 'express';
import {
  createGroup,
  getAllGroups,
  getGroupById,
  updateGroup,
  deleteGroup
} from '../Controller/GroupController.js';

const router = express.Router();

// Create a new group
router.post('/', createGroup);

// Get all groups
router.get('/', getAllGroups);

// Get a single group by ID
router.get('/:id', getGroupById);

// Update a group by ID
router.put('/:id', updateGroup);

// Delete a group by ID
router.delete('/:id', deleteGroup);

export default router;

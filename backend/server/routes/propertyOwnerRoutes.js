import express from 'express';
import { getAllOwners, createOwner, updateOwner, deleteOwner } from '../controller/propertyOwnerController.js';

const router = express.Router();

// Route for fetching all owners
router.get('/', getAllOwners);

// Route for creating a new owner
router.post('/', createOwner);

// Route for updating an existing owner
router.put('/:id', updateOwner);

// Route for deleting an owner
router.delete('/:id', deleteOwner);

export default router;

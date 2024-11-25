import express from 'express';
import { getAllProperties, createProperty, updateProperty, deleteProperty } from '../controller/propertyController.js';

const router = express.Router();

// Property routes
router.get("/", getAllProperties);
router.post("/", createProperty);
router.put("/:id", updateProperty);
router.delete("/:id", deleteProperty);

export default router;

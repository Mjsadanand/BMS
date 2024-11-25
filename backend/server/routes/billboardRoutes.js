import express from 'express';
import { createBillboard, getBillboardWithProperty, getBillboardsByProperty } from '../controller/billboardController.js'; // Update path as needed

const router = express.Router();

// Define the routes
router.post('/billboards', createBillboard);
router.get('/billboards/:id', getBillboardWithProperty);
router.get('/properties/:propertyId/billboards', getBillboardsByProperty);

// Export the router
export { router };  // Ensure named export

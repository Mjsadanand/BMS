import express from 'express';
import {
  createAd,
  getAllAds,
  getAdById,
  updateAd,
  deleteAd
} from '../controller/adController.js';
import { checkObjectId } from '../middleWare/validation.js'; // Middleware for ID validation (optional)

const router = express.Router();

// Route to create an ad
router.post('/', createAd);

// Route to get all ads
router.get('/', getAllAds);

// Route to get an ad by ID with ID validation middleware
router.get('/:id', checkObjectId, getAdById);

// Route to update an ad by ID with ID validation middleware
router.put('/:id', checkObjectId, updateAd);

// Route to delete an ad by ID with ID validation middleware
router.delete('/:id', checkObjectId, deleteAd);

export default router;

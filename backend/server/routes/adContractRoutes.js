import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  createAdContract,
  getAllContracts,
  getSingleContract,
  updateContract,
  deleteContract
} from '../controller/adContractController.js';

const router = express.Router();

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/contracts/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Routes
router.post('/', upload.single('document_file'), createAdContract);
router.get('/', getAllContracts);
router.get('/:id', getSingleContract);
router.put('/:id', upload.single('document_file'), updateContract);
router.delete('/:id', deleteContract);

export default router;
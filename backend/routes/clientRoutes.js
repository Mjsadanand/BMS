import express from "express"; // Use ES6 import syntax
import multer from "multer"; // Import multer for handling file uploads
import path from "path"; // To handle file paths
import { getAllClients, addClient, updateClient, deleteClient } from "../controller/clientController.js"; // Import controller functions

const router = express.Router();

// Set up multer storage engine for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the destination folder for image uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Generate a unique file name
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Use original extension
  }
});

// File filter to allow only image files (optional)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Please upload an image file."), false);
  }
};

// Initialize multer with storage settings and file filter
const upload = multer({ storage: storage, fileFilter: fileFilter });

// Define routes with multer handling image uploads
router.get("/", getAllClients); // Fetch all clients

// Handle adding a new client with image upload
router.post("/", upload.single('image'), addClient); // 'image' is the name of the file input in your form

// Handle updating an existing client with optional image upload
router.put("/:id", upload.single('image'), updateClient); // 'image' is the name of the file input in your form

// Delete a client
router.delete("/:id", deleteClient); // Delete a client

export default router; // Export the router using ES6 export

import express from 'express';
import { register, authenticateUser,getAccountProfile } from '../controller/accountController.js';  // Import authenticateUser instead of login
import { EventEmitter } from 'events';

// Increase the default max listener limit to prevent memory leak warnings.
EventEmitter.defaultMaxListeners = 20;

const router = express.Router();

// Routes
router.post('/register', register);  // Registration route
router.post('/authenticate', authenticateUser);  
router.get('/profile', getAccountProfile);// Login route using authenticateUser

export default router;

import { Router } from 'express';
import { login } from '../controller/authController.js'; // Correctly import the login function

const router = Router();

router.post('/login', login); // Use the login function

export default router;

import { Router } from 'express';
import { body } from 'express-validator';
import { login } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.post('/login', [body('email').isEmail(), body('password').isLength({ min: 6 }), validate], asyncHandler(login));

export default router;

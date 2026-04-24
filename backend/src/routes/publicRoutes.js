import { Router } from 'express';
import { body } from 'express-validator';
import { createInquiry } from '../controllers/inquiryController.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.post('/inquiries', [body('name').notEmpty(), body('email').isEmail(), body('message').isLength({ min: 5 }), validate], asyncHandler(createInquiry));

export default router;

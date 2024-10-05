import { Router } from 'express';
import {
  adminLogin,
  createAdmin,
  forgotPassword,
  login,
  resetPassword,
  signup,
} from '../controllers/authController.js';

const router = Router();

router.post('/create-admin', createAdmin);
router.post('/admin-login', adminLogin);
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;

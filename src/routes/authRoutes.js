import { Router } from 'express';
import {
  adminLogin,
  createAdmin,
  login,
  signup,
} from '../controllers/authController.js';

const router = Router();

router.post('/create-admin', createAdmin);
router.post('/admin-login', adminLogin);
router.post('/signup', signup);
router.post('/login', login);

export default router;

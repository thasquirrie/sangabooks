import { Router } from 'express';
import {
  createRole,
  createRoles,
  findRole,
  getAllRoles,
} from '../controllers/roleController.js';
import { protect } from '../controllers/authController.js';

const router = Router();

router.use(protect);

router.route('/').get(getAllRoles).post(createRole);
router.route('/:id').get(findRole);
router.route('/roles').post(createRoles);

export default router;

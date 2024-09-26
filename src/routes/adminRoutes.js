import { Router } from 'express';
import {
  createMember,
  deleteMember,
  getAllMembers,
  statusCount,
  updateMemberRole,
  updateMemberStatus,
  updatePermissions,
} from '../controllers/adminController.js';
import { protect } from '../controllers/authController.js';

const router = Router();

router.use(protect);

router.get('/members', getAllMembers);
router.post('/members/create', createMember);
router.get('/status-count', statusCount);
router.patch('/:memberId/role', updateMemberRole);
router.patch('/:memberId/status', updateMemberStatus);
router.patch('/:memberId/permissions', updatePermissions);
router.delete('/members/:memberId', deleteMember);

export default router;

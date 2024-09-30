import { Router } from 'express';
import {
  createMember,
  deleteMember,
  getAllMembers,
  getMember,
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
router.get('/members/status-count', statusCount);
router.get('/members/:memberId', getMember);
router.patch('/members/:memberId/role', updateMemberRole);
router.patch('/members/:memberId/status', updateMemberStatus);
router.patch('/members/:memberId/permissions', updatePermissions);
router.delete('/members/:memberId', deleteMember);

export default router;

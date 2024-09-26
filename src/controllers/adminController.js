import {
  createMemberService,
  deleteMemberService,
  getAllMembersService,
  statusCountSevice,
  updateMemberRoleService,
  updateMemberStatusService,
  updatePermissionsService,
} from '../services/adminServices.js';
import catchAsync from '../utils/catchAsync.js';

export const createMember = catchAsync(async (req, res, next) => {
  createMemberService(req, res, next);
});

export const getAllMembers = catchAsync(async (req, res, next) => {
  getAllMembersService(req, res, next);
});

export const updatePermissions = catchAsync(async (req, res, next) => {
  updatePermissionsService(req, res, next);
});

export const updateMemberRole = catchAsync(async (req, res, next) => {
  updateMemberRoleService(req, res, next);
});

export const updateMemberStatus = catchAsync(async (req, res, next) => {
  updateMemberStatusService(req, res, next);
});

export const deleteMember = catchAsync(async (req, res, next) => {
  deleteMemberService(req, res, next);
});

export const statusCount = catchAsync(async (req, res, next) => {
  statusCountSevice(req, res, next);
});

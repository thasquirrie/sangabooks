import {
  createRoleService,
  createRolesService,
  findRoleByIdService,
  getAllRolesService,
} from '../services/roleService.js';
import catchAsync from '../utils/catchAsync.js';

export const createRole = catchAsync(async (req, res, next) => {
  createRoleService(req, res, next);
});

export const getAllRoles = catchAsync(async (req, res, next) => {
  getAllRolesService(req, res, next);
});

export const findRole = catchAsync(async (req, res, next) => {
  findRoleByIdService(req, res, next);
});

export const createRoles = catchAsync(async (req, res, next) => {
  createRolesService(req, res, next);
});

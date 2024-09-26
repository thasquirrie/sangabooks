import {
  createManyRoles,
  createRole,
  findRoleById,
  getAllRoles,
} from '../factory/roleRepo.js';
import catchAsync from '../utils/catchAsync.js';

export const createRoleService = catchAsync(async (req, res, next) => {
  const role = await createRole(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      role,
    },
  });
});

export const getAllRolesService = catchAsync(async (req, res, next) => {
  const roles = await getAllRoles();
  res.status(200).json({
    status: 'success',
    length: roles.length,
    data: {
      roles,
    },
  });
});

export const findRoleByIdService = catchAsync(async (req, res, next) => {
  const role = await findRoleById(req.params.id);

  if (!role) {
    return next(new AppError('Role not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      role,
    },
  });
});

export const createRolesService = catchAsync(async (req, res, next) => {
  const roles = await createManyRoles(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      roles,
    },
  });
});

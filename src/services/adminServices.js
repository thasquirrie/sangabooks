import {
  createUser,
  deleteUser,
  findUserByIdAndUpdate,
  getAllUsers,
} from '../factory/userRepo.js';
import TeamMember from '../models/TeamMember.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { generateTeamId } from '../utils/generateID.js';

export const createMemberService = catchAsync(async (req, res, next) => {
  const required = ['fullName', 'email', 'phone', 'role', 'password'];

  for (const params of required) {
    if (!req.body[params]) {
      return next(new AppError(`Please provide ${params} to continue`, 400));
    }
  }

  req.body.teamId = generateTeamId();

  const member = await createUser(TeamMember, req.body);

  res.status(201).json({
    status: 'success',
    message: 'Team member created successfully',
    data: {
      member,
    },
  });
});

export const getAllMembersService = catchAsync(async (req, res, next) => {
  const { status } = req.query;
  const filter = status && { status };
  const members = await getAllUsers(TeamMember, filter);

  res.status(200).json({
    status: 'success',
    message: 'All team members retrieved successfully',
    length: members.length,
    data: {
      members,
    },
  });
});

export const statusCountSevice = catchAsync(async (req, res, next) => {
  const statusCount = await TeamMember.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        status: '$_id',
        count: 1,
        _id: 0,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      statusCount,
    },
  });
});

export const updatePermissionsService = catchAsync(async (req, res, next) => {
  const { memberId } = req.params;

  const member = await findUserByIdAndUpdate(TeamMember, memberId, req.body);

  if (!member) return next(new AppError('User not found', 404));

  res.status(200).json({
    status: 'success',
    messages: 'Permissions updated successfully',
    data: {
      member,
    },
  });
});

export const updateMemberRoleService = catchAsync(async (req, res, next) => {
  const { memberId } = req.params;
  const { role } = req.body;

  const member = await findUserByIdAndUpdate(TeamMember, memberId, { role });

  if (!member) return next(new AppError('User not found', 404));

  res.status(200).json({
    status: 'success',
    message: 'Team member role updated successfully',
    data: {
      member,
    },
  });
});

export const updateMemberStatusService = catchAsync(async (req, res, next) => {
  const { memberId } = req.params;
  const { status } = req.body;

  const member = await findUserByIdAndUpdate(TeamMember, memberId, { status });

  if (!member) return next(new AppError('User not found', 404));

  res.status(200).json({
    status: 'success',
    message: 'Team member updated successfully',
    data: {
      member,
    },
  });
});

export const deleteMemberService = catchAsync(async (req, res, next) => {
  const { memberId } = req.params;
  const member = await deleteUser(TeamMember, memberId);

  if (!member) return next(new AppError('User not found', 404));

  res.status(204).json({});
});

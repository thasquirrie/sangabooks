import { findUserById } from '../factory/userRepo.js';
import Admin from '../models/Admin.js';
import {
  adminLoginService,
  createAdminService,
  loginService,
  signupService,
} from '../services/authServices.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { promisify } from 'util';

export const createAdmin = catchAsync(async (req, res, next) => {
  createAdminService(req, res, next);
});

export const adminLogin = catchAsync(async (req, res, next) => {
  adminLoginService(req, res, next);
});

export const signup = catchAsync(async (req, res, next) => {
  signupService(req, res, next);
});

export const login = catchAsync(async (req, res, next) => {
  loginService(req, res, next);
});

export const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await findUserById(Admin, decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

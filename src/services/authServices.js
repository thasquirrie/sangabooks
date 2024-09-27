import JWT from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../factory/userRepo.js';
import Admin from '../models/Admin.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

console.log('Secret:', process.env.JWT_SECRET);

/**
 * Generates a JSON Web Token (JWT) for a given user ID.
 * @param {string} id - The user ID to generate the JWT for.
 * @returns {string} The generated JWT.
 */
const signToken = (id) => {
  return JWT.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSignedToken = (user, res, statusCode, message) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: 'success',
    token,
    message,
    data: {
      user,
    },
  });
};

export const createAdminService = catchAsync(async (req, res, next) => {
  const required = [
    'email',
    'password',
    'firstName',
    'lastName',
    'confirmPassword',
  ];

  for (const param of required) {
    if (!req.body[param])
      return next(new AppError(`Please provide ${param} to continue`, 400));
  }
  const admin = await createUser(Admin, req.body);

  createSignedToken(admin, res, 201, 'Admin created successfully');
});

export const adminLoginService = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const admin = await findUserByEmail(Admin, email, '+password');

  if (!admin || !(await admin.comparePasswords(password, admin.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  admin.password = undefined;

  createSignedToken(admin, res, 200, 'Admin logged in successfully');
});

export const signupService = catchAsync(async (req, res, next) => {
  const required = [
    'fullName',
    'email',
    'password',
    'confirmPassword',
    'phone',
    'companyName',
    'companySize',
    'income',
    'role',
    'lastTaxReturn',
    'type',
  ];

  for (const param of required) {
    if (!req.body[param])
      return next(new AppError(`Please provide ${param} to continue`, 400));
  }

  const user = await createUser(User, req.body);

  res.status(201).json({
    status: 'success',
    message: 'User created successfully',
    data: {
      user,
    },
  });
});

export const loginService = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(User, email, '+password');

  if (!user || !(await user.comparePasswords(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSignedToken(user, res, 200, 'User logged in successfully');
});

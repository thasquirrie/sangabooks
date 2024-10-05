import JWT from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../factory/userRepo.js';
import Admin from '../models/Admin.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import User from '../models/User.js';
import nodeMailer from '../config/nodemailer.js';
import randomNumber from 'random-number';
import {
  createToken,
  deleteToken,
  findTokenByEmail,
  findTokenByPin,
  updateToken,
} from '../factory/tokenRepo.js';

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

/**
 * Creates a signed JSON Web Token (JWT) for a given user and returns it in the response.
 * @param {Object} user - The user document to generate the JWT for.
 * @param {Response} res - The response object to send the response to.
 * @param {number} statusCode - The HTTP status code to send in the response.
 * @param {string} message - The message to include in the response.
 */
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

const options = {
  min: 100000,
  max: 999999,
  integer: true,
};

const createRandomNumber = () => {
  return randomNumber(options);
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
    'lastTaxReturn',
    'type',
  ];

  for (const param of required) {
    if (!req.body[param])
      return next(new AppError(`Please provide ${param} to continue`, 400));
  }

  req.body.role = req.body.type;

  const user = await createUser(User, req.body);

  user.password = undefined;
  user.confirmPassword = undefined;

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

export const forgotPasswordService = catchAsync(async (req, res, next) => {
  const user = await findUserByEmail(User, req.body.email);

  if (!user) {
    return next(new AppError('No user found with that email', 404));
  }

  const pin = createRandomNumber();

  let token = await findTokenByEmail(req.body.email);

  if (!token) {
    token = await createToken(pin, req.body.email);
  } else {
    token.pin = pin;

    await token.save();
  }

  const subject = 'Forgot Password';
  const message = `Aww! You forgot your password, no qualms it happens to the best of us and we got you on this. Your reset pin is ${pin}.`;

  await nodeMailer(req.body.email, subject, message);

  res.status(200).json({
    status: 'success',
    message: 'Reset pin sent successfully',
    data: {},
  });
});

export const resetPasswordService = catchAsync(async (req, res, next) => {
  const { pin, password, confirmPassword } = req.body;

  if (password !== confirmPassword)
    return next(new AppError('Passwords does not match', 400));

  const token = await findTokenByPin(pin);

  if (!token || token.pin !== pin)
    return next(new AppError('Invalid token', 400));

  console.log(token.createdAt + 5 * 60 * 1000 < Date.now());

  if (token.createdAt + 5 * 60 * 1000 < Date.now()) {
    return next(new AppError('Token expired', 400));
  }

  const user = await findUserByEmail(User, token.email, '+password');
  user.password = password;
  user.confirmPassword = confirmPassword;
  await user.save();

  await deleteToken(pin);

  res.status(200).json({
    status: 'success',
    message: 'Password changed successfully',
    data: {},
  });
});

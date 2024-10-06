import { Schema, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      minlength: [3, 'Full name must be at least 3 characters'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    confirmPassword: {
      type: String,
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: 'Passwords do not match',
      },
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: ['client', 'bookkeeper', 'owner', 'accountant'],
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    companySize: {
      type: String,
      required: [true, 'Company size is required'],
      default: '1',
    },
    income: {
      type: String,
      required: [true, 'Income is required'],
      default: '0',
    },
    lastTaxReturn: String,
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isNew) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = await bcrypt.hash(this.confirmPassword, 10);

  next();
});

userSchema.pre('save', async function (next) {
  if (this.isNew) return next();

  this.passwordChangedAt = Date - 2000;
  next();
});

userSchema.methods.comparePasswords = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = model('User', userSchema);

export default User;

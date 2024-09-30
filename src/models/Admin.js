import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const adminSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    confirmPassword: {
      type: String,
      required: [true, 'Confirm password is required'],
    },
    // role: {
    //   type: String,
    //   required: true,
    // },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

adminSchema.pre('save', async function (next) {
  if (!this.isNew) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;

  next();
});

adminSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 2000;
  next();
});

/**
 * Compare a given password with a user's hashed password
 * @param {string} candidatePassword - The password to compare
 * @param {string} userPassword - The user's hashed password
 * @returns {Promise<boolean>} True if the passwords match, false otherwise
 */
adminSchema.methods.comparePasswords = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

/**
 * Check if the password was changed after the token was issued.
 * @param {number} JWTTimestamp - The timestamp of the JWT token
 * @returns {boolean} True if the password was changed, false otherwise
 */
adminSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const Admin = model('Admin', adminSchema);

export default Admin;

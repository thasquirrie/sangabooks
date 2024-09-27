import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const teamMemberSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      minlength: [3, 'Full name must be at least 3 characters'],
      trim: true,
    },
    teamId: {
      type: String,
      required: [true, 'Team ID is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
    },
    role: {
      type: Schema.ObjectId,
      ref: 'Role',
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'invited'],
      default: 'invited',
    },
    invitedDate: {
      type: Date,
      default: Date.now,
    },
    passwordChangedAt: Date,
    permissions: {
      accessFinancialData: { type: Boolean, default: false },
      prepareFileReturns: { type: Boolean, default: false },
      accessTaxReports: { type: Boolean, default: false },
      provideTaxAdvice: { type: Boolean, default: false },
      accessToGeneralBookkeeping: { type: Boolean, default: false },
      accessLimitedClients: { type: Boolean, default: false },
      limitedEditAccess: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

teamMemberSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

teamMemberSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

teamMemberSchema.pre(/^find/, async function (next) {
  this.populate({
    path: 'role',
    select: 'title',
  });
  next();
});

teamMemberSchema.methods.comparePasswords = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const TeamMember = model('TeamMember', teamMemberSchema);

export default TeamMember;

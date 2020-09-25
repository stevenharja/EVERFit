const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address.'],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'trainer', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  subscribed: {
    type: Boolean,
    default: false,
  },
  subscriptionExpiry: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

//Middleware for encryption
userSchema.pre('save', async function (next) {
  // Only run if password was modified
  if (!this.isModified('password')) return next();

  // Hash the password
  this.password = await bcrypt.hash(this.password, 12);

  // Delete password confirm field as the password is succesfully hashed.
  this.passwordConfirm = undefined;
  next();
});

//Middleware to save last password changed date.
userSchema.pre('save', function (next) {
  //If it is not modified or if the user is new then do not modify passwordChangedAt
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now();
  next();
});

//Middleware to prevent inactive users from being retrieved in API calls
userSchema.pre(/^find/, function (next) {
  // Returns the list for query without the active user.
  this.find({ active: { $ne: false } });
  next();
});

//Method used to check whether the candidate password and the current password matches.
//Note that the password is never revealed at any point.
// Confirms the current password (JWT encrypted) with the current encrypted password.
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//Create new password reset token for /forgotPassword authController
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  // Expires in 10 minutes.
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

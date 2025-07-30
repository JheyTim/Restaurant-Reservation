const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { baseOptions } = require('./_baseOption');

/**
 * A restaurant customer or staff member.
 * The password is hashed in a pre‑save hook.
 */
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /.+@.+\..+/, // rudimentary e‑mail regex
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, // omit by default on queries
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
  },
  baseOptions
);

// 🔒 Hash only when the pw changed (on create or update)
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// ✅ Instance helper for passport‑style checks
UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);

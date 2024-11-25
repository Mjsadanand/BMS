import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Account Schema definition
const accountSchema = new mongoose.Schema({
  username: { type: String, required: true },  // Make username required
  email: { type: String, required: true, unique: true, match: [/.+@.+\..+/, 'Please enter a valid email address'] }, // Email format validation
  password: { type: String, required: true },  // Make password required
  googleId: { type: String },
});

// Hash the password before saving
accountSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();  // Only hash password if it's modified
  try {
    const salt = await bcrypt.genSalt(10);  // Generate salt
    this.password = await bcrypt.hash(this.password, salt);  // Hash the password
    next();  // Proceed to save the user
  } catch (error) {
    next(error);  // Pass error to the next middleware if hashing fails
  }
});

// Compare input password with hashed password
accountSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Model creation
const Account = mongoose.model('Account', accountSchema);

export default Account;

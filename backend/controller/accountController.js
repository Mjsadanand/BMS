import Account from '../models/Account.js';
import bcrypt from 'bcryptjs';

// Register new user
export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if email already exists
    const existingAccount = await Account.findOne({ email });
    if (existingAccount) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new account and save to database
    const newAccount = new Account({ username, email, password: hashedPassword });
    await newAccount.save();

    // Send success response
    res.status(201).json({ success: true, message: 'Account created successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Authenticate user (login) without generating JWT token
export const authenticateUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Received email:', email);  // Log received email

    // Find account by email (case-insensitive match)
    const account = await Account.findOne({ email: { $regex: new RegExp('^' + email + '$', 'i') } });
    if (!account) {
      console.log('Account not found for email:', email);
      return res.status(400).json({ success: false, message: 'Invalid credentials', error: "User not found" });
    }

    console.log('Account found:', account);  // Log the account object

    // Use comparePassword method defined in schema
    const isMatch = await account.comparePassword(password.trim());
    console.log('Password match:', isMatch);  // Log password match result

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials', error: "Wrong password" });
    }

    // Return success response without token
    res.status(200).json({ success: true, message: 'Login successful' });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Google OAuth callback for user login/registration
export const googleOAuthCallback = async (profile, done) => {
  try {
    // Check if account exists with Google ID
    let account = await Account.findOne({ googleId: profile.id });
    if (!account) {
      // Create new account if it doesn't exist
      account = new Account({
        googleId: profile.id,
        email: profile.emails[0].value,
        username: profile.displayName,
      });
      await account.save();
    }
    done(null, account);  // Return the account
  } catch (error) {
    console.error('Google OAuth error:', error);  // Log the error
    done(error, null);  // Return the error if any
  }
};

// Get account profile (protected route)
export const getAccountProfile = async (req, res) => {
  try {
    // Get the accountId from the JWT token stored in the request
    const token = req.headers['authorization']?.split(' ')[1];  // Extract token from the Authorization header
    if (!token) return res.status(403).json({ message: 'Authorization token is required' });

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const accountId = decoded.id;  // Get account ID from the decoded token

    // Find the account profile based on the accountId
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Return the account details (username, email, role)
    res.json({
      username: account.username,
      email: account.email,
      role: account.role,  // Return role (default is 'User' if not set)
    });
  } catch (error) {
    console.error('Error fetching account profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

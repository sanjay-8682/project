import jwt from 'jsonwebtoken'
import User from '../Models/userSchema.js'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()



export const registerUser = async (req, res) => {
  try {
    const { username, password, email, profilePicture } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashPassword, profilePicture });
    await newUser.save();

    res.status(200).json({ message: "User registered successfully", data: newUser });

  } catch (error) {
    console.error("Registration error:", error.message); // ✅ improved
    res.status(500).json({ message: "Registration failed: " + error.message });
  }
};



export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'User not found' });

    // 🔒 Validate password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ message: 'Invalid user password' });

    // 🔐 Create JWT with 1-hour expiry
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h', // ⏰ token expires in 1 hour
    });

    // 🍪 Send token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,          // ✅ Cookie only over HTTPS (Netlify + Render)
      sameSite: 'None',      // ✅ Allow cross-site cookies (Netlify → Render)
      maxAge: 60 * 60 * 1000 // 1 hour
    })
      .status(200)
      .json({
        message: 'Login Successfully',
        token,
        user: {
          _id: user._id,
          email: user.email,
          username: user.username,
          profilePicture: user.profilePicture,
        },
      });

  } catch (error) {
    console.error('🔥 Login error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};




// controllers/userController.js

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email, password, ...rest } = req.body;

    // Check for duplicate username (excluding self)
    const existingUsername = await User.findOne({ username, _id: { $ne: userId } });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Check for duplicate email (excluding self)
    const existingEmail = await User.findOne({ email, _id: { $ne: userId } });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Prepare update data
    const updateData = {
      ...rest,
      username,
      email
    };

    // If password is updated, hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ message: 'User not found or update failed' });
    }

    return res.status(200).json({
      message: 'User updated successfully',
      data: updatedUser,
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



// backend/controller
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password'); // remove password
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(400).json({ message: 'User not found or delete failed' });
    }

    return res.status(200).json({
      message: 'User deleted successfully',
      data: deletedUser,
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'None',
    secure: true, // use `false` for local testing over HTTP
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // hide password field
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};


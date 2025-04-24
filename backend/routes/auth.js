const express = require('express');
const User = require('../models/User'); // Import User model

const router = express.Router();

// POST route for user registration
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create new user (no hashing of password)
  const newUser = new User({
    name,
    email,
    password,  // Store password as plain text (not hashed)
  });

  try {
    // Save the user to the database
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

module.exports = router;

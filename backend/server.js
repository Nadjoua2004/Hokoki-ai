const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const User = require('./models/User');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mydb')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Registration endpoint (with password hashing)
app.post('/api/register', async (req, res) => {
  try {
    const { name, surname, phonenumb, email, password, agree } = req.body;

    // Validation
    if (!name || !surname || !phonenumb || !email || !password || !agree) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      surname,
      phonenumb,
      email,
      password: hashedPassword, // Store hashed password
      agreeToTerms: agree
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });

  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email already exists!' });
    } else {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error during registration' });
    }
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password!" });
    }

    // 3. Successful login
    res.json({ 
      message: "Login successful!", 
      user: {
        id: user._id,
        name: user.name,
        email: user.email
        // Never expose password!
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Lawyer = require('./models/Lawyer');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:19006', 'http://192.168.43.76:19006'] // Add your IPs here
}));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mydb')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// ========================
// USER ENDPOINTS
// ========================

// User registration
app.post('/api/register', async (req, res) => {
  try {
    const { name, surname, phonenumb, email, password, agree } = req.body;

    if (!name || !surname || !phonenumb || !email || !password || !agree) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      surname,
      phonenumb,
      email,
      password: hashedPassword,
      agreeToTerms: agree
    });

    await user.save();
    res.status(201).json({ 
      message: 'User registered successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email already exists!' });
    } else {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error during registration' });
    }
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    res.json({ 
      message: "Login successful!", 
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// ========================
// LAWYER ENDPOINTS
// ========================

// Lawyer registration
app.post('/api/lawyer/register', async (req, res) => {
  try {
    const { name, surname, phonenumb, Id, email, password, specialization, agree } = req.body;

    if (!name || !surname || !phonenumb || !Id || !email || !password || !specialization || !agree) {
      return res.status(400).json({ message: 'All fields including bar ID and specialization are required!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const lawyer = new Lawyer({
      name,
      surname,
      phonenumb,
      Id,
      email,
      specialization,
      password: hashedPassword,
      agreeToTerms: agree
    });

    await lawyer.save();
    res.status(201).json({ 
      message: 'Lawyer registered successfully!',
      lawyer: {
        id: lawyer._id,
        name: lawyer.name,
        email: lawyer.email,
        specialization: lawyer.specialization
      }
    });

  } catch (error) {
    if (error.code === 11000) {
      const field = error.keyValue.email ? 'Email' : 'Bar ID';
      res.status(400).json({ message: `${field} already exists!` });
    } else {
      console.error('Lawyer registration error:', error);
      res.status(500).json({ message: 'Server error during lawyer registration' });
    }
  }
});

// Lawyer login
app.post('/api/lawyer/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const lawyer = await Lawyer.findOne({ email });
    if (!lawyer) {
      return res.status(404).json({ message: "Lawyer not found!" });
    }

    const isMatch = await bcrypt.compare(password, lawyer.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    res.json({ 
      message: "Lawyer login successful!",
      lawyer: {
        id: lawyer._id,
        name: lawyer.name,
        email: lawyer.email,
        specialization: lawyer.specialization,
        barId: lawyer.barId
      }
    });

  } catch (error) {
    console.error("Lawyer login error:", error);
    res.status(500).json({ message: "Server error during lawyer login" });
  }
});

// ========================
// START SERVER
// ========================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
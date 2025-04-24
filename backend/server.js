SERVER 
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./models/User');
const Lawyer = require('./models/Lawyer');
import { ALLOWED_ORIGINS as allowedOrigins } from '../config';
// Initialize Express app
const app = express();

// Middleware

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add all needed methods
  // credentials: true // Only enable if using cookies/auth
}));
app.use(bodyParser.json());

// Connect to MongoDB with enhanced options
mongoose.connect('mongodb://mongo:27017/mydb', {

  useNewUrlParser: true,
  useUnifiedTopology: true,
  
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// MongoDB connection events
mongoose.connection.on('connected', () => console.log('Mongoose connected to DB'));
mongoose.connection.on('error', (err) => console.error('Mongoose connection error:', err));

// Test route
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'running',
    services: {
      users: '/api/users',
      lawyers: '/api/lawyers'
    }
  });
});

// ========================
// USER ENDPOINTS (GET)
// ========================

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.status(200).json(users); // Send the users as a response
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users',
      error: error.message
    });
  }
});

// ========================
// LAWYER ENDPOINTS (GET)
// ========================

// Get all lawyers
app.get('/api/lawyers', async (req, res) => {
  try {
    const lawyers = await Lawyer.find(); // Fetch all lawyers from the database
    res.status(200).json(lawyers); // Send the lawyers as a response
  } catch (error) {
    console.error('Error fetching lawyers:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching lawyers',
      error: error.message
    });
  }
});


// ========================
// USER ENDPOINTS
// ========================

// User registration
app.post('/api/register', async (req, res) => {
  try {
    const { name, surname, phonenumb, email, password, agree } = req.body;

    // Validation
    if (!name || !surname || !phonenumb || !email || !password || !agree) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required!' 
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists!'
      });
    }

    // Create new user (store password in plain text)
    const user = new User({
      name,
      surname,
      phonenumb,
      email,
      password, // Store the password directly (not hashed)
      agreeToTerms: agree
    });

    await user.save();
    
    res.status(201).json({ 
      success: true,
      message: 'User registered successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!" 
      });
    }

    // Verify password (no hashing, just plain text comparison)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials!" 
      });
    }

    res.json({ 
      success: true,
      message: "Login successful!", 
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("User login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message
    });
  }
});

// ========================
// LAWYER ENDPOINTS
// ========================

// Lawyer registration
app.post('/api/lawyer/register', async (req, res) => {
  try {
    const { name, surname, phonenumb, idcapa, email, password, agreeToTerms } = req.body;

    // Validation
    if (!name || !surname || !phonenumb || !idcapa || !email || !password || !agreeToTerms) {
      return res.status(400).json({
        success: false,
        message: 'All fields including CAPA ID are required!'
      });
    }

    // Check existing lawyer
    const existingByEmail = await Lawyer.findOne({ email });
    const existingById = await Lawyer.findOne({ idcapa });
    
    if (existingByEmail || existingById) {
      return res.status(409).json({
        success: false,
        message: existingByEmail ? 'Email already exists!' : 'CAPA ID already registered!'
      });
    }

    // Create new lawyer (store password in plain text)
    const lawyer = new Lawyer({
      name,
      surname,
      phonenumb,
      idcapa,
      email,
      password, // Store the password directly (not hashed)
      agreeToTerms
    });

    await lawyer.save();
    
    res.status(201).json({
      success: true,
      message: 'Lawyer registered successfully!',
      lawyer: {
        id: lawyer._id,
        name: lawyer.name,
        email: lawyer.email,
        idcapa: lawyer.idcapa
      }
    });

  } catch (error) {
    console.error('Lawyer registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
});

// Lawyer login
app.post('/api/lawyer/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const lawyer = await Lawyer.findOne({ email });
    if (!lawyer) {
      return res.status(404).json({
        success: false,
        message: "Lawyer not found!" 
      });
    }

    // Verify password (no hashing, just plain text comparison)
    if (lawyer.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials!" 
      });
    }

    res.json({
      success: true,
      message: "Lawyer login successful!",
      lawyer: {
        id: lawyer._id,
        name: lawyer.name,
        email: lawyer.email,
        idcapa: lawyer.idcapa
      }
    });

  } catch (error) {
    console.error("Lawyer login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message
    });
  }
});

// ========================
// START SERVER
// ========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});








const express = require('express');
const Lawyer = require('../models/Lawyer');
const router = express.Router();

// POST route for lawyer registration
router.post('/register', async (req, res) => {
  const { name, surname, phonenumb, idcapa, email, password, agreeToTerms } = req.body;

  try {
    // Check if lawyer exists
    const existingLawyer = await Lawyer.findOne({ email });
    if (existingLawyer) {
      return res.status(400).json({ message: 'Lawyer already exists' });
    }

    // Create new lawyer without hashing the password
    const newLawyer = new Lawyer({
      name,
      surname,
      phonenumb,
      idcapa,
      email,
      password,  // Store password as plain text (not hashed)
      agreeToTerms
    });

    await newLawyer.save();
    res.status(201).json({ 
      message: 'Lawyer registered successfully',
      lawyer: {
        id: newLawyer._id,
        name: newLawyer.name,
        email: newLawyer.email
      }
    });

  } catch (err) {
    console.error('Lawyer registration error:', err);
    res.status(500).json({ 
      message: 'Server error during registration',
      error: err.message 
    });
  }
});

module.exports = router;

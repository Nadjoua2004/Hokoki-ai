const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const http = require('http');
const socketIo = require('socket.io');

// Models
const User = require('./models/User');
const Lawyer = require('./models/Lawyer');
const Message = require('./models/Message');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:19006', 'http://192.168.43.76:19006']
}));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mydb')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Create HTTP server & Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*', methods: ['GET','POST'] }
});

// In‑memory map of connected users
// key: socket.id, value: { userId, role }
const activeUsers = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // 1) Capture login with role
  socket.on('login', ({ userId, role }) => {
    activeUsers.set(socket.id, { userId, role });
    console.log(`Socket ${socket.id} logged in as ${role} ${userId}`);
  });

  // 2) Join conversation only if logged in
  socket.on('joinConversation', (conversationId) => {
    const user = activeUsers.get(socket.id);
    if (!user) {
      console.warn(`Socket ${socket.id} tried to join without logging in`);
      return;
    }
    socket.join(conversationId);
    console.log(`${user.role} ${user.userId} joined conversation ${conversationId}`);
  });

  // 3) Handle new messages
  socket.on('sendMessage', async (messageData) => {
    try {
      const newMessage = new Message(messageData);
      await newMessage.save();

      // Broadcast to room
      socket.to(messageData.conversationId).emit('receiveMessage', newMessage);
      socket.emit('receiveMessage', newMessage);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  // 4) Cleanup on disconnect
  socket.on('disconnect', () => {
    activeUsers.delete(socket.id);
    console.log('Client disconnected:', socket.id);
  });
});

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// ========================
// USER ENDPOINTS
// ========================
app.post('/api/register', async (req, res) => {
  try {
    const { name, surname, phonenumb, email, password, agree } = req.body;
    if (!name || !surname || !phonenumb || !email || !password || !agree) {
      return res.status(400).json({ message: 'All fields are required!' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, surname, phonenumb, email, password: hashedPassword, agreeToTerms: agree });
    await user.save();
    res.status(201).json({
      message: 'User registered successfully!',
      user: { id: user._id, name: user.name, email: user.email }
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

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found!" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials!" });
    res.json({
      message: "Login successful!",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password -__v');
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ========================
// LAWYER ENDPOINTS
// ========================
app.post('/api/lawyer/register', async (req, res) => {
  try {
    const { name, surname, phonenumb, idc, email, password, agree } = req.body;
    if (!name || !surname || !phonenumb || !idc || !email || !password || !agree) {
      return res.status(400).json({ message: 'All fields are required!' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const lawyer = new Lawyer({ name, surname, phonenumb, idc, email, password: hashedPassword, agreeToTerms: agree });
    await lawyer.save();
    res.status(201).json({
      message: 'Lawyer registered successfully!',
      lawyer: { id: lawyer._id, name: lawyer.name, email: lawyer.email }
    });
  } catch (error) {
    if (error.code === 11000) {
      const dup = error.message.includes('email') ? 'Email' : 'ID';
      res.status(400).json({ message: `${dup} already registered!` });
    } else {
      console.error('Lawyer registration error:', error);
      res.status(500).json({ message: 'Server error during registration' });
    }
  }
});

app.post('/api/lawyer/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const lawyer = await Lawyer.findOne({ email });
    if (!lawyer) return res.status(404).json({ message: "Lawyer not found!" });
    const isMatch = await bcrypt.compare(password, lawyer.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials!" });
    res.json({
      message: "Lawyer login successful!",
      lawyer: { id: lawyer._id, name: lawyer.name, email: lawyer.email }
    });
  } catch (error) {
    console.error("Lawyer login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// ========================
// CONVERSATION & MESSAGES
// ========================
app.post('/api/conversation', async (req, res) => {
  try {
    const { userId, lawyerId } = req.body;
    const conversationId = new mongoose.Types.ObjectId();
    res.status(201).json({ success: true, conversationId, message: 'Conversation created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating conversation' });
  }
});

app.get('/api/conversation/:conversationId/messages', async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId })
                                  .sort('timestamp')
                                  .populate('sender receiver');
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching messages' });
  }
});

app.get('/api/user/:userId/conversations', async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      { $match: {
          $or: [
            { sender: mongoose.Types.ObjectId(req.params.userId) },
            { receiver: mongoose.Types.ObjectId(req.params.userId) }
          ]
      }},
      { $group: {
          _id: "$conversationId",
          lastMessage: { $last: "$$ROOT" },
          unreadCount: { $sum: { $cond: [{ $eq: ["$read", false] }, 1, 0] } }
      }},
      { $sort: { "lastMessage.timestamp": -1 } }
    ]);
    res.json({ success: true, conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching conversations' });
  }
});

// START SERVER
const PORT = 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log('WebSocket server ready');
});

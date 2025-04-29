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
const Conversation = require('./models/Conversation');
const Request = require('./models/Request');

const app = express();

app.use((req, res, next) => {
  console.log(`[DEBUG] Incoming request: ${req.method} ${req.url}`);
  next();
});

// Middleware
app.use(cors({
  origin: ['http://localhost:19006', 'http://192.168.43.76:19006']
}));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Create HTTP server & Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// In-memory map of connected users
const activeUsers = new Map();

io.on('connection', (socket) => {
  console.log('[DEBUG] New client connected:', socket.id);

  socket.on('login', ({ userId, role }) => {
    activeUsers.set(socket.id, { userId, role });
    console.log(`[DEBUG] Socket ${socket.id} logged in as ${role} ${userId}`);
  });

  socket.on('joinConversation', (conversationId) => {
    const user = activeUsers.get(socket.id);
    if (!user) {
      console.warn(`[WARN] Socket ${socket.id} tried to join without logging in`);
      return;
    }
    socket.join(conversationId);
    console.log(`[DEBUG] ${user.role} ${user.userId} joined conversation ${conversationId}`);
  });

  socket.on('sendMessage', async (messageData) => {
    try {
      console.log('[DEBUG] Received message data:', messageData);
      const newMessage = new Message(messageData);
      await newMessage.save();
      console.log('[DEBUG] Message saved:', newMessage); 
      socket.to(messageData.conversationId).emit('receiveMessage', newMessage);
      socket.emit('receiveMessage', newMessage);
    } catch (error) {
      console.error('[ERROR] Saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    activeUsers.delete(socket.id);
    console.log('[DEBUG] Client disconnected:', socket.id);
  });
});

// Test route
app.get('/', (req, res) => {
  console.log('[DEBUG] Sending response for root endpoint');
  res.send('Backend is running!');
});

// ========================
// USER ENDPOINTS
// ========================
app.post('/api/register', async (req, res) => {
  try {
    const { name, surname, phonenumb, email, password, agree } = req.body;
    console.log('[DEBUG] Registering new user:', { name, surname, phonenumb, email });

    if (!name || !surname || !phonenumb || !email || !password || !agree) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, surname, phonenumb, email, password: hashedPassword, agreeToTerms: agree });
    await user.save();

    console.log('[DEBUG] User registered successfully:', user._id);
    res.status(201).json({
      message: 'User registered successfully!',
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('[ERROR] Registering user:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email already exists!' });
    } else {
      res.status(500).json({ message: 'Server error during registration' });
    }
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('[DEBUG] Logging in user:', email);

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials!" });

    console.log('[DEBUG] User login successful:', user._id);
    res.json({
      message: "Login successful!",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

app.get('/api/user/:id', async (req, res) => {
  try {
    console.log('[DEBUG] Fetching user by ID:', req.params.id);
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('[ERROR] Fetching user by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    console.log('[DEBUG] Fetching all users');
    const users = await User.find({}, '-password -__v');
    res.json({ success: true, users });
  } catch (err) {
    console.error('[ERROR] Fetching users:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ========================
// LAWYER ENDPOINTS
// ========================
app.post('/api/lawyer/register', async (req, res) => {
  try {
    const { name, surname, phonenumb, idc, email, password, agree } = req.body;
    console.log('[DEBUG] Registering new lawyer:', { name, surname, phonenumb, idc, email });

    if (!name || !surname || !phonenumb || !idc || !email || !password || !agree) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const lawyer = new Lawyer({ name, surname, phonenumb, idc, email, password: hashedPassword, agreeToTerms: agree });
    await lawyer.save();

    console.log('[DEBUG] Lawyer registered successfully:', lawyer._id);
    res.status(201).json({
      message: 'Lawyer registered successfully!',
      lawyer: { id: lawyer._id, name: lawyer.name, email: lawyer.email }
    });
  } catch (error) {
    console.error('[ERROR] Registering lawyer:', error);
    if (error.code === 11000) {
      const dup = error.message.includes('email') ? 'Email' : 'ID';
      res.status(400).json({ message: `${dup} already registered!` });
    } else {
      res.status(500).json({ message: 'Server error during registration' });
    }
  }
});

app.post('/api/lawyer/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('[DEBUG] Logging in lawyer:', email);

    const lawyer = await Lawyer.findOne({ email });
    if (!lawyer) return res.status(404).json({ message: "Lawyer not found!" });

    const isMatch = await bcrypt.compare(password, lawyer.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials!" });

    console.log('[DEBUG] Lawyer login successful:', lawyer._id);
    res.json({
      message: "Lawyer login successful!",
      lawyer: { id: lawyer._id, name: lawyer.name, email: lawyer.email }
    });
  } catch (error) {
    console.error("Lawyer login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

app.get('/api/lawyers', async (req, res) => {
  try {
    console.log('[DEBUG] Fetching lawyers from database...');
    const lawyers = await Lawyer.find({}, '-password -__v');
    console.log('[DEBUG] Lawyers fetched:', lawyers.length);

    const processedLawyers = lawyers.map(lawyer => ({
      id: lawyer._id,
      name: lawyer.name,
      email: lawyer.email,
       phonenumb: lawyer.phonenumb,
      surname: lawyer.surname,
      photo: lawyer.photo || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      experienceYears: lawyer.experienceYears || 0,
      wilaya: lawyer.wilaya || 'Not specified',
      rating: lawyer.rating || 0
    }));

    console.log('[DEBUG] Sending response with lawyers data...');
    res.json({
      success: true,
      count: processedLawyers.length,
      lawyers: processedLawyers
    });
  } catch (error) {
    console.error('[ERROR] Fetching lawyers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lawyers'
    });
  }
});
// Lawyer Profile Endpoint
app.get('/api/lawyer/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const lawyer = await Lawyer.findById(req.params.id)
      .select('-password -__v')
      .lean();

    if (!lawyer) {
      return res.status(404).json({ success: false, message: 'Lawyer not found' });
    }

    res.json({
      success: true,
      lawyer: {
        id: lawyer._id,
        name: lawyer.name,
        surname: lawyer.surname,
        email: lawyer.email,
        phonenumb: lawyer.phonenumb,
        idc: lawyer.idc,
        experienceYears: lawyer.experienceYears,
        wilaya: lawyer.wilaya,
        rating: lawyer.rating,
        photo: lawyer.photo,
        createdAt: lawyer.createdAt
      }
    });
  } catch (error) {
    console.error('[ERROR] Fetching lawyer profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lawyer profile',
      error: error.message
    });
  }
});

// ========================
// CONVERSATION & MESSAGES
// ========================
app.post('/api/initiateConversation', async (req, res) => {
  try {
    const { userId, lawyerId } = req.body;
    console.log('[DEBUG] Initiating conversation between:', { userId, lawyerId });

    if (!userId || !lawyerId) {
      return res.status(400).json({ message: 'User ID and Lawyer ID are required!' });
    }

    const conversation = new Conversation({
      participants: [userId, lawyerId]
    });
    await conversation.save();

    console.log('[DEBUG] Conversation initiated successfully:', conversation._id);
    res.status(201).json({
      message: 'Conversation initiated successfully!',
      conversationId: conversation._id
    });
  } catch (error) {
    console.error('[ERROR] Initiating conversation:', error);
    res.status(500).json({ message: 'Server error during conversation initiation' });
  }
});

app.get('/api/conversation/:conversationId/messages', async (req, res) => {
  try {
    console.log('[DEBUG] Fetching messages for conversation:', req.params.conversationId);
    const messages = await Message.find({ conversationId: req.params.conversationId })
                                  .sort('timestamp')
                                  .populate('sender receiver');
    res.json({ success: true, messages });
  } catch (error) {
    console.error('[ERROR] Fetching messages:', error);
    res.status(500).json({ success: false, message: 'Error fetching messages' });
  }
});

app.get('/api/user/:userId/conversations', async (req, res) => {
  try {
    console.log('[DEBUG] Fetching conversations for user:', req.params.userId);
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
    console.error('[ERROR] Fetching conversations:', error);
    res.status(500).json({ success: false, message: 'Error fetching conversations' });
  }
});

// Create a request
app.post('/api/createRequest', async (req, res) => {
  try {
    const { userId, lawyerId } = req.body;
    const request = new Request({ userId, lawyerId });
    await request.save();
    res.status(201).json({ message: 'Request sent successfully!' });
  } catch (error) {
    console.error('[ERROR] Creating request:', error);
    res.status(500).json({ message: 'Failed to send request' });
  }
});

// Fetch requests for a lawyer
app.get('/api/lawyerRequests/:lawyerId', async (req, res) => {
  try {
    console.log('[DEBUG] Fetching requests for lawyer:', req.params.lawyerId);
    const requests = await Request.find({ lawyerId: req.params.lawyerId, status: 'pending' });
    console.log('[DEBUG] Requests fetched:', requests);
    res.json(requests);
  } catch (error) {
    console.error('[ERROR] Fetching requests:', error);
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
});

// Update request status
// app.post('/api/updateRequestStatus', async (req, res) => {
//   try {
//     const { requestId, status } = req.body;
//     const request = await Request.findById(requestId);
//     if (!request) {
//       return res.status(404).json({ message: 'Request not found' });
//     }
//     request.status = status;
//     await request.save();

//     if (status === 'accepted') {
//       // Initiate conversation
//       const conversation = new Conversation({
//         participants: [request.userId, request.lawyerId]
//       });
//       await conversation.save();
//     }

//     res.json({ message: 'Request status updated' });
//   } catch (error) {
//     console.error('[ERROR] Updating request status:', error);
//     res.status(500).json({ message: 'Failed to update request status' });
//   }
// });
app.post('/api/updateRequestStatus', async (req, res) => {
  try {
    const { requestId, status } = req.body;
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    request.status = status;
    await request.save();

    if (status === 'accepted') {
      // Initiate conversation
      const conversation = new Conversation({
        participants: [request.userId, request.lawyerId]
      });
      await conversation.save();

      // Optionally, send a notification or the conversation ID back to the client
      return res.status(200).json({ conversationId: conversation._id });
    }

    res.json({ message: 'Request status updated' });
  } catch (error) {
    console.error('[ERROR] Updating request status:', error);
    res.status(500).json({ message: 'Failed to update request status' });
  }
});

app.post('/api/message', async (req, res) => {
  try {
    const { conversationId, senderId, receiverId, content } = req.body;
    console.log('[DEBUG] Received message data:', { conversationId, senderId, receiverId, content });

    const newMessage = new Message({
      conversationId,
      sender: senderId,
      receiver: receiverId,
      content,
      timestamp: new Date()
    });

    await newMessage.save();
    console.log('[DEBUG] Message saved:', newMessage);

    // Emit the new message to the conversation participants
    io.to(conversationId).emit('newMessage', newMessage);

    res.status(201).json({ message: 'Message sent successfully!', message: newMessage });
  } catch (error) {
    console.error('[ERROR] Saving message:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// START SERVER
const PORT = 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`[DEBUG] Server running on port ${PORT}`);
  console.log('[DEBUG] WebSocket server ready');
});
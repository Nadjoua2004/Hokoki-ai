const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const http = require('http');
const socketIo = require('socket.io');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

// Models
const User = require('./models/User');
const Lawyer = require('./models/Lawyer');
const Message = require('./models/Message');
const Conversation = require('./models/Conversation');
const Request = require('./models/Request');
const Document = require('./models/Document');


const app = express();

// Middleware
app.use((req, res, next) => {
  console.log(`[DEBUG] Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use(cors({
  origin: ['http://localhost:19006', 'http://192.168.142.1:19006', process.env.MOODLE_URL || 'http://localhost']
}));
app.use(express.json());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Socket.IO Setup
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

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

// ========================
// ROUTES
// ========================

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

app.get('/api/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('name surname');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('[ERROR] Fetching user:', error);
    res.status(500).json({ message: 'Error fetching user details' });
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
      experienceSummary: lawyer.experienceSummary || '', // Add this line
      wilaya: lawyer.wilaya || 'Not specified',
      rating: lawyer.rating || 0,
      languages: lawyer.languages || [], // Add this line
      specialty: lawyer.specialty || '', // Add this line if needed
      lawFirm: lawyer.lawFirm || '', // Add this line if needed
      clients: lawyer.clients || 0, // Add this line if needed
      cases: lawyer.cases || 0 // Add this line if needed
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
// In your backend API (e.g., lawyerRoutes.js)
const lawyerNumberMap = new Map(); // Stores mapping of lawyer IDs to anonymous numbers

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

    // Check if request comes from an admin or the lawyer themselves
    const shouldShowRealName = req.user?.isAdmin || req.user?.id === req.params.id;

    // Generate or get anonymous number for this lawyer
    let anonymousNumber;
    if (!shouldShowRealName) {
      if (!lawyerNumberMap.has(req.params.id)) {
        anonymousNumber = lawyerNumberMap.size + 1;
        lawyerNumberMap.set(req.params.id, anonymousNumber);
      } else {
        anonymousNumber = lawyerNumberMap.get(req.params.id);
      }
    }

    res.json({
      success: true,
      lawyer: {
        id: lawyer._id,
        name: shouldShowRealName ? lawyer.name : `Anonymous Lawyer ${anonymousNumber}`,
        surname: shouldShowRealName ? lawyer.surname : "",
        email: shouldShowRealName ? lawyer.email : "",
        phonenumb: shouldShowRealName ? lawyer.phonenumb : "",
        idc: shouldShowRealName ? lawyer.idc : "",
        experienceYears: lawyer.experienceYears,
        wilaya: lawyer.wilaya,
        rating: lawyer.rating,
        photo: shouldShowRealName ? lawyer.photo : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        createdAt: lawyer.createdAt,
        anonymousNumber: anonymousNumber || null
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

// ========================
// REQUEST ENDPOINTS
// ========================

// Check if request exists
app.get('/api/checkRequest', async (req, res) => {
  try {
    const { userId, lawyerId } = req.query;
    const request = await Request.findOne({ userId, lawyerId });
    res.json({ exists: !!request });
  } catch (error) {
    console.error('[ERROR] Checking request:', error);
    res.status(500).json({ message: 'Failed to check request' });
  }
});

// Create a request
app.post('/api/createRequest', async (req, res) => {
  try {
    const { userId, lawyerId } = req.body;
    
    // Check if request already exists
    const existingRequest = await Request.findOne({ userId, lawyerId });
    if (existingRequest) {
      return res.status(400).json({ message: 'Request already exists' });
    }

    const request = new Request({ userId, lawyerId });
    await request.save();
    res.status(201).json({ 
      message: 'Request sent successfully!',
      requestId: request._id
    });
  } catch (error) {
    console.error('[ERROR] Creating request:', error);
    res.status(500).json({ message: 'Failed to send request' });
  }
});

// Fetch requests for a lawyer
app.get('/api/lawyerRequests/:lawyerId', async (req, res) => {
  try {
    const requests = await Request.find({ lawyerId: req.params.lawyerId })
                                 .sort({ timestamp: -1 });
    res.json(requests);
  } catch (error) {
    console.error('[ERROR] Fetching requests:', error);
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
});

app.post('/api/updateRequestStatus', async (req, res) => {
  try {
    const { requestId, status } = req.body;
    const request = await Request.findById(requestId);
    
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    // Update request status
    request.status = status;
    await request.save();

    if (status === 'accepted') {
      // Check if conversation already exists
      let conversation = await Conversation.findOne({
        participants: { $all: [request.userId, request.lawyerId] }
      });

      // If no conversation exists, create one
      if (!conversation) {
        conversation = new Conversation({
          participants: [request.userId, request.lawyerId]
        });
        await conversation.save();
      }

      // Delete the request since it's been accepted
      await Request.findByIdAndDelete(requestId);

      return res.status(200).json({ 
        success: true,
        message: 'Request accepted and conversation created',
        conversationId: conversation._id
      });
    } else if (status === 'rejected') {
      // Delete the request if rejected
      await Request.findByIdAndDelete(requestId);
      return res.status(200).json({ 
        success: true,
        message: 'Request rejected and removed'
      });
    }

    res.status(200).json({ success: true, message: 'Request status updated' });
  } catch (error) {
    console.error('[ERROR] Updating request status:', error);
    res.status(500).json({ success: false, message: 'Failed to update request status' });
  }
});

// ========================
// CONVERSATION ENDPOINTS
// ========================

// In your server code
app.post('/api/initiateConversation', async (req, res) => {
  try {
    const { userId, lawyerId } = req.body;
    
    // Check if conversation exists - using $all to match regardless of order
    const existing = await Conversation.findOne({
      participants: { $all: [userId, lawyerId] }
    });

    if (existing) {
      return res.json({ 
        conversationId: existing._id,
        message: 'Conversation already exists'
      });
    }

    // Create new conversation with sorted participants for consistency
    const conversation = new Conversation({
      participants: [userId, lawyerId].sort() // Sort to ensure consistent order
    });
    
    await conversation.save();

    res.status(201).json({
      conversationId: conversation._id,
      message: 'Conversation created'
    });
  } catch (error) {
    console.error('Error initiating conversation:', error);
    res.status(500).json({
      message: 'Server error during conversation initiation'
    });
  }
});

app.get('/api/conversation/:conversationId/messages', async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId })
                                 .sort({ timestamp: 1 })
                                 .populate('sender', '_id name') // Ensure sender is populated
                                 .lean(); // Convert to plain JS object
    
    // Add senderId if not present
    const processedMessages = messages.map(msg => ({
      ...msg,
      senderId: msg.sender?._id || msg.senderId
    }));

    res.json({ success: true, messages: processedMessages });
  } catch (error) {
    console.error('[ERROR] Fetching messages:', error);
    res.status(500).json({ success: false, message: 'Error fetching messages' });
  }
});

app.get('/api/user/:userId/conversations', async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.params.userId })
      .populate({
        path: 'participants',
        select: 'name email photo',
        model: 'User'
      })
      .sort({ updatedAt: -1 });

    // Get last message for each conversation
    const conversationsWithLastMessage = await Promise.all(
      conversations.map(async (conv) => {
        const lastMessage = await Message.findOne({ conversationId: conv._id })
                                        .sort({ timestamp: -1 })
                                        .limit(1);
        return {
          ...conv.toObject(),
          lastMessage
        };
      })
    );

    res.json({ success: true, conversations: conversationsWithLastMessage });
  } catch (error) {
    console.error('[ERROR] Fetching conversations:', error);
    res.status(500).json({ success: false, message: 'Error fetching conversations' });
  }
});

app.get('/api/lawyer/:lawyerId/conversations', async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.params.lawyerId })
      .populate({
        path: 'participants',
        select: 'name email photo',
        model: 'User'
      })
      .sort({ updatedAt: -1 });

    // Get last message for each conversation
    const conversationsWithLastMessage = await Promise.all(
      conversations.map(async (conv) => {
        const lastMessage = await Message.findOne({ conversationId: conv._id })
                                        .sort({ timestamp: -1 })
                                        .limit(1);
        return {
          ...conv.toObject(),
          lastMessage
        };
      })
    );

    res.json({ success: true, conversations: conversationsWithLastMessage });
  } catch (error) {
    console.error('[ERROR] Fetching conversations:', error);
    res.status(500).json({ success: false, message: 'Error fetching conversations' });
  }
});

// ========================
// MESSAGE ENDPOINTS
// ========================

app.post('/api/message', async (req, res) => {
  try {
    const { conversationId, senderId, receiverId, content, senderModel, receiverModel } = req.body;

    const newMessage = new Message({
      conversationId,
      sender: senderId,
      senderModel,
      receiver: receiverId,
      receiverModel,
      content,
      timestamp: new Date()
    });

    await newMessage.save();

    // Update conversation's updatedAt timestamp
    await Conversation.findByIdAndUpdate(conversationId, { updatedAt: new Date() });

    // Emit the new message to the conversation participants
    io.to(conversationId).emit('newMessage', newMessage);

    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully!',
      message: newMessage 
    });
  } catch (error) {
    console.error('[ERROR] Saving message:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('login', ({ userId, role }) => {
    socket.join(userId);
    console.log(`${role} ${userId} connected`);
  });

  socket.on('joinConversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`User joined conversation ${conversationId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});




// Lawyer Profile Update Endpoint (Simplified without photo upload)
app.put('/api/lawyer/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    console.log('[DEBUG] Updating lawyer profile:', id, updates);

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    // List of allowed fields to update
    const allowedUpdates = [
      'phonenumb', 
      'description', 
      'experienceYears', 
      'wilaya', 
      'languages'
    ];

    // Filter updates to only include allowed fields
    const filteredUpdates = {};
    for (const key in updates) {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    }

    // Handle languages array (if provided)
    if (updates.languages && typeof updates.languages === 'string') {
      try {
        filteredUpdates.languages = JSON.parse(updates.languages);
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: 'Invalid languages format'
        });
      }
    }

    // Validate phone number
    if (filteredUpdates.phonenumb && !/^[0-9]{10}$/.test(filteredUpdates.phonenumb)) {
      return res.status(400).json({
        success: false,
        message: 'Phone number must be 10 digits'
      });
    }

    // Validate experience years
    if (filteredUpdates.experienceYears && 
        (filteredUpdates.experienceYears < 0 || filteredUpdates.experienceYears > 50)) {
      return res.status(400).json({
        success: false,
        message: 'Experience years must be between 0 and 50'
      });
    }

    // Find and update the lawyer
    const lawyer = await Lawyer.findByIdAndUpdate(
      id,
      { $set: filteredUpdates },
      { new: true, runValidators: true }
    ).select('-password -__v');

    if (!lawyer) {
      return res.status(404).json({ success: false, message: 'Lawyer not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      lawyer
    });
  } catch (error) {
    console.error('[ERROR] Updating lawyer profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});



//
//Documments 
//
// API to create a document



app.post('/api/documents', async (req, res) => {
  try {
    const { title, number, entity, type, pdfUrl, relatedTo } = req.body;

    

    // Create new document
    const document = new Document({
      title,
      number,
      entity: parseInt(entity),
      type: parseInt(type),
      pdfUrl,
      relatedTo: relatedTo || null
    });

    await document.save();

    res.status(201).json({
      message: 'Document created successfully!',
      document: {
        id: document._id,
        title: document.title,
        entity: document.entity,
        type: document.type,
        pdfUrl: document.pdfUrl
      }
    });
  } catch (error) {
    console.error('[ERROR] Creating document:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error during document creation' });
  }
});






// API to fetch documents
app.get('/api/documents', async (req, res) => {
  try {
    console.log('[DEBUG] Fetching documents from database...');
    const documents = await Document.find({});
    console.log('[DEBUG] Documents fetched:', documents.length);

    const processedDocuments = documents.map(document => ({
      id: document._id,
      title: document.title,
      number: document.number,
      entity: document.entity,
      type: document.type,
      pdfUrl: document.pdfUrl,
      relatedTo: document.relatedTo,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt
    }));

    console.log('[DEBUG] Sending response with documents data...');
    res.json({
      success: true,
      count: processedDocuments.length,
      documents: processedDocuments
    });
  } catch (error) {
    console.error('[ERROR] Fetching documents:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch documents',
      error: error.message
    });
  }
});

// Get related documents endpoint
app.get('/api/documents/related/:id', async (req, res) => {
  try {
    // Validate the ID parameter
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid document ID' });
    }

    // Find documents where relatedTo matches the provided ID
    const relatedDocuments = await Document.find({ relatedTo: req.params.id });

    res.status(200).json({ 
      success: true,
      count: relatedDocuments.length,
      documents: relatedDocuments 
    });
  } catch (err) {
    console.error('Error fetching related documents:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error while fetching related documents' 
    });
  }
});


// AI Legal Assistant Endpoint
app.post('/api/ask', async (req, res) => {
  try {
    const fetchResponse = await fetch(process.env.AI_API_URL || 'http://localhost:8000/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questions: req.body.questions }),
      timeout: 10000
    });

    if (!fetchResponse.ok) {
      throw new Error(`AI API error: ${fetchResponse.status}`);
    }

    const data = await fetchResponse.json();
    res.json(data);
  } catch (error) {
    console.error('AI Service Error:', error);
    res.status(500).json({
      error: error.message || 'AI Service Unavailable'
    });
  }
});

// ========================
// SERVER START
// ========================
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server ready`);
  console.log(`AI Service Proxy: ${process.env.AI_API_URL || 'http://localhost:8000/ask'}`);
});
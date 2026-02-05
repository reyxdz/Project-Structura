require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let User = require('./models/User');
let Form = require('./models/Form');
const memoryDb = require('./memory-db');

const app = express();
const PORT = process.env.PORT || 4000;
let MONGO = process.env.MONGO_URI;
let useMemoryDb = false;

app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || true }));

async function startServer() {
  try {
    // if MONGO_URI not provided, use simple in-memory DB
    if (!MONGO) {
      useMemoryDb = true;
      User = memoryDb.User;
      console.log('Using simple in-memory database (data will reset on server restart)');
    } else {
      await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('MongoDB connected');
    }
    app.listen(PORT, () => console.log('Auth server running on', PORT));
  } catch (err) {
    console.error('Startup error', err);
    process.exit(1);
  }
}

startServer();

function generateToken(user) {
  const secret = process.env.JWT_SECRET || 'change-me';
  return jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '7d' });
}

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ firstName, lastName, username, email, passwordHash: hash });
    await user.save();

    const token = generateToken(user);
    return res.status(201).json({ email: user.email, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    return res.status(200).json({ email: user.email, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/me', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  const token = auth.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change-me');
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) return res.status(401).json({ message: 'User not found' });
    return res.json({ email: user.email, firstName: user.firstName, lastName: user.lastName });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

// ======================== Form Management Endpoints ========================

// Middleware: Verify JWT token
function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token provided' });
  
  const token = auth.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change-me');
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// GET /api/forms - Get all forms for the authenticated user
app.get('/api/forms', verifyToken, async (req, res) => {
  try {
    const forms = await Form.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select('-__v');
    
    return res.json({ forms });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch forms' });
  }
});

// GET /api/forms/:id - Get a specific form by ID
app.get('/api/forms/:id', verifyToken, async (req, res) => {
  try {
    const form = await Form.findOne({
      _id: req.params.id,
      userId: req.userId,
    }).select('-__v');

    if (!form) return res.status(404).json({ message: 'Form not found' });
    return res.json({ form });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch form' });
  }
});

// POST /api/forms - Create a new form
app.post('/api/forms', verifyToken, async (req, res) => {
  try {
    const { title, description, fields, template } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Form title is required' });
    }

    const form = new Form({
      title: title.trim(),
      description: description || '',
      fields: fields || [],
      template: template || 'default',
      userId: req.userId,
    });

    await form.save();
    return res.status(201).json({ form });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to create form' });
  }
});

// PUT /api/forms/:id - Update a form
app.put('/api/forms/:id', verifyToken, async (req, res) => {
  try {
    const { title, description, fields, settings, template } = req.body;

    const form = await Form.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!form) return res.status(404).json({ message: 'Form not found' });

    if (title !== undefined) form.title = title.trim();
    if (description !== undefined) form.description = description;
    if (fields !== undefined) form.fields = fields;
    if (settings !== undefined) form.settings = settings;
    if (template !== undefined) form.template = template;

    await form.save();
    return res.json({ form });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to update form' });
  }
});

// DELETE /api/forms/:id - Delete a form
app.delete('/api/forms/:id', verifyToken, async (req, res) => {
  try {
    const form = await Form.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!form) return res.status(404).json({ message: 'Form not found' });
    return res.json({ message: 'Form deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to delete form' });
  }
});

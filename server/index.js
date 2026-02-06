require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let User = require('./models/User');
let Form = require('./models/Form');
let FormResponse = require('./models/FormResponse');
const { generatePublicToken, isValidToken } = require('./utils/tokenGenerator');
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
    return res.status(201).json({ email: user.email, firstName: user.firstName, token });
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
    return res.status(200).json({ email: user.email, firstName: user.firstName, token });
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

// ==================== FORM PUBLISHING ENDPOINTS ====================

/**
 * POST /api/forms/:formId/publish
 * Publish a form and generate a public sharing link
 * Requires authentication
 */
app.post('/api/forms/:formId/publish', verifyToken, async (req, res) => {
  try {
    const { formId } = req.params;

    // Verify form exists and user owns it
    const form = await Form.findOne({
      _id: formId,
      userId: req.userId,
    });

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Generate unique public token
    let publicToken;
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      publicToken = generatePublicToken();
      const existing = await Form.findOne({ publicToken });
      if (!existing) isUnique = true;
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({ message: 'Failed to generate unique token' });
    }

    // Update form with publish info
    form.status = 'published';
    form.publicToken = publicToken;
    form.publishedAt = new Date();
    await form.save();

    const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
    const publicUrl = `${baseUrl}/form/${publicToken}`;

    return res.json({
      message: 'Form published successfully',
      form: {
        _id: form._id,
        status: form.status,
        publicToken: form.publicToken,
        publicUrl: publicUrl,
        publishedAt: form.publishedAt,
        responseCount: form.responseCount,
      },
    });
  } catch (err) {
    console.error('Publish error:', err);
    return res.status(500).json({ message: 'Failed to publish form' });
  }
});

/**
 * POST /api/forms/:formId/unpublish
 * Unpublish a form and revoke sharing link
 * Requires authentication
 */
app.post('/api/forms/:formId/unpublish', verifyToken, async (req, res) => {
  try {
    const { formId } = req.params;

    const form = await Form.findOne({
      _id: formId,
      userId: req.userId,
    });

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    form.status = 'draft';
    form.publicToken = null;
    form.publishedAt = null;
    await form.save();

    return res.json({
      message: 'Form unpublished successfully',
      form: {
        _id: form._id,
        status: form.status,
        title: form.title,
      },
    });
  } catch (err) {
    console.error('Unpublish error:', err);
    return res.status(500).json({ message: 'Failed to unpublish form' });
  }
});

/**
 * GET /api/forms/public/:publicToken
 * Fetch a published form by public token (NO AUTHENTICATION REQUIRED)
 * Returns only necessary fields for form display
 */
app.get('/api/forms/public/:publicToken', async (req, res) => {
  try {
    const { publicToken } = req.params;

    // Validate token format
    if (!isValidToken(publicToken)) {
      return res.status(400).json({ message: 'Invalid token format' });
    }

    const form = await Form.findOne({
      publicToken: publicToken,
      status: 'published',
    }).select('-userId -settings -__v');

    if (!form) {
      return res.status(404).json({
        message: 'Form not found or is no longer available',
      });
    }

    return res.json({
      form: {
        _id: form._id,
        title: form.title,
        description: form.description,
        fields: form.fields,
        template: form.template,
      },
    });
  } catch (err) {
    console.error('Get public form error:', err);
    return res.status(500).json({ message: 'Failed to fetch form' });
  }
});

/**
 * POST /api/forms/public/:publicToken/submit
 * Submit a response to a published form (NO AUTHENTICATION REQUIRED)
 * Validates and stores form responses
 */
app.post('/api/forms/public/:publicToken/submit', async (req, res) => {
  try {
    const { publicToken } = req.params;
    const { responses, submittedBy } = req.body;

    // Validate token format
    if (!isValidToken(publicToken)) {
      return res.status(400).json({ message: 'Invalid token format' });
    }

    // Find published form
    const form = await Form.findOne({
      publicToken: publicToken,
      status: 'published',
    });

    if (!form) {
      return res.status(404).json({
        message: 'Form not found or is no longer available',
      });
    }

    // Validate responses
    if (!Array.isArray(responses) || responses.length === 0) {
      return res.status(400).json({
        message: 'Invalid responses format',
      });
    }

    // Create form response document
    const formResponse = new FormResponse({
      formId: form._id,
      responses: responses,
      submittedBy: submittedBy || 'anonymous',
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
    });

    await formResponse.save();

    // Increment response count
    form.responseCount += 1;
    await form.save();

    return res.status(201).json({
      message: 'Response submitted successfully',
      response: {
        _id: formResponse._id,
        submittedAt: formResponse.submittedAt,
      },
    });
  } catch (err) {
    console.error('Submit response error:', err);
    return res.status(500).json({ message: 'Failed to submit form response' });
  }
});

/**
 * GET /api/forms/:formId/responses
 * Get all responses for a specific form
 * Requires authentication and form ownership
 */
app.get('/api/forms/:formId/responses', verifyToken, async (req, res) => {
  try {
    const { formId } = req.params;
    const { limit = 50, skip = 0 } = req.query;

    // Verify form exists and user owns it
    const form = await Form.findOne({
      _id: formId,
      userId: req.userId,
    });

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Fetch responses
    const responses = await FormResponse.find({ formId: formId })
      .sort({ submittedAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const totalCount = await FormResponse.countDocuments({ formId: formId });

    return res.json({
      form: {
        _id: form._id,
        title: form.title,
        responseCount: form.responseCount,
      },
      responses: responses,
      pagination: {
        total: totalCount,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: parseInt(skip) + parseInt(limit) < totalCount,
      },
    });
  } catch (err) {
    console.error('Get responses error:', err);
    return res.status(500).json({ message: 'Failed to fetch responses' });
  }
});

/**
 * GET /api/forms/:formId/responses/:responseId
 * Get a specific response
 * Requires authentication and form ownership
 */
app.get('/api/forms/:formId/responses/:responseId', verifyToken, async (req, res) => {
  try {
    const { formId, responseId } = req.params;

    // Verify form ownership
    const form = await Form.findOne({
      _id: formId,
      userId: req.userId,
    });

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Fetch specific response
    const response = await FormResponse.findOne({
      _id: responseId,
      formId: formId,
    });

    if (!response) {
      return res.status(404).json({ message: 'Response not found' });
    }

    return res.json({ response: response });
  } catch (err) {
    console.error('Get response error:', err);
    return res.status(500).json({ message: 'Failed to fetch response' });
  }
});

// SPA Fallback: Serve React app for all non-API routes
app.use((req, res) => {
  const isDev = process.env.NODE_ENV !== 'production';
  
  if (isDev) {
    // In development, redirect to frontend dev server
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const originalPath = req.originalUrl;
    return res.redirect(303, `${frontendUrl}${originalPath}`);
  }
  
  // In production, serve the built React app (if available)
  const path = require('path');
  const indexPath = path.join(__dirname, '../react-project-structura/dist/index.html');
  try {
    return res.sendFile(indexPath);
  } catch (err) {
    return res.status(404).json({ message: 'Not found' });
  }
});


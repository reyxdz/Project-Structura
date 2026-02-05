const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        default: '',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    fields: {
        type: Array,
        default: [],
    },
    template: {
        type: String,
        default: 'default',
        enum: ['default', 'deep-executive', 'nordic-minimalist', 'cyber-punch', 'botanical', 'glassmorphism', 'retro-paper'],
    },
    settings: {
        type: Object,
        default: {},
    },
    // Publishing & sharing fields
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft',
    },
    publicToken: {
        type: String,
        unique: true,
        sparse: true, // allows null values for draft forms
    },
    publishedAt: {
        type: Date,
        default: null,
    },
    responseCount: {
        type: Number,
        default: 0,
    },
    // Metadata
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Index on publicToken for faster lookups
formSchema.index({ publicToken: 1 });

// Index on userId for faster user form queries
formSchema.index({ userId: 1 });

// Update the updatedAt field before saving
formSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Form', formSchema);

const mongoose = require('mongoose');

const formResponseSchema = new mongoose.Schema({
    formId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form',
        required: true,
    },
    // Array of field responses
    responses: [
        {
            fieldId: {
                type: String,
                required: true,
            },
            fieldLabel: {
                type: String,
            },
            fieldType: {
                type: String,
            },
            value: {
                type: mongoose.Schema.Types.Mixed, // Can be string, number, boolean, array, etc.
                default: null,
            },
        },
    ],
    // Optional: track who submitted
    submittedBy: {
        type: String,
        default: 'anonymous', // Can be email if form requires it
    },
    // IP address for analytics (optional)
    ipAddress: {
        type: String,
        default: null,
    },
    // User agent for analytics (optional)
    userAgent: {
        type: String,
        default: null,
    },
    // Submission metadata
    submittedAt: {
        type: Date,
        default: Date.now,
    },
});

// Index on formId for faster queries
formResponseSchema.index({ formId: 1 });

// Index on submittedAt for sorting
formResponseSchema.index({ submittedAt: -1 });

module.exports = mongoose.model('FormResponse', formResponseSchema);

/**
 * Utility for generating secure public tokens for form sharing
 * Tokens are short, unique, and URL-safe
 */

const crypto = require('crypto');

/**
 * Generates a unique public token for sharing forms
 * Format: 12 random characters (alphanumeric)
 * Example: "abc12xyz9def"
 * 
 * @returns {string} - Unique public token
 */
function generatePublicToken() {
    return crypto.randomBytes(9).toString('hex').substring(0, 12);
}

/**
 * Validates if a token is in correct format
 * @param {string} token - Token to validate
 * @returns {boolean} - True if valid format
 */
function isValidToken(token) {
    return /^[a-f0-9]{12}$/.test(token);
}

module.exports = {
    generatePublicToken,
    isValidToken,
};

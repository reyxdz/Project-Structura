/**
 * Form API Service
 * Handles all form-related API calls for publishing, sharing, and submission
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

/**
 * Get auth token from localStorage
 * @returns {string|null} - JWT token or null if not found
 */
function getAuthToken() {
  return localStorage.getItem('token');
}

/**
 * Publish a form and generate public sharing link
 * @param {string} formId - Form ID to publish
 * @returns {Promise<Object>} - Published form data with publicToken and publicUrl
 */
export async function publishForm(formId) {
  const token = getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/forms/${formId}/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to publish form');
  }

  return response.json();
}

/**
 * Unpublish a form and revoke sharing link
 * @param {string} formId - Form ID to unpublish
 * @returns {Promise<Object>} - Unpublished form data
 */
export async function unpublishForm(formId) {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}/forms/${formId}/unpublish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to unpublish form');
  }

  return response.json();
}

/**
 * Fetch a published form by public token
 * NO AUTHENTICATION REQUIRED
 * @param {string} publicToken - Public sharing token
 * @returns {Promise<Object>} - Form data (fields, title, description, template)
 */
export async function getPublicForm(publicToken) {
  const response = await fetch(`${API_BASE_URL}/forms/public/${publicToken}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch form');
  }

  return response.json();
}

/**
 * Submit responses to a published form
 * NO AUTHENTICATION REQUIRED
 * @param {string} publicToken - Public sharing token
 * @param {Array} responses - Array of field responses
 * @param {string} submittedBy - Submitter identifier (email or name, optional)
 * @returns {Promise<Object>} - Response confirmation
 */
export async function submitFormResponse(publicToken, responses, submittedBy = 'anonymous') {
  const response = await fetch(`${API_BASE_URL}/forms/public/${publicToken}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      responses: responses,
      submittedBy: submittedBy,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to submit form response');
  }

  return response.json();
}

/**
 * Get all responses for a form (admin only)
 * Requires authentication and form ownership
 * @param {string} formId - Form ID
 * @param {Object} options - Query options { limit, skip }
 * @returns {Promise<Object>} - Form data and array of responses
 */
export async function getFormResponses(formId, options = {}) {
  const token = getAuthToken();
  const { limit = 50, skip = 0 } = options;

  const url = new URL(`${API_BASE_URL}/forms/${formId}/responses`);
  url.searchParams.append('limit', limit);
  url.searchParams.append('skip', skip);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch responses');
  }

  return response.json();
}

/**
 * Get a specific form response (admin only)
 * @param {string} formId - Form ID
 * @param {string} responseId - Response ID
 * @returns {Promise<Object>} - Response data
 */
export async function getFormResponse(formId, responseId) {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}/forms/${formId}/responses/${responseId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch response');
  }

  return response.json();
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<void>}
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

/**
 * Generate QR code URL for a form link
 * Uses qr-server.com free API
 * @param {string} url - URL to encode
 * @param {Object} options - QR options { size, errorCorrection }
 * @returns {string} - QR code image URL
 */
export function generateQRCodeUrl(url, options = {}) {
  const { size = 300, errorCorrection = 'M' } = options;
  const encodedUrl = encodeURIComponent(url);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedUrl}&ecc=${errorCorrection}`;
}

export default {
  publishForm,
  unpublishForm,
  getPublicForm,
  submitFormResponse,
  getFormResponses,
  getFormResponse,
  copyToClipboard,
  generateQRCodeUrl,
};

# Form Publishing & Sharing - Implementation Guide

## Overview
This document outlines the complete architecture for the form publishing and sharing feature in Project Structura.

---

## Feature Description

The publish feature enables form creators to:
1. Convert a draft form to "published" status
2. Generate a unique public shareable link
3. Share the link with participants
4. View all collected responses
5. Unpublish a form to revoke access

Participants can:
1. Open the public link
2. Fill out the form with their responses
3. Submit responses securely
4. See a success confirmation

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      PROJECT STRUCTURA                           │
├──────────────────────────┬──────────────────────────────────────┤
│                          │                                       │
│    BACKEND (Node/Express)│      FRONTEND (React)                │
│    ├─ Models             │      ├─ Pages/Components            │
│    │  ├─ Form.js         │      │  ├─ FormBuilder.jsx          │
│    │  └─ FormResponse.js │      │  ├─ PublishModal.jsx         │
│    │                     │      │  └─ PublicFormViewer.jsx     │
│    ├─ API Routes         │      │                               │
│    │  ├─ POST /publish   │      ├─ Utils                       │
│    │  ├─ GET /public/:tk │      │  └─ formApi.js               │
│    │  ├─ POST /submit    │      │                               │
│    │  └─ GET /responses  │      └─ App.jsx (Router)            │
│    │                     │                                      │
│    └─ Utils              │                                      │
│       └─ tokenGenerator  │                                      │
│                          │                                      │
├──────────────────────────┴──────────────────────────────────────┤
│                                                                   │
│              MongoDB Atlas (Database)                            │
│              ├─ Forms Collection                                │
│              ├─ FormResponses Collection                        │
│              └─ Users Collection                                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Models

### Form Model (Updated)
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  userId: ObjectId,
  fields: Array,
  template: String,
  settings: Object,
  
  // ✨ NEW FIELDS
  status: 'draft' | 'published',
  publicToken: String (unique, nullable),
  publishedAt: Date,
  responseCount: Number,
  
  createdAt: Date,
  updatedAt: Date
}
```

### FormResponse Model (NEW)
```javascript
{
  _id: ObjectId,
  formId: ObjectId (ref to Form),
  responses: [
    {
      fieldId: String,
      fieldLabel: String,
      fieldType: String,
      value: Mixed
    }
  ],
  submittedBy: String,
  ipAddress: String,
  userAgent: String,
  submittedAt: Date
}
```

---

## API Endpoints

### Authentication Required (Authenticated Users)

#### POST `/api/forms/:formId/publish`
Publish a form and generate public token
- Request: `{ }`
- Response: Form with publicToken and publicUrl

#### POST `/api/forms/:formId/unpublish`
Unpublish a form and revoke access
- Request: `{ }`
- Response: Form with status='draft'

#### GET `/api/forms/:formId/responses`
Get all responses for a form
- Query: `?limit=50&skip=0`
- Response: Array of FormResponse documents

#### GET `/api/forms/:formId/responses/:responseId`
Get a specific response
- Response: Single FormResponse document

---

### Public Endpoints (NO Authentication)

#### GET `/api/forms/public/:publicToken`
Fetch published form by token
- Response: Form data (title, description, fields, template)

#### POST `/api/forms/public/:publicToken/submit`
Submit form response
- Body: `{ responses: [...], submittedBy: "..." }`
- Response: Confirmation with responseId

---

## Frontend Flow

### 1. Publishing a Form

```
FormBuilder.jsx
    ↓
[Click Publish Button]
    ↓
formApi.publishForm(formId)
    ↓
API: POST /forms/:formId/publish
    ↓
Backend generates publicToken
    ↓
Returns: { publicToken, publicUrl }
    ↓
PublishModal shows link & QR code
    ↓
User can copy link or scan QR
```

### 2. Sharing the Form

```
Public Link: http://localhost:3000/form/{publicToken}
    ↓
Share via:
├─ Copy & Paste
├─ Email
├─ WhatsApp/Messaging
└─ QR Code (scan with phone)
```

### 3. Opening Public Form

```
Participant opens link
    ↓
PublicFormViewer.jsx mounts with :publicToken param
    ↓
formApi.getPublicForm(publicToken)
    ↓
API: GET /forms/public/:publicToken
    ↓
Returns: Form structure (fields, template, title)
    ↓
Component renders form with FormField components
    ↓
Applies selected template styling
```

### 4. Submitting Form

```
Participant fills all fields
    ↓
[Click Submit Button]
    ↓
Validate all required fields
    ↓
formApi.submitFormResponse(publicToken, responses)
    ↓
API: POST /forms/public/:publicToken/submit
    ↓
Backend validates responses
    ↓
Creates FormResponse document
    ↓
Increments form.responseCount
    ↓
Returns: { success, submittedAt }
    ↓
Show success message
    ↓
Optional: Redirect or reset form
```

### 5. Viewing Responses (Admin)

```
FormBuilder → Open form → [View Responses]
    ↓
formApi.getFormResponses(formId)
    ↓
API: GET /forms/:formId/responses
    ↓
Backend checks ownership
    ↓
Returns: All FormResponse documents
    ↓
Display in responses table/grid
    ↓
Click response → formApi.getFormResponse()
    ↓
Show detailed response modal
```

---

## Components to Create

### 1. PublishModal.jsx
**Location:** `src/components/FormBuilder/PublishModal.jsx`

**Features:**
- Modal dialog showing public link
- Copy to clipboard button
- QR code display
- Show response count
- Unpublish button
- Loading and error states

**Props:**
```typescript
{
  isOpen: boolean,
  onClose: () => void,
  formId: string,
  publishData: {
    publicToken: string,
    publicUrl: string,
    responseCount: number
  }
}
```

### 2. PublicFormViewer.jsx
**Location:** `src/components/FormViewer/PublicFormViewer.jsx`

**Features:**
- Fetch form by public token
- Render form fields (reuse FormField)
- Apply theme styling
- Form validation
- Submit button with loading state
- Success confirmation
- Error handling
- Responsive design

**Uses:**
- `useParams()` → publicToken from URL
- `useEffect()` → Fetch form on mount
- `formApi.getPublicForm()`
- `formApi.submitFormResponse()`

### 3. Update FormBuilder.jsx
**Changes:**
- Import PublishModal component
- Add `showPublishModal` state
- Add `publishData` state
- Connect Publish button to `handlePublish()`
- Show/hide PublishModal

```javascript
const handlePublish = async () => {
  try {
    const result = await publishForm(form._id);
    setPublishData(result.form);
    setShowPublishModal(true);
    showToast('Form published!', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
};
```

### 4. Update App.jsx
**Changes:**
- Import PublicFormViewer
- Add new route: `<Route path="/form/:publicToken" element={<PublicFormViewer />} />`

```javascript
<BrowserRouter>
  <Routes>
    {/* Existing routes */}
    <Route path="/form/:publicToken" element={<PublicFormViewer />} />
  </Routes>
</BrowserRouter>
```

---

## Styling & Theme Support

### PublishModal
- Use theme colors for buttons
- Responsive modal with overlay
- Dark mode support
- Animation on open/close

### PublicFormViewer
- Apply form.template class to root div
- Reuse FormField.jsx styling
- Use theme CSS variables
- Full theme support (all 7 themes)

```javascript
<div className={`form-template-${form.template}`}>
  {/* Form content */}
</div>
```

---

## Error Handling

### Backend Errors
- **400:** Invalid token format or validation errors
- **404:** Form not found or no longer published
- **401:** Unauthorized (for admin endpoints)
- **500:** Server errors

### Frontend Error Messages
```javascript
// Network error
"Unable to reach the server. Please try again later."

// Form not found
"Form not found or is no longer available."

// Validation error
"Please fill in all required fields."

// Submission error
"Failed to submit form. Please try again."
```

---

## Security Considerations

### Public Form Security
- ✅ Forms accessible only via unique publicToken
- ✅ publicToken is 12-character hex (cryptographically random)
- ✅ No form ID exposed in public URL
- ✅ Responses validated on backend before saving
- ✅ CORS enabled for trusted domains

### Admin Response Viewing
- ✅ Requires JWT authentication
- ✅ Checks form ownership before returning responses
- ✅ IP and user-agent logged for analytics

### Recommendations
- [ ] Add rate limiting to submission endpoint
- [ ] Add CAPTCHA for public form submissions
- [ ] Implement email verification for responses
- [ ] Add response encryption for sensitive forms

---

## Testing Plan

### Backend Testing
```bash
# Test publish endpoint
curl -X POST http://localhost:4000/api/forms/{id}/publish \
  -H "Authorization: Bearer {token}"

# Test public form fetch
curl http://localhost:4000/api/forms/public/{publicToken}

# Test form submission
curl -X POST http://localhost:4000/api/forms/public/{publicToken}/submit \
  -H "Content-Type: application/json" \
  -d '{"responses": [...], "submittedBy": "test"}'
```

### Frontend Testing
- [ ] Click Publish → Modal shows with link
- [ ] Copy link → Works without errors
- [ ] QR code displays correctly
- [ ] Share link with others → They can open it
- [ ] Fill form with all field types
- [ ] Submit form → Success message
- [ ] Check admin view → Response appears
- [ ] Unpublish form → Link returns 404
- [ ] Different themes render correctly

---

## Deployment Notes

### Environment Variables

**Backend (.env):**
```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
BASE_URL=https://yourdomain.com
CORS_ORIGIN=https://yourdomain.com
```

**Frontend (.env):**
```env
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_BASE_URL=https://yourdomain.com
```

### Production Checklist
- [ ] Set BASE_URL to actual domain
- [ ] Configure MONGO_URI for production DB
- [ ] Update CORS_ORIGIN to frontend domain
- [ ] Enable HTTPS on all endpoints
- [ ] Add rate limiting middleware
- [ ] Set up logging and monitoring
- [ ] Test publish flow end-to-end
- [ ] Test public form access
- [ ] Test response submission

---

## Future Enhancements

1. **Response Export**
   - Export responses as CSV/Excel
   - Generate PDF reports

2. **Form Analytics**
   - Track views and submissions
   - Response statistics
   - Completion rate

3. **Conditional Logic**
   - Show/hide fields based on responses
   - Branching forms

4. **Notifications**
   - Email form creator on submission
   - Send confirmation to respondent

5. **Form Settings**
   - Close form on date/time
   - Limit responses (max submissions)
   - Custom submit message

6. **Webhook Integration**
   - Send responses to external services
   - Slack/Discord notifications

---

**Last Updated:** February 5, 2026
**Status:** Phase 1 Complete (Backend), Phase 2 In Progress (Frontend)

# Frontend API & Implementation Guide

## Overview
This guide documents the frontend implementation for form publishing, sharing, and public form submission features.

---

## API Service: `formApi.js`

Location: `src/utils/formApi.js`

All API calls are centralized in this service module. Use these functions instead of making fetch calls directly.

### Authentication
The service automatically retrieves the JWT token from localStorage using `localStorage.getItem('token')`.

---

## API Functions

### 1. `publishForm(formId)`
**Purpose:** Publish a form and generate a public sharing link

**Parameters:**
- `formId` (string) - MongoDB ObjectId of the form

**Returns:** Promise resolving to:
```javascript
{
  message: "Form published successfully",
  form: {
    _id: "...",
    status: "published",
    publicToken: "a1b2c3d4e5f6",
    publicUrl: "http://localhost:3000/form/a1b2c3d4e5f6",
    publishedAt: "2026-02-05T...",
    responseCount: 0
  }
}
```

**Usage Example:**
```javascript
try {
  const result = await publishForm(formId);
  console.log('Public URL:', result.form.publicUrl);
  // Show success modal with publicUrl
} catch (error) {
  console.error('Publish failed:', error.message);
  // Show error toast
}
```

---

### 2. `unpublishForm(formId)`
**Purpose:** Unpublish a form and revoke the sharing link

**Parameters:**
- `formId` (string) - MongoDB ObjectId of the form

**Returns:** Promise resolving to:
```javascript
{
  message: "Form unpublished successfully",
  form: {
    _id: "...",
    status: "draft",
    title: "..."
  }
}
```

---

### 3. `getPublicForm(publicToken)`
**Purpose:** Fetch a published form by public token (NO AUTH REQUIRED)

**Parameters:**
- `publicToken` (string) - 12-character hex token from URL

**Returns:** Promise resolving to:
```javascript
{
  form: {
    _id: "...",
    title: "Customer Feedback",
    description: "...",
    fields: [...],
    template: "default"
  }
}
```

**Usage Example:**
```javascript
// In PublicFormViewer component
const { publicToken } = useParams();
try {
  const { form } = await getPublicForm(publicToken);
  setFormData(form);
} catch (error) {
  if (error.message.includes('404')) {
    // Show "Form not found" message
  }
}
```

---

### 4. `submitFormResponse(publicToken, responses, submittedBy?)`
**Purpose:** Submit form responses (NO AUTH REQUIRED)

**Parameters:**
- `publicToken` (string) - Public sharing token
- `responses` (array) - Array of response objects
- `submittedBy` (string, optional) - Identifier like email or name (default: 'anonymous')

**Response Array Format:**
```javascript
[
  {
    fieldId: "field_1",
    fieldLabel: "Full Name",
    fieldType: "text",
    value: "John Doe"
  },
  {
    fieldId: "field_2",
    fieldLabel: "Email",
    fieldType: "email",
    value: "john@example.com"
  }
]
```

**Returns:** Promise resolving to:
```javascript
{
  message: "Response submitted successfully",
  response: {
    _id: "...",
    submittedAt: "2026-02-05T..."
  }
}
```

**Usage Example:**
```javascript
const handleSubmit = async () => {
  const responses = fields.map(field => ({
    fieldId: field.id,
    fieldLabel: field.label,
    fieldType: field.type,
    value: formValues[field.id]
  }));

  try {
    await submitFormResponse(publicToken, responses, userEmail);
    showSuccessMessage("Thank you for submitting!");
    // Redirect or reset form
  } catch (error) {
    showErrorMessage(error.message);
  }
};
```

---

### 5. `getFormResponses(formId, options?)`
**Purpose:** Get all responses for a form (ADMIN - requires auth)

**Parameters:**
- `formId` (string) - Form ID
- `options` (object, optional) - { limit: 50, skip: 0 }

**Returns:** Promise resolving to:
```javascript
{
  form: {
    _id: "...",
    title: "...",
    responseCount: 42
  },
  responses: [
    {
      _id: "...",
      formId: "...",
      responses: [...],
      submittedBy: "john@example.com",
      submittedAt: "2026-02-05T..."
    }
  ],
  pagination: {
    total: 42,
    limit: 50,
    skip: 0,
    hasMore: false
  }
}
```

---

### 6. `getFormResponse(formId, responseId)`
**Purpose:** Get a specific form response (ADMIN - requires auth)

**Parameters:**
- `formId` (string) - Form ID
- `responseId` (string) - Response ID

**Returns:** Promise resolving to:
```javascript
{
  response: {
    _id: "...",
    formId: "...",
    responses: [
      {
        fieldId: "field_1",
        fieldLabel: "Full Name",
        fieldType: "text",
        value: "John Doe"
      }
    ],
    submittedBy: "john@example.com",
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0...",
    submittedAt: "2026-02-05T..."
  }
}
```

---

### 7. `copyToClipboard(text)`
**Purpose:** Copy text to user's clipboard

**Parameters:**
- `text` (string) - Text to copy

**Returns:** Promise<boolean>
- `true` if successful
- `false` if failed

**Usage Example:**
```javascript
const handleCopyLink = async () => {
  const success = await copyToClipboard(publicUrl);
  if (success) {
    showMessage("Link copied to clipboard!");
  }
};
```

---

### 8. `generateQRCodeUrl(url, options?)`
**Purpose:** Generate a QR code image URL for sharing

**Parameters:**
- `url` (string) - URL to encode in QR code
- `options` (object, optional) - { size: 300, errorCorrection: 'M' }

**Returns:** string - Image URL for QR code

**Usage Example:**
```javascript
const qrUrl = generateQRCodeUrl(publicUrl, { size: 200 });
// Use in <img src={qrUrl} alt="QR Code" />
```

---

## Components

### PublishModal Component
**Location:** `src/components/FormBuilder/PublishModal.jsx`

**Purpose:** Display published form link with copy and QR code options

**Props:**
```typescript
interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  formId: string;
  onPublishSuccess: (data: PublishResult) => void;
}
```

**Features:**
- ✅ Show public link
- ✅ Copy to clipboard button
- ✅ QR code display
- ✅ Loading states
- ✅ Error handling
- ✅ Responsive design

---

### PublicFormViewer Component
**Location:** `src/components/FormViewer/PublicFormViewer.jsx`

**Purpose:** Display published form for public participants to fill and submit

**Features:**
- ✅ Fetch form by public token
- ✅ Render form fields (reuse FormField component)
- ✅ Form validation
- ✅ Submit button
- ✅ Success message
- ✅ Error handling
- ✅ Theme application
- ✅ Responsive design

**Route:** `/form/:publicToken`

---

## Usage Examples

### Example 1: Implementing Publish Button in FormBuilder

```javascript
import { publishForm } from '../../utils/formApi';

export default function FormBuilder() {
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishData, setPublishData] = useState(null);

  const handlePublish = async () => {
    try {
      const result = await publishForm(form._id);
      setPublishData(result.form);
      setShowPublishModal(true);
      // Show success toast
      showToast('Form published successfully!', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  return (
    <>
      <button onClick={handlePublish} className="btn btn-primary">
        Publish
      </button>
      
      {showPublishModal && (
        <PublishModal
          isOpen={true}
          onClose={() => setShowPublishModal(false)}
          formData={publishData}
        />
      )}
    </>
  );
}
```

### Example 2: Using PublicFormViewer

```javascript
// In App.jsx or main router
import PublicFormViewer from './components/FormViewer/PublicFormViewer';

// Add route:
<Route path="/form/:publicToken" element={<PublicFormViewer />} />
```

```javascript
// PublicFormViewer.jsx
import { useParams } from 'react-router-dom';
import { getPublicForm, submitFormResponse } from '../../utils/formApi';

export default function PublicFormViewer() {
  const { publicToken } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadForm = async () => {
      try {
        const { form: formData } = await getPublicForm(publicToken);
        setForm(formData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [publicToken]);

  const handleSubmit = async (responses) => {
    try {
      await submitFormResponse(publicToken, responses);
      showSuccessMessage("Thank you!");
      // Reset or redirect
    } catch (error) {
      showErrorMessage(error.message);
    }
  };

  if (loading) return <LoadingScreen />;
  if (error) return <div>Error: {error}</div>;
  if (!form) return <div>Form not found</div>;

  return (
    <div className={`form-template-${form.template}`}>
      <FormContent form={form} onSubmit={handleSubmit} />
    </div>
  );
}
```

---

## Error Handling

All API functions throw errors with descriptive messages. Always wrap calls in try-catch:

```javascript
try {
  const result = await publishForm(formId);
  // Handle success
} catch (error) {
  console.error('Error:', error.message);
  // Show user-friendly error message
  
  if (error.message.includes('404')) {
    // Handle not found
  } else if (error.message.includes('401')) {
    // Handle unauthorized
  } else {
    // Handle other errors
  }
}
```

---

## Environment Variables

Create `.env` file in react-project-structura root:

```env
REACT_APP_API_URL=http://localhost:4000/api
REACT_APP_BASE_URL=http://localhost:3000
```

For production:

```env
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_BASE_URL=https://yourdomain.com
```

---

## Toast/Notification Component

Recommended: Use a toast library like `react-toastify` for user feedback

```bash
npm install react-toastify
```

```javascript
import { toast } from 'react-toastify';

// Success
toast.success('Form published!');

// Error
toast.error('Failed to publish form');

// Info
toast.info('Copying to clipboard...');
```

---

## Testing Checklist

- [ ] Publish form → generate token & link
- [ ] Copy link to clipboard works
- [ ] QR code generates correctly
- [ ] Unpublish form → link becomes invalid
- [ ] Open public link → form loads
- [ ] Fill and submit form → response saved
- [ ] Admin can view responses
- [ ] Different themes display correctly on public form
- [ ] Invalid token shows error message
- [ ] Network errors handled gracefully

---

**Last Updated:** February 5, 2026
**Version:** 1.0

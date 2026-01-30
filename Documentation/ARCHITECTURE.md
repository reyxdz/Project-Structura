# Form Builde Architecture

## Overview

This document describes the architecture of the Project Structura Form Builder application. It covers the tech stack, project structure, state management, data flow, and component hierarchy.

---

## Tech Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Frontend Framework** | React | 19.2.0 | UI component library |
| **Build Tool** | Vite | 7.2.4 | Development server and build tool |
| **State Management** | Zustand | 5.0.10 | Global state management |
| **Form Handling** | React Hook Form | 7.71.1 | Form validation and submission |
| **Drag & Drop** | @dnd-kit/core | 6.3.1 | Drag and drop functionality |
| | @dnd-kit/sortable | 10.0.0 | Sortable list implementation |
| | @dnd-kit/utilities | 3.2.2 | DnD helper utilities |
| **Utilities** | UUID | 13.0.0 | Generate unique field IDs |
| **Linting** | ESLint | 9.39.1 | Code quality |

---

## Project Structure

```
Project-Structura/
├── Development-Phases/          # Project planning documents
│   ├── General_Phases.md
│   ├── Phase 1/
│   ├── Phase 2/
│   └── Phase 3/
├── react-project-structura/     # Main React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Common/
│   │   │   │   ├── ConfirmModal.jsx
│   │   │   │   ├── ConfirmModal.css
│   │   │   │   └── index.js
│   │   │   ├── FormBuilder/
│   │   │   │   ├── Canvas.jsx          # Drag-drop editing area
│   │   │   │   ├── Canvas.css
│   │   │   │   ├── FieldPalette.jsx    # Available fields sidebar
│   │   │   │   ├── FieldPalette.css
│   │   │   │   ├── FieldConfigurator.jsx # Field properties editor
│   │   │   │   ├── FieldConfigurator.css
│   │   │   │   ├── FormBuilder.jsx     # Main container
│   │   │   │   ├── FormBuilder.css
│   │   │   │   ├── DraggableFieldItem.jsx
│   │   │   │   ├── SortableFieldItem.jsx
│   │   │   │   ├── DropZone.jsx
│   │   │   │   ├── ConditionalRuleBuilder.jsx
│   │   │   │   ├── DependencyGraph.jsx
│   │   │   │   └── ValidationRulesList.jsx
│   │   │   └── FormPreview/
│   │   │       ├── FormPreview.jsx     # Live preview mode
│   │   │       ├── FormPreview.css
│   │   │       ├── FormField.jsx       # Individual field renderer
│   │   │       └── FormField.css
│   │   ├── stores/
│   │   │   └── formStore.js            # Zustand store
│   │   ├── types/
│   │   │   └── formTypes.js            # TypeScript interfaces
│   │   ├── utils/
│   │   │   ├── fieldHelpers.js         # Field manipulation helpers
│   │   │   ├── validationRules.js      # Validation rule builders
│   │   │   ├── conditionalRules.js     # Conditional logic evaluation
│   │   │   └── dndHelpers.js           # Drag-and-drop helpers
│   │   ├── icons/                      # Field type icons
│   │   ├── images/                     # Logos and images
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── Firebase/                       # Firebase configuration (future backend)
│   ├── src/
│   │   ├── components/
│   │   ├── stores/
│   │   └── firebaseConfig.js
│   └── package.json
├── DEPLOYMENT_GUIDE.md
├── DEPLOYMENT_TODO.md
└── README.md
```

---

## State Management (Zustand Store)

The application uses Zustand for centralized state management via `formStore.js`.

### State Structure

```javascript
{
    form: {
        id: string,              // Unique form identifier (UUID)
        name: string,            // Form name
        description: string,     // Form description
        fields: Array<Field>,    // Array of field objects
        metadata: {
            createdAt: string,   // ISO date string
            updatedAt: string    // ISO date string
        },
        versions: Array          // Version history (future)
    },
    selectedFieldId: string | null,  // Currently selected field for editing
    history: Array<Form>,            // Undo/redo history
    historyIndex: number,             // Current position in history
    previewData: object               // Form submission data during preview
}
```

### Available Actions

| Action | Purpose |
|--------|---------|
| `setFormName(name)` | Update form name |
| `setFormDescription(description)` | Update form description |
| `addField(type, position)` | Add new field to form |
| `updateField(fieldId, updates)` | Update field properties |
| `removeField(fieldId)` | Remove field from form |
| `reorderField(fromIndex, toIndex)` | Reorder fields |
| `selectField(fieldId)` | Select a field for editing |
| `deselectField()` | Deselect current field |
| `addConditional(fieldId, conditionalLogic)` | Add conditional rule |
| `updateConditional(fieldId, index, rule, ruleIndex)` | Update conditional rule |
| `removeConditionalRule(fieldId, index, ruleIndex)` | Remove conditional rule |
| `undo()` | Undo last action |
| `redo()` | Redo last action |
| `setPreviewData(data)` | Set preview form data |
| `clearPreviewData()` | Clear preview data |
| `resetForm()` | Reset form to initial state |
| `loadForm(formData)` | Load form from saved data |
| `exportForm()` | Export form as JSON |

---

## Data Flow

### Edit Mode Flow

```
User drags field from FieldPalette
            ↓
Canvas detects drop event
            ↓
addField(type, position) called in formStore
            ↓
form.fields updated in Zustand store
            ↓
Canvas re-renders with new field
            ↓
User clicks on field to select
            ↓
selectedFieldId set in formStore
            ↓
FieldConfigurator displays field properties
            ↓
User edits field properties
            ↓
updateField(fieldId, updates) called
            ↓
form.fields updated in store
            ↓
History recorded for undo/redo
```

### Preview Mode Flow

```
User clicks "Preview" button
            ↓
showPreview state toggles to true
            ↓
FormPreview component mounts
            ↓
useForm() hook initializes React Hook Form
            ↓
FormPreview reads form.fields from formStore
            ↓
Each field rendered as FormField component
            ↓
FormField wraps input with Controller from react-hook-form
            ↓
Conditional rules evaluated via shouldFieldBeVisible()
            ↓
Validation rules applied via buildValidationRules()
            ↓
User fills form and submits
            ↓
handleSubmit() captures data
            ↓
previewData updated in formStore
            ↓
Form submission complete
```

---

## Component Hierarchy

```
App.jsx
└── FormBuilder.jsx (Main Container)
    ├── Header
    │   └── Preview Toggle Button
    │
    ├── Body
    │
    ├── Conditional: {!showPreview}
    │   ├── Left Sidebar: FieldPalette.jsx
    │   │   └── Draggable field items from FIELD_TYPES
    │   │
    │   └── Main Content: Canvas.jsx
    │       ├── DndContext
    │       ├── SortableContext
    │       │   └── SortableFieldItem (mapped from form.fields)
    │       │       └── DraggableFieldItem (drag overlay)
    │       └── DropZone
    │
    ├── Conditional: {showPreview}
    │   └── FormPreview.jsx
    │       ├── Device Selector (Mobile/Tablet/Desktop)
    │       ├── useForm() hook
    │       └── Form Fields (mapped)
    │           └── FormField.jsx
    │               └── Controller (react-hook-form)
    │                   └── Input based on field.type
    │
    └── Conditional: {!showPreview}
        ├── Right Sidebar: FieldConfigurator.jsx (if field selected)
        │   ├── Field Properties (label, placeholder, required)
        │   ├── Validation Rules
        │   └── Conditional Rules
        └── Right Sidebar: "Select a field to configure" (if no selection)
```

---

## Mode Switching

The application has two main modes controlled by `showPreview` state in `FormBuilder.jsx`:

### Edit Mode (showPreview = false)

- **Components Active**: Canvas, FieldPalette, FieldConfigurator
- **Features**: Drag-and-drop field placement, field reordering, property editing
- **State Source**: formStore.form.fields
- **UI**: Left sidebar (fields palette), center (canvas), right sidebar (configurator)

### Preview Mode (showPreview = true)

- **Components Active**: FormPreview
- **Features**: Live form testing, device preview, form submission
- **State Source**: React Hook Form + formStore.form.fields
- **UI**: Center (form preview), device toggle buttons

```javascript
// Mode switching in FormBuilder.jsx
const [showPreview, setShowPreview] = useState(false);

return (
    <main className="form-builder-main">
        {showPreview ? (
            <FormPreview />
        ) : (
            <Canvas />
        )}
    </main>
);
```

---

## Form Schema (MongoDB Ready)

The form structure is designed for MongoDB storage:

```json
{
    "_id": "ObjectId",
    "name": "Contact Form",
    "description": "Customer feedback form",
    "fields": [
        {
            "id": "field-uuid-1",
            "type": "TEXT",
            "label": "Full Name",
            "placeholder": "Enter your name",
            "required": true,
            "helpText": "Please enter your full name",
            "value": "",
            "order": 0,
            "validation": [
                {
                    "type": "MIN_LENGTH",
                    "value": "2",
                    "message": "Name must be at least 2 characters"
                }
            ],
            "conditionals": null,
            "metadata": {}
        }
    ],
    "metadata": {
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
    }
}
```

---

## Supported Field Types

| Type | Component | Purpose |
|------|-----------|---------|
| SHORT_TEXT | Input | Single line text |
| LONG_TEXT | Textarea | Multi-line text |
| NUMBER | Input (type="number") | Numeric input |
| EMAIL | Input (type="email") | Email with validation |
| PHONE | Input (type="tel") | Phone number |
| DATE | Date picker | Date selection |
| TIME | Input (type="time") | Time selection |
| CHECKBOX | Checkbox input | Boolean selection |
| RADIO | Radio buttons | Single choice from options |
| SINGLE_CHOICE | Radio buttons | Single choice |
| MULTIPLE_CHOICE | Checkbox group | Multiple choices |
| DROPDOWN | Select | Dropdown single choice |
| SELECT | Select | Native select |
| FILE | Input (type="file") | File upload |
| SIGNATURE | Custom component | Signature capture |
| FULL_NAME | Custom component | First + last name inputs |
| ADDRESS | Custom component | Street, city, state, zip |
| APPOINTMENT | Custom component | Date + time slot picker |
| HEADING | Heading element | Section header |
| PARAGRAPH | Paragraph element | Descriptive text |
| DIVIDER | HR element | Visual separator |
| PAGE_BREAK | Custom component | Multi-page form break |
| CAPTCHA | Custom component | Bot prevention |

---

## Conditional Logic System

The application supports conditional field visibility:

```javascript
// Conditional structure
{
    "conditionals": [
        {
            "logicType": "AND", // or "OR"
            "rules": [
                {
                    "id": "rule-1",
                    "triggerFieldId": "field-id-to-watch",
                    "operator": "EQUALS", // EQUALS, NOT_EQUALS, CONTAINS, etc.
                    "value": "expected-value",
                    "action": "SHOW" // SHOW, HIDE, ENABLE, DISABLE
                }
            ]
        }
    ]
}
```

### Supported Operators

- `EQUALS` - Exact match
- `NOT_EQUALS` - Not equal
- `CONTAINS` - Contains substring
- `NOT_CONTAINS` - Does not contain
- `STARTS_WITH` - Starts with
- `ENDS_WITH` - Ends with
- `GREATER_THAN` - Numeric comparison
- `LESS_THAN` - Numeric comparison
- `GREATER_EQUAL` - Numeric comparison
- `LESS_EQUAL` - Numeric comparison
- `IS_EMPTY` - Empty value
- `IS_NOT_EMPTY` - Non-empty value
- `MATCHES_REGEX` - Regex pattern match

---

## Validation System

Fields can have multiple validation rules:

```javascript
// Validation rules
{
    "validation": [
        {
            "type": "REQUIRED",
            "value": true,
            "message": "Field is required"
        },
        {
            "type": "MIN_LENGTH",
            "value": "5",
            "message": "Minimum 5 characters"
        },
        {
            "type": "MAX_LENGTH",
            "value": "100",
            "message": "Maximum 100 characters"
        },
        {
            "type": "PATTERN",
            "value": "^[a-zA-Z]+$",
            "message": "Only letters allowed"
        }
    ]
}
```

### Validation Types

- `REQUIRED` - Field must have value
- `MIN_LENGTH` - Minimum character count
- `MAX_LENGTH` - Maximum character count
- `PATTERN` - Regex pattern match
- `EMAIL` - Email format validation
- `PHONE` - Phone number format
- `URL` - URL format validation

---

## Future Backend Integration

For MERN stack migration:

```
React Frontend ←→ Express API ←→ MongoDB

API Endpoints (planned):
POST   /api/forms              // Create new form
GET    /api/forms              // Get all forms
GET    /api/forms/:id          // Get single form
PUT    /api/forms/:id          // Update form
DELETE /api/forms/:id          // Delete form
POST   /api/forms/:id/submit   // Submit form data
GET    /api/forms/:id/responses // Get form responses
```

---

## Key Architectural Decisions

1. **Zustand over Redux**: Simpler API, less boilerplate, excellent TypeScript support
2. **React Hook Form**: Performance-focused form handling with easy validation
3. **@dnd-kit**: Modern, accessible drag-and-drop library
4. **Client-side preview**: Real-time preview without backend calls
5. **JSON-native design**: Form structure designed for MongoDB storage
6. **Component-based architecture**: Separation of edit mode and preview mode components

---

## Performance Considerations

- Zustand uses selectors to prevent unnecessary re-renders
- React Hook Form minimizes re-renders during input
- Conditional logic evaluation is optimized
- History management limits stored versions

---

## Accessibility (a11y)

- Form inputs have proper labels
- Keyboard navigation supported for drag-and-drop
- ARIA attributes on custom components
- Focus management between modes

---

## Last Updated

Document generated for Project Structura - Phase 3 implementation.


# Phase 1: Foundation & Core Architecture - Detailed Step-by-Step Guide

## Overview
Phase 1 focuses on setting up the project structure, installing dependencies, and creating the core data models and components. This is the foundation for all future phases.

**Estimated Time:** 3-5 days
**Prerequisites:** Node.js installed, Vite + React project ready

---

## ✅Step 1: Install Required Dependencies

### ✅1.1 Navigate to project directory
```bash
cd c:\Rameses\Project-Structura\react-project-structura
```

### ✅1.2 Install dependencies one by one
Run each command separately to ensure successful installation:

```bash
npm install react-hook-form
```
- **Purpose:** Handle form state, validation, and submission efficiently
- **Why:** More performant than useState for complex forms

```bash
npm install @dnd-kit/core @dnd-kit/utilities @dnd-kit/sortable
```
- **Purpose:** Drag-and-drop functionality
- **Why:** Modern, accessible, framework-agnostic drag-drop library

```bash
npm install zustand
```
- **Purpose:** Lightweight state management
- **Why:** Simpler than Redux, perfect for this use case

```bash
npm install uuid
```
- **Purpose:** Generate unique IDs for form fields
- **Why:** Essential for tracking fields uniquely

```bash
npm install @dnd-kit/pointers
```
- **Purpose:** Pointer event handling for drag-drop
- **Why:** Better touch device support

### ✅1.3 Verify installations
```bash
npm list react-hook-form @dnd-kit/core zustand uuid
```
Should show all packages installed successfully.

---

## ✅Step 2: Create Project Folder Structure

### ✅2.1 Create main directories
Create these folders inside `src/`:

```
src/
├── components/
│   ├── FormBuilder/ 
│   ├── FormPreview/
│   └── common/
├── stores/
├── types/
├── utils/
├── pages/
└── hooks/
```
What each folder will contain?
  1. components/FormBuilder - The main form builder component with drag-and-drop functionality,   
                              field management, and form configuration UI
  2. components/FormPreview - Displays and renders the form based on the current configuration
  3. components/common - Shared UI components (buttons, inputs, modals, dialogs, cards, etc.)
  4. stores - Zustand store files for global state management (e.g., formStore.js for form data, 
              uiStore.js for UI state like modals/panels)
  5. types - TypeScript/JSDoc type definitions (e.g., form.types.js, field.types.js, component
             types.js)
           - Interfaces and constants for data structures
  6. utils - Helper functions (validation, form serialization, field generation, ID generation,   
             etc.)
           - Constants and configuration files
           - Formatting and transformation utilities
  7. pages - Page-level components (main App layout, dashboard, form editor page if using routing)
           - Higher-level container components
  8. hooks - Custom React hooks (e.g., useFormBuilder, useFormValidation, useFieldDragDrop, 
             useFormPersistence)
           - Reusable logic and state management hooks

### ✅2.2 Command to create all folders at once (PowerShell)
```powershell
$folders = @(
    "src\components\FormBuilder",
    "src\components\FormPreview",
    "src\components\common",
    "src\stores",
    "src\types",
    "src\utils",
    "src\pages",
    "src\hooks"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Path $folder -Force | Out-Null
}
```

### ✅2.3 Verify structure
```bash
tree src /A
```
or
```powershell
Get-ChildItem -Path src -Recurse | Where-Object {$_.PSIsContainer} | Format-Table FullName
```

---

## ✅Step 3: Create Type Definitions

### ✅3.1 Create `src/types/formTypes.js`

This file defines all TypeScript-like types (using JSDoc for documentation).

**Content:**
```javascript
/**
 * @typedef {Object} FieldType
 * @property {string} id - Unique field identifier
 * @property {string} type - Field type (text, email, checkbox, etc.)
 * @property {string} label - Field label displayed to user
 * @property {string} [placeholder] - Placeholder text
 * @property {boolean} required - Whether field is required
 * @property {string} [value] - Default value
 * @property {number} [order] - Order of field in form
 * @property {Array} [options] - Options for select/radio/checkbox fields
 * @property {Object} [validation] - Validation rules
 * @property {Object} [conditional] - Conditional visibility logic
 * @property {string} [helpText] - Help text shown below field
 * @property {Object} [metadata] - Additional field metadata
 */

/**
 * @typedef {Object} ValidationRule
 * @property {string} type - Validation type (required, minLength, maxLength, pattern, email, etc.)
 * @property {*} value - Validation value (e.g., min length amount)
 * @property {string} [message] - Custom error message
 */

/**
 * @typedef {Object} ConditionalRule
 * @property {string} fieldId - ID of field this rule depends on
 * @property {string} operator - Comparison operator (equals, contains, greaterThan, etc.)
 * @property {*} value - Value to compare against
 * @property {string} action - Action (show, hide, enable, disable)
 */

/**
 * @typedef {Object} FormSchema
 * @property {string} id - Unique form identifier
 * @property {string} name - Form name
 * @property {string} [description] - Form description
 * @property {Array<FieldType>} fields - Array of form fields
 * @property {Object} [metadata] - Form metadata (created date, version, etc.)
 * @property {Array} [versions] - Previous versions of the form
 */

/**
 * @typedef {Object} FormBuilderState
 * @property {FormSchema} form - Current form schema
 * @property {string} [selectedFieldId] - Currently selected field ID
 * @property {Array} history - Undo/redo history
 * @property {number} historyIndex - Current position in history
 * @property {Object} [previewData] - Data entered in preview mode
 */

// Export field type constants
export const FIELD_TYPES = {
  TEXT: 'text',
  EMAIL: 'email',
  NUMBER: 'number',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  SELECT: 'select',
  TEXTAREA: 'textarea',
  DATE: 'date',
  FILE: 'file',
  PHONE: 'phone',
  URL: 'url',
  PASSWORD: 'password',
};

// Export validation types
export const VALIDATION_TYPES = {
  REQUIRED: 'required',
  MIN_LENGTH: 'minLength',
  MAX_LENGTH: 'maxLength',
  PATTERN: 'pattern',
  EMAIL: 'email',
  PHONE: 'phone',
  URL: 'url',
  CUSTOM: 'custom',
};

// Export operators for conditionals
export const OPERATORS = {
  EQUALS: 'equals',
  NOT_EQUALS: 'notEquals',
  CONTAINS: 'contains',
  GREATER_THAN: 'greaterThan',
  LESS_THAN: 'lessThan',
  IS_EMPTY: 'isEmpty',
  IS_NOT_EMPTY: 'isNotEmpty',
};

// Export actions for conditionals
export const ACTIONS = {
  SHOW: 'show',
  HIDE: 'hide',
  ENABLE: 'enable',
  DISABLE: 'disable',
  SET_VALUE: 'setValue',
};
```

### ✅3.2 Verify the file
- Create the file at `src/types/formTypes.js`
- Check file exists: `Test-Path "src\types\formTypes.js"`

---

## ✅Step 4: Create Utility Functions

### ✅4.1 Create `src/utils/fieldHelpers.js`

Helper functions for field operations.

**Content:**
```javascript
import { v4 as uuidv4 } from 'uuid';
import { FIELD_TYPES, VALIDATION_TYPES } from '../types/formTypes';

/**
 * Create a new field with default values
 * @param {string} type - Field type
 * @param {number} order - Field order in form
 * @returns {Object} New field object
 */
export const createNewField = (type = FIELD_TYPES.TEXT, order = 0) => {
  return {
    id: uuidv4(),
    type,
    label: `Field ${order + 1}`,
    placeholder: '',
    required: false,
    value: '',
    order,
    options: type === FIELD_TYPES.SELECT || 
             type === FIELD_TYPES.RADIO || 
             type === FIELD_TYPES.CHECKBOX ? [] : null,
    validation: [],
    conditional: null,
    helpText: '',
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
};

/**
 * Get default validation rules for field type
 * @param {string} type - Field type
 * @returns {Array} Default validation rules
 */
export const getDefaultValidations = (type) => {
  const validations = [];

  switch (type) {
    case FIELD_TYPES.EMAIL:
      validations.push({
        type: VALIDATION_TYPES.EMAIL,
        message: 'Please enter a valid email address',
      });
      break;
    case FIELD_TYPES.PHONE:
      validations.push({
        type: VALIDATION_TYPES.PHONE,
        value: '^[0-9\\-\\+\\(\\)\\s]+$',
        message: 'Please enter a valid phone number',
      });
      break;
    case FIELD_TYPES.URL:
      validations.push({
        type: VALIDATION_TYPES.URL,
        message: 'Please enter a valid URL',
      });
      break;
    case FIELD_TYPES.NUMBER:
      validations.push({
        type: VALIDATION_TYPES.PATTERN,
        value: '^[0-9]+$',
        message: 'Please enter a valid number',
      });
      break;
    default:
      break;
  }

  return validations;
};

/**
 * Get label for field type
 * @param {string} type - Field type
 * @returns {string} Display label
 */
export const getFieldTypeLabel = (type) => {
  const labels = {
    [FIELD_TYPES.TEXT]: 'Text Input',
    [FIELD_TYPES.EMAIL]: 'Email',
    [FIELD_TYPES.NUMBER]: 'Number',
    [FIELD_TYPES.CHECKBOX]: 'Checkbox',
    [FIELD_TYPES.RADIO]: 'Radio Button',
    [FIELD_TYPES.SELECT]: 'Select Dropdown',
    [FIELD_TYPES.TEXTAREA]: 'Text Area',
    [FIELD_TYPES.DATE]: 'Date Picker',
    [FIELD_TYPES.FILE]: 'File Upload',
    [FIELD_TYPES.PHONE]: 'Phone Number',
    [FIELD_TYPES.URL]: 'Website URL',
    [FIELD_TYPES.PASSWORD]: 'Password',
  };
  return labels[type] || 'Unknown Field';
};

/**
 * Check if field type accepts options (select, radio, checkbox)
 * @param {string} type - Field type
 * @returns {boolean}
 */
export const fieldTypeAcceptsOptions = (type) => {
  return [
    FIELD_TYPES.SELECT,
    FIELD_TYPES.RADIO,
    FIELD_TYPES.CHECKBOX,
  ].includes(type);
};

/**
 * Validate field configuration
 * @param {Object} field - Field object to validate
 * @returns {Object} { valid: boolean, errors: Array<string> }
 */
export const validateFieldConfig = (field) => {
  const errors = [];

  if (!field.label || field.label.trim() === '') {
    errors.push('Field label is required');
  }

  if (!field.type) {
    errors.push('Field type is required');
  }

  if (fieldTypeAcceptsOptions(field.type)) {
    if (!field.options || field.options.length === 0) {
      errors.push('Field must have at least one option');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Clone a field (create copy with new ID)
 * @param {Object} field - Field to clone
 * @returns {Object} Cloned field
 */
export const cloneField = (field) => {
  return {
    ...field,
    id: uuidv4(),
    metadata: {
      ...field.metadata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
};

/**
 * Update field in array
 * @param {Array} fields - Array of fields
 * @param {string} fieldId - ID of field to update
 * @param {Object} updates - Updates to apply
 * @returns {Array} Updated fields array
 */
export const updateFieldInArray = (fields, fieldId, updates) => {
  return fields.map((field) =>
    field.id === fieldId
      ? {
          ...field,
          ...updates,
          metadata: {
            ...field.metadata,
            updatedAt: new Date().toISOString(),
          },
        }
      : field
  );
};

/**
 * Remove field from array
 * @param {Array} fields - Array of fields
 * @param {string} fieldId - ID of field to remove
 * @returns {Array} Updated fields array
 */
export const removeFieldFromArray = (fields, fieldId) => {
  return fields
    .filter((field) => field.id !== fieldId)
    .map((field, index) => ({
      ...field,
      order: index,
    }));
};

/**
 * Reorder fields after drag
 * @param {Array} fields - Array of fields
 * @param {number} fromIndex - From position
 * @param {number} toIndex - To position
 * @returns {Array} Reordered fields
 */
export const reorderFields = (fields, fromIndex, toIndex) => {
  const newFields = [...fields];
  const [removed] = newFields.splice(fromIndex, 1);
  newFields.splice(toIndex, 0, removed);

  return newFields.map((field, index) => ({
    ...field,
    order: index,
  }));
};
```

---

## ✅Step 5: Create Zustand Store

### ✅5.1 Create `src/stores/formStore.js`

Central state management for the form builder.

**Content:**
```javascript
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { createNewField, reorderFields, updateFieldInArray, removeFieldFromArray } from '../utils/fieldHelpers';

const initialFormState = {
  id: uuidv4(),
  name: 'Untitled Form',
  description: '',
  fields: [],
  metadata: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  versions: [],
};

export const useFormStore = create((set, get) => ({
  // State
  form: initialFormState,
  selectedFieldId: null,
  history: [initialFormState],
  historyIndex: 0,
  previewData: {},

  // Form actions
  setFormName: (name) =>
    set((state) => ({
      form: {
        ...state.form,
        name,
        metadata: {
          ...state.form.metadata,
          updatedAt: new Date().toISOString(),
        },
      },
    })),

  setFormDescription: (description) =>
    set((state) => ({
      form: {
        ...state.form,
        description,
        metadata: {
          ...state.form.metadata,
          updatedAt: new Date().toISOString(),
        },
      },
    })),

  // Field actions
  addField: (type, position) => {
    set((state) => {
      const newField = createNewField(type, position ?? state.form.fields.length);
      const updatedFields = [...state.form.fields];
      updatedFields.splice(position ?? updatedFields.length, 0, newField);

      const updatedForm = {
        ...state.form,
        fields: updatedFields.map((f, i) => ({ ...f, order: i })),
        metadata: {
          ...state.form.metadata,
          updatedAt: new Date().toISOString(),
        },
      };

      return {
        form: updatedForm,
        history: [...state.history.slice(0, state.historyIndex + 1), updatedForm],
        historyIndex: state.historyIndex + 1,
      };
    });
  },

  updateField: (fieldId, updates) => {
    set((state) => {
      const updatedFields = updateFieldInArray(state.form.fields, fieldId, updates);
      const updatedForm = {
        ...state.form,
        fields: updatedFields,
        metadata: {
          ...state.form.metadata,
          updatedAt: new Date().toISOString(),
        },
      };

      return {
        form: updatedForm,
        history: [...state.history.slice(0, state.historyIndex + 1), updatedForm],
        historyIndex: state.historyIndex + 1,
      };
    });
  },

  removeField: (fieldId) => {
    set((state) => {
      const updatedFields = removeFieldFromArray(state.form.fields, fieldId);
      const updatedForm = {
        ...state.form,
        fields: updatedFields,
        metadata: {
          ...state.form.metadata,
          updatedAt: new Date().toISOString(),
        },
      };

      return {
        form: updatedForm,
        selectedFieldId: state.selectedFieldId === fieldId ? null : state.selectedFieldId,
        history: [...state.history.slice(0, state.historyIndex + 1), updatedForm],
        historyIndex: state.historyIndex + 1,
      };
    });
  },

  reorderField: (fromIndex, toIndex) => {
    set((state) => {
      const updatedFields = reorderFields(state.form.fields, fromIndex, toIndex);
      const updatedForm = {
        ...state.form,
        fields: updatedFields,
        metadata: {
          ...state.form.metadata,
          updatedAt: new Date().toISOString(),
        },
      };

      return {
        form: updatedForm,
        history: [...state.history.slice(0, state.historyIndex + 1), updatedForm],
        historyIndex: state.historyIndex + 1,
      };
    });
  },

  duplicateField: (fieldId) => {
    set((state) => {
      const fieldToDuplicate = state.form.fields.find((f) => f.id === fieldId);
      if (!fieldToDuplicate) return state;

      const clonedField = {
        ...fieldToDuplicate,
        id: uuidv4(),
      };

      const fieldIndex = state.form.fields.findIndex((f) => f.id === fieldId);
      const updatedFields = [...state.form.fields];
      updatedFields.splice(fieldIndex + 1, 0, clonedField);

      const reorderedFields = updatedFields.map((f, i) => ({ ...f, order: i }));
      const updatedForm = {
        ...state.form,
        fields: reorderedFields,
        metadata: {
          ...state.form.metadata,
          updatedAt: new Date().toISOString(),
        },
      };

      return {
        form: updatedForm,
        history: [...state.history.slice(0, state.historyIndex + 1), updatedForm],
        historyIndex: state.historyIndex + 1,
      };
    });
  },

  // Selection
  selectField: (fieldId) => set({ selectedFieldId: fieldId }),
  deselectField: () => set({ selectedFieldId: null }),

  // History
  undo: () => {
    set((state) => {
      if (state.historyIndex > 0) {
        return { historyIndex: state.historyIndex - 1, form: state.history[state.historyIndex - 1] };
      }
      return state;
    });
  },

  redo: () => {
    set((state) => {
      if (state.historyIndex < state.history.length - 1) {
        return { historyIndex: state.historyIndex + 1, form: state.history[state.historyIndex + 1] };
      }
      return state;
    });
  },

  // Preview
  setPreviewData: (data) => set({ previewData: data }),
  clearPreviewData: () => set({ previewData: {} }),

  // Form reset
  resetForm: () => {
    const newFormState = {
      ...initialFormState,
      id: uuidv4(),
    };
    set({
      form: newFormState,
      selectedFieldId: null,
      history: [newFormState],
      historyIndex: 0,
      previewData: {},
    });
  },

  // Export/Import
  loadForm: (formData) => {
    set({
      form: formData,
      selectedFieldId: null,
      history: [formData],
      historyIndex: 0,
      previewData: {},
    });
  },

  exportForm: () => get().form,
}));
```

---

## ✅Step 6: Create Basic Components

### ✅6.1 Create `src/components/FormBuilder/FormBuilder.jsx`

Main container component.

**Content:**
```javascript
import React, { useState } from 'react';
import { useFormStore } from '../../stores/formStore';
import Canvas from './Canvas';
import FieldPalette from './FieldPalette';
import FieldConfigurator from './FieldConfigurator';
import './FormBuilder.css';

export default function FormBuilder() {
  const { form, selectedFieldId } = useFormStore();
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="form-builder">
      <header className="form-builder-header">
        <h1>{form.name}</h1>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </header>

      <div className="form-builder-body">
        <aside className="form-builder-sidebar left-sidebar">
          <FieldPalette />
        </aside>

        <main className="form-builder-main">
          {showPreview ? (
            <div className="preview-message">
              <p>Preview mode - showing form as users will see it</p>
            </div>
          ) : null}
          <Canvas />
        </main>

        <aside className="form-builder-sidebar right-sidebar">
          {selectedFieldId ? (
            <FieldConfigurator />
          ) : (
            <div className="no-field-selected">
              <p>Select a field to configure it</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
```

### ✅6.2 Create `src/components/FormBuilder/Canvas.jsx`

Drag-and-drop canvas for fields.

**Content:**
```javascript
import React from 'react';
import { useFormStore } from '../../stores/formStore';
import './Canvas.css';

export default function Canvas() {
  const { form, selectedFieldId, selectField } = useFormStore();

  return (
    <div className="canvas">
      <div className="canvas-content">
        {form.fields.length === 0 ? (
          <div className="canvas-empty-state">
            <p>Drag fields here to build your form</p>
          </div>
        ) : (
          <div className="fields-list">
            {form.fields.map((field) => (
              <div
                key={field.id}
                className={`field-item ${selectedFieldId === field.id ? 'selected' : ''}`}
                onClick={() => selectField(field.id)}
              >
                <div className="field-item-header">
                  <span className="field-label">{field.label}</span>
                  <span className="field-type">{field.type}</span>
                </div>
                {field.required && <span className="field-required">Required</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

### ✅6.3 Create `src/components/FormBuilder/FieldPalette.jsx`

Available fields to drag onto canvas.

**Content:**
```javascript
import React from 'react';
import { FIELD_TYPES } from '../../types/formTypes';
import { getFieldTypeLabel } from '../../utils/fieldHelpers';
import { useFormStore } from '../../stores/formStore';
import './FieldPalette.css';

const fieldGroups = [
  {
    name: 'Basic Fields',
    fields: [FIELD_TYPES.TEXT, FIELD_TYPES.EMAIL, FIELD_TYPES.NUMBER],
  },
  {
    name: 'Choice Fields',
    fields: [FIELD_TYPES.CHECKBOX, FIELD_TYPES.RADIO, FIELD_TYPES.SELECT],
  },
  {
    name: 'Advanced Fields',
    fields: [FIELD_TYPES.TEXTAREA, FIELD_TYPES.DATE, FIELD_TYPES.FILE, FIELD_TYPES.PHONE, FIELD_TYPES.URL],
  },
];

export default function FieldPalette() {
  const addField = useFormStore((state) => state.addField);

  const handleAddField = (fieldType) => {
    addField(fieldType);
  };

  return (
    <div className="field-palette">
      <h3>Add Fields</h3>
      {fieldGroups.map((group) => (
        <div key={group.name} className="field-group">
          <h4>{group.name}</h4>
          <div className="field-buttons">
            {group.fields.map((fieldType) => (
              <button
                key={fieldType}
                className="field-button"
                onClick={() => handleAddField(fieldType)}
                title={`Add ${getFieldTypeLabel(fieldType)}`}
              >
                + {getFieldTypeLabel(fieldType)}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### ✅6.4 Create `src/components/FormBuilder/FieldConfigurator.jsx`

Configure selected field properties.

**Content:**
```javascript
import React from 'react';
import { useFormStore } from '../../stores/formStore';
import { FIELD_TYPES } from '../../types/formTypes';
import './FieldConfigurator.css';

export default function FieldConfigurator() {
  const { form, selectedFieldId, updateField, removeField, duplicateField } = useFormStore();

  const selectedField = form.fields.find((f) => f.id === selectedFieldId);

  if (!selectedField) {
    return <div>No field selected</div>;
  }

  const handleLabelChange = (e) => {
    updateField(selectedFieldId, { label: e.target.value });
  };

  const handlePlaceholderChange = (e) => {
    updateField(selectedFieldId, { placeholder: e.target.value });
  };

  const handleRequiredChange = (e) => {
    updateField(selectedFieldId, { required: e.target.checked });
  };

  const handleHelpTextChange = (e) => {
    updateField(selectedFieldId, { helpText: e.target.value });
  };

  const handleRemove = () => {
    if (confirm('Are you sure you want to delete this field?')) {
      removeField(selectedFieldId);
    }
  };

  const handleDuplicate = () => {
    duplicateField(selectedFieldId);
  };

  return (
    <div className="field-configurator">
      <h3>Field Configuration</h3>

      <div className="config-section">
        <label>
          <span>Label *</span>
          <input
            type="text"
            value={selectedField.label}
            onChange={handleLabelChange}
            placeholder="Field label"
          />
        </label>
      </div>

      <div className="config-section">
        <label>
          <span>Type</span>
          <input
            type="text"
            value={selectedField.type}
            disabled
          />
        </label>
      </div>

      {selectedField.type !== FIELD_TYPES.CHECKBOX && (
        <div className="config-section">
          <label>
            <span>Placeholder</span>
            <input
              type="text"
              value={selectedField.placeholder}
              onChange={handlePlaceholderChange}
              placeholder="Placeholder text"
            />
          </label>
        </div>
      )}

      <div className="config-section">
        <label>
          <span>Help Text</span>
          <textarea
            value={selectedField.helpText}
            onChange={handleHelpTextChange}
            placeholder="Help text for users"
            rows="3"
          />
        </label>
      </div>

      <div className="config-section checkbox">
        <label>
          <input
            type="checkbox"
            checked={selectedField.required}
            onChange={handleRequiredChange}
          />
          <span>Required field</span>
        </label>
      </div>

      <div className="config-actions">
        <button className="btn btn-secondary" onClick={handleDuplicate}>
          Duplicate
        </button>
        <button className="btn btn-danger" onClick={handleRemove}>
          Delete
        </button>
      </div>
    </div>
  );
}
```

---

## ✅Step 7: Create CSS Files

### ✅7.1 Create `src/components/FormBuilder/FormBuilder.css`

```css
.form-builder {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.form-builder-header {
  background-color: white;
  border-bottom: 1px solid #ddd;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.form-builder-header h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.form-builder-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.form-builder-sidebar {
  width: 280px;
  background-color: white;
  border-right: 1px solid #ddd;
  overflow-y: auto;
  padding: 20px;
}

.form-builder-sidebar.right-sidebar {
  border-right: none;
  border-left: 1px solid #ddd;
}

.form-builder-main {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.preview-message {
  background-color: #e3f2fd;
  border-left: 4px solid #2196f3;
  padding: 12px 16px;
  margin-bottom: 20px;
  border-radius: 4px;
  color: #1976d2;
}

.no-field-selected {
  text-align: center;
  color: #999;
  padding: 40px 20px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #2196f3;
  color: white;
}

.btn-primary:hover {
  background-color: #1976d2;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.btn-danger {
  background-color: #f44336;
  color: white;
}

.btn-danger:hover {
  background-color: #d32f2f;
}
```

### ✅7.2 Create `src/components/FormBuilder/Canvas.css`

```css
.canvas {
  background-color: white;
  border-radius: 8px;
  border: 2px dashed #ccc;
  min-height: 400px;
  padding: 20px;
}

.canvas-content {
  height: 100%;
}

.canvas-empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #999;
  font-size: 16px;
}

.fields-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field-item {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.field-item:hover {
  background-color: #f0f0f0;
  border-color: #2196f3;
}

.field-item.selected {
  background-color: #e3f2fd;
  border-color: #2196f3;
  border-width: 2px;
}

.field-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.field-label {
  font-weight: 500;
  color: #333;
}

.field-type {
  font-size: 12px;
  color: #999;
  background-color: #f0f0f0;
  padding: 2px 8px;
  border-radius: 3px;
}

.field-required {
  font-size: 12px;
  color: #f44336;
  font-weight: 500;
}
```

### ✅7.3 Create `src/components/FormBuilder/FieldPalette.css`

```css
.field-palette h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #333;
}

.field-group {
  margin-bottom: 24px;
}

.field-group h4 {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.field-buttons {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-button {
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 13px;
  color: #333;
  transition: all 0.2s ease;
  text-align: left;
}

.field-button:hover {
  background-color: #2196f3;
  color: white;
  border-color: #2196f3;
}
```

### ✅7.4 Create `src/components/FormBuilder/FieldConfigurator.css`

```css
.field-configurator h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #333;
}

.config-section {
  margin-bottom: 16px;
}

.config-section label {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.config-section span {
  font-size: 12px;
  font-weight: 500;
  color: #333;
}

.config-section input[type="text"],
.config-section textarea {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  font-family: inherit;
}

.config-section input[type="text"]:focus,
.config-section textarea:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.config-section input[type="text"]:disabled {
  background-color: #f5f5f5;
  color: #999;
}

.config-section.checkbox {
  display: flex;
  align-items: center;
}

.config-section.checkbox label {
  flex-direction: row;
  gap: 8px;
}

.config-section.checkbox input[type="checkbox"] {
  cursor: pointer;
  width: 16px;
  height: 16px;
}

.config-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.config-actions button {
  width: 100%;
}
```

---

## ✅Step 8: Update App.jsx

### ✅8.1 Update `src/App.jsx`

Replace content with:

```javascript
import FormBuilder from './components/FormBuilder/FormBuilder';
import './App.css';

function App() {
  return (
    <div className="app">
      <FormBuilder />
    </div>
  );
}

export default App;
```

---

## ✅Step 9: Update App.css

### ✅9.1 Update `src/App.css`

```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  width: 100%;
  height: 100vh;
}

.app {
  width: 100%;
  height: 100%;
}
```

---

## Step 10: Test the Setup

### 10.1 Start the development server
```bash
npm run dev
```

### 10.2 Expected output
```
  VITE v[version] ready in [ms]

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### 10.3 Open in browser
Navigate to `http://localhost:5173/` and you should see:
- The Form Builder with three panels
- Left panel: Field palette with buttons to add fields
- Center: Canvas (empty state)
- Right panel: "Select a field to configure it" message

### 10.4 Test basic functionality
1. Click "+ Text Input" in left panel
2. A field should appear in the canvas
3. Click the field in canvas
4. Right panel should show field configuration options
5. Change the label and see it update in canvas

---

## Checklist - Phase 1 Complete

- [✅] All dependencies installed
- [✅] Folder structure created
- [✅] `formTypes.js` created with type definitions
- [✅] `fieldHelpers.js` created with utility functions
- [✅] `formStore.js` created with Zustand store
- [✅] `FormBuilder.jsx` component created
- [✅] `Canvas.jsx` component created
- [✅] `FieldPalette.jsx` component created
- [✅] `FieldConfigurator.jsx` component created
- [✅] All CSS files created
- [✅] `App.jsx` updated
- [✅] `App.css` updated
- [✅] Development server running
- [✅] Basic functionality tested

---

## Next Steps

Once Phase 1 is complete, you're ready to proceed with **Phase 2: Drag-and-Drop & Basic CRUD** which will add:
- Full drag-and-drop functionality using dnd-kit
- Reordering fields
- Deleting/duplicating fields
- Form preview mode


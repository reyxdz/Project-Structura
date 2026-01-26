# Phase 2: Drag-and-Drop & Basic CRUD - Detailed Step-by-Step Guide

## Overview
Phase 2 builds on the foundation created in Phase 1 by implementing full drag-and-drop functionality, advanced field configuration, and a working form preview with validation. This transforms the form builder from a static component listing into a fully functional form creation tool.

**Estimated Time:** 4-6 days
**Prerequisites:** Phase 1 completed successfully

---

## ✅ Step 1: Enhance the Store for Drag-and-Drop

### ✅1.1 Update `src/stores/formStore.js`

Add new actions to handle drag-and-drop operations. Replace the `reorderField` action with an improved version:

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
  // ... existing state and actions ...

  // Enhanced field reordering
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

  // New: Move field from palette to canvas (same as addField but with position)
  addFieldAtPosition: (type, position) => {
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

  // ... rest of existing actions remain the same ...
}));
```

---

## ✅Step 2: Create Drag-and-Drop Utilities

### ✅2.1 Create `src/utils/dndHelpers.js`

Helper functions for drag-and-drop operations:

```javascript
/**
 * Determine if a drop is valid
 * @param {string} overId - ID of the element being dragged over
 * @param {string} activeId - ID of the dragged element
 * @returns {boolean}
 */
export const isValidDrop = (overId, activeId) => {
  return overId !== null && overId !== activeId;
};

/**
 * Get insert index from drag position
 * @param {Array} items - Array of items
 * @param {string} overId - Item ID being dragged over
 * @returns {number} Insert index
 */
export const getInsertIndex = (items, overId) => {
  const index = items.findIndex((item) => item.id === overId);
  return index >= 0 ? index : items.length;
};

/**
 * Animate item movement on screen
 * @param {string} element - Element selector
 */
export const animateFieldMove = (element) => {
  const el = document.querySelector(element);
  if (el) {
    el.style.opacity = '0.5';
    setTimeout(() => {
      el.style.opacity = '1';
    }, 150);
  }
};

/**
 * Get field drop indicator position
 * @param {Array} items - Array of items
 * @param {string} overId - ID of item over
 * @param {number} fieldHeight - Height of field item
 * @returns {Object} Position data for indicator
 */
export const getDropIndicatorPosition = (items, overId, fieldHeight = 60) => {
  const index = items.findIndex((item) => item.id === overId);
  return {
    index: index >= 0 ? index : items.length,
    position: index >= 0 ? (index * fieldHeight) : (items.length * fieldHeight),
  };
};
```

---

## ✅Step 3: Update Canvas Component for Drag-and-Drop

### ✅3.1 Update `src/components/FormBuilder/Canvas.jsx`

Replace with full drag-and-drop implementation:

```javascript
import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useFormStore } from '../../stores/formStore';
import DraggableFieldItem from './DraggableFieldItem';
import SortableFieldItem from './SortableFieldItem';
import './Canvas.css';

export default function Canvas() {
  const { form, selectedFieldId, selectField, reorderField } = useFormStore();
  const [activeId, setActiveId] = useState(null);

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 8,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = form.fields.findIndex((f) => f.id === active.id);
      const newIndex = form.fields.findIndex((f) => f.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        reorderField(oldIndex, newIndex);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="canvas">
        <div className="canvas-content">
          {form.fields.length === 0 ? (
            <div className="canvas-empty-state">
              <p>Drag fields here to build your form</p>
            </div>
          ) : (
            <SortableContext
              items={form.fields.map((f) => f.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="fields-list">
                {form.fields.map((field) => (
                  <SortableFieldItem
                    key={field.id}
                    field={field}
                    isSelected={selectedFieldId === field.id}
                    onSelect={() => selectField(field.id)}
                    isDragging={activeId === field.id}
                  />
                ))}
              </div>
            </SortableContext>
          )}
        </div>
      </div>

      <DragOverlay>
        {activeId && (
          <DraggableFieldItem
            field={form.fields.find((f) => f.id === activeId)}
            isDragging={true}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
```

---

## ✅Step 4: Create Drag-and-Drop Field Components

### ✅4.1 Create `src/components/FormBuilder/SortableFieldItem.jsx`

Sortable field item for the canvas:

```javascript
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './FieldItem.css';

export default function SortableFieldItem({
  field,
  isSelected,
  onSelect,
  isDragging,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`field-item ${isSelected ? 'selected' : ''} ${
        isSortableDragging ? 'dragging' : ''
      }`}
      onClick={onSelect}
      {...attributes}
      {...listeners}
    >
      <div className="field-item-drag-handle">
        <span className="drag-icon">⋮⋮</span>
      </div>
      <div className="field-item-header">
        <span className="field-label">{field.label}</span>
        <span className="field-type">{field.type}</span>
      </div>
      {field.required && <span className="field-required">*Required</span>}
    </div>
  );
}
```

### ✅4.2 Create `src/components/FormBuilder/DraggableFieldItem.jsx`

Field item shown during drag overlay:

```javascript
import React from 'react';
import './FieldItem.css';

export default function DraggableFieldItem({ field, isDragging }) {
  return (
    <div className={`field-item ${isDragging ? 'dragging overlay' : ''}`}>
      <div className="field-item-drag-handle">
        <span className="drag-icon">⋮⋮</span>
      </div>
      <div className="field-item-header">
        <span className="field-label">{field.label}</span>
        <span className="field-type">{field.type}</span>
      </div>
      {field.required && <span className="field-required">*Required</span>}
    </div>
  );
}
```

---

## ✅Step 5: Enhance Field Configurator with Validation Rules

### ✅5.1 Update `src/components/FormBuilder/FieldConfigurator.jsx`

Add validation rules UI:

```javascript
import React, { useState } from 'react';
import { useFormStore } from '../../stores/formStore';
import { FIELD_TYPES, VALIDATION_TYPES } from '../../types/formTypes';
import ValidationRulesList from './ValidationRulesList';
import './FieldConfigurator.css';

export default function FieldConfigurator() {
  const { form, selectedFieldId, updateField, removeField, duplicateField } =
    useFormStore();
  const [showValidationPanel, setShowValidationPanel] = useState(false);

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

  const handleAddValidation = (validationType) => {
    const newValidation = {
      type: validationType,
      value: '',
      message: '',
    };
    const updatedValidations = [...selectedField.validation, newValidation];
    updateField(selectedFieldId, { validation: updatedValidations });
  };

  const handleUpdateValidation = (index, updates) => {
    const updatedValidations = selectedField.validation.map((v, i) =>
      i === index ? { ...v, ...updates } : v
    );
    updateField(selectedFieldId, { validation: updatedValidations });
  };

  const handleRemoveValidation = (index) => {
    const updatedValidations = selectedField.validation.filter(
      (_, i) => i !== index
    );
    updateField(selectedFieldId, { validation: updatedValidations });
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

      <div className="config-divider" />

      <div className="config-section">
        <button
          className="btn btn-secondary btn-small"
          onClick={() => setShowValidationPanel(!showValidationPanel)}
        >
          {showValidationPanel ? '− Validation Rules' : '+ Validation Rules'}
        </button>
      </div>

      {showValidationPanel && (
        <ValidationRulesList
          field={selectedField}
          onAddValidation={handleAddValidation}
          onUpdateValidation={handleUpdateValidation}
          onRemoveValidation={handleRemoveValidation}
        />
      )}

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

## ✅Step 6: Create Validation Rules Component

### ✅6.1 Create `src/components/FormBuilder/ValidationRulesList.jsx`

Component to manage validation rules:

```javascript
import React from 'react';
import { VALIDATION_TYPES } from '../../types/formTypes';
import './ValidationRulesList.css';

const availableValidations = [
  { type: VALIDATION_TYPES.REQUIRED, label: 'Required' },
  { type: VALIDATION_TYPES.MIN_LENGTH, label: 'Minimum Length' },
  { type: VALIDATION_TYPES.MAX_LENGTH, label: 'Maximum Length' },
  { type: VALIDATION_TYPES.PATTERN, label: 'Pattern (Regex)' },
  { type: VALIDATION_TYPES.EMAIL, label: 'Email Format' },
  { type: VALIDATION_TYPES.PHONE, label: 'Phone Format' },
  { type: VALIDATION_TYPES.URL, label: 'URL Format' },
  { type: VALIDATION_TYPES.CUSTOM, label: 'Custom Rule' },
];

export default function ValidationRulesList({
  field,
  onAddValidation,
  onUpdateValidation,
  onRemoveValidation,
}) {
  const getValidationLabel = (type) => {
    return availableValidations.find((v) => v.type === type)?.label || type;
  };

  const getValidationPlaceholder = (type) => {
    switch (type) {
      case VALIDATION_TYPES.MIN_LENGTH:
        return 'e.g., 3';
      case VALIDATION_TYPES.MAX_LENGTH:
        return 'e.g., 50';
      case VALIDATION_TYPES.PATTERN:
        return 'e.g., ^[0-9]+$';
      default:
        return 'Value';
    }
  };

  return (
    <div className="validation-rules-panel">
      <h4>Validation Rules</h4>

      <div className="add-validation">
        <label>
          <span>Add Rule:</span>
          <select
            onChange={(e) => {
              if (e.target.value) {
                onAddValidation(e.target.value);
                e.target.value = '';
              }
            }}
            defaultValue=""
          >
            <option value="">Select a rule...</option>
            {availableValidations.map((v) => (
              <option key={v.type} value={v.type}>
                {v.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {field.validation.length > 0 && (
        <div className="validation-list">
          {field.validation.map((rule, index) => (
            <div key={index} className="validation-rule">
              <div className="rule-header">
                <span className="rule-label">
                  {getValidationLabel(rule.type)}
                </span>
                <button
                  className="btn-remove-rule"
                  onClick={() => onRemoveValidation(index)}
                  title="Remove rule"
                >
                  ×
                </button>
              </div>

              {rule.type !== VALIDATION_TYPES.REQUIRED &&
                rule.type !== VALIDATION_TYPES.EMAIL &&
                rule.type !== VALIDATION_TYPES.PHONE &&
                rule.type !== VALIDATION_TYPES.URL && (
                  <input
                    type="text"
                    placeholder={getValidationPlaceholder(rule.type)}
                    value={rule.value}
                    onChange={(e) =>
                      onUpdateValidation(index, { value: e.target.value })
                    }
                    className="rule-input"
                  />
                )}

              <input
                type="text"
                placeholder="Custom error message..."
                value={rule.message}
                onChange={(e) =>
                  onUpdateValidation(index, { message: e.target.value })
                }
                className="rule-message"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## ✅Step 7: Create Form Preview Component

### ✅7.1 Create `src/components/FormPreview/FormPreview.jsx`

Render the form for preview/testing:

```javascript
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useFormStore } from '../../stores/formStore';
import { FIELD_TYPES } from '../../types/formTypes';
import FormField from './FormField';
import './FormPreview.css';

export default function FormPreview() {
  const { form, setPreviewData, clearPreviewData } = useFormStore();
  const { control, handleSubmit, formState: { errors } } = useForm({
    mode: 'onChange',
  });

  const onSubmit = (data) => {
    setPreviewData(data);
    alert('Form submitted! Check console for data.');
    console.log('Form Data:', data);
  };

  const onClear = () => {
    clearPreviewData();
  };

  return (
    <div className="form-preview">
      <div className="form-preview-header">
        <h2>{form.name}</h2>
        {form.description && <p className="form-description">{form.description}</p>}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="form-preview-body">
        {form.fields.length === 0 ? (
          <div className="form-empty-state">
            <p>No fields in this form yet</p>
          </div>
        ) : (
          <div className="form-fields">
            {form.fields.map((field) => (
              <FormField
                key={field.id}
                field={field}
                control={control}
                error={errors[field.id]}
              />
            ))}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClear}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
```

### ✅7.2 Create `src/components/FormPreview/FormField.jsx`

Individual form field renderer:

```javascript
import React from 'react';
import { Controller } from 'react-hook-form';
import { FIELD_TYPES } from '../../types/formTypes';
import { buildValidationRules } from '../../utils/validationRules';
import './FormField.css';

export default function FormField({ field, control, error }) {
  const validationRules = buildValidationRules(field);

  return (
    <div className="form-field">
      {field.type !== FIELD_TYPES.CHECKBOX && (
        <label htmlFor={field.id}>
          {field.label}
          {field.required && <span className="required-asterisk">*</span>}
        </label>
      )}

      <Controller
        name={field.id}
        control={control}
        rules={validationRules}
        defaultValue={field.value || ''}
        render={({ field: fieldProps }) => {
          switch (field.type) {
            case FIELD_TYPES.TEXT:
              return (
                <input
                  {...fieldProps}
                  type="text"
                  placeholder={field.placeholder}
                  className={error ? 'input-error' : ''}
                />
              );

            case FIELD_TYPES.EMAIL:
              return (
                <input
                  {...fieldProps}
                  type="email"
                  placeholder={field.placeholder}
                  className={error ? 'input-error' : ''}
                />
              );

            case FIELD_TYPES.NUMBER:
              return (
                <input
                  {...fieldProps}
                  type="number"
                  placeholder={field.placeholder}
                  className={error ? 'input-error' : ''}
                />
              );

            case FIELD_TYPES.TEXTAREA:
              return (
                <textarea
                  {...fieldProps}
                  placeholder={field.placeholder}
                  rows="4"
                  className={error ? 'input-error' : ''}
                />
              );

            case FIELD_TYPES.DATE:
              return (
                <input
                  {...fieldProps}
                  type="date"
                  className={error ? 'input-error' : ''}
                />
              );

            case FIELD_TYPES.FILE:
              return (
                <input
                  {...fieldProps}
                  type="file"
                  className={error ? 'input-error' : ''}
                />
              );

            case FIELD_TYPES.CHECKBOX:
              return (
                <div className="checkbox-field">
                  <input
                    {...fieldProps}
                    type="checkbox"
                    id={field.id}
                  />
                  <label htmlFor={field.id}>
                    {field.label}
                    {field.required && <span className="required-asterisk">*</span>}
                  </label>
                </div>
              );

            case FIELD_TYPES.RADIO:
              return (
                <div className="radio-field">
                  {field.options?.map((option, idx) => (
                    <div key={idx} className="radio-option">
                      <input
                        type="radio"
                        id={`${field.id}-${idx}`}
                        value={option.value || option}
                        {...fieldProps}
                      />
                      <label htmlFor={`${field.id}-${idx}`}>
                        {option.label || option}
                      </label>
                    </div>
                  ))}
                </div>
              );

            case FIELD_TYPES.SELECT:
              return (
                <select
                  {...fieldProps}
                  className={error ? 'input-error' : ''}
                >
                  <option value="">Select an option...</option>
                  {field.options?.map((option, idx) => (
                    <option key={idx} value={option.value || option}>
                      {option.label || option}
                    </option>
                  ))}
                </select>
              );

            default:
              return null;
          }
        }}
      />

      {field.helpText && <p className="field-help-text">{field.helpText}</p>}
      {error && <p className="field-error-message">{error.message}</p>}
    </div>
  );
}
```

---

## ✅Step 8: Create Validation Rules Builder

### ✅8.1 Create `src/utils/validationRules.js`

Convert field validation config to react-hook-form rules:

```javascript
import { VALIDATION_TYPES } from '../types/formTypes';

/**
 * Build validation rules for react-hook-form
 * @param {Object} field - Field configuration
 * @returns {Object} Validation rules object
 */
export const buildValidationRules = (field) => {
  const rules = {};

  if (field.required) {
    rules.required = `${field.label} is required`;
  }

  if (field.validation && Array.isArray(field.validation)) {
    field.validation.forEach((rule) => {
      switch (rule.type) {
        case VALIDATION_TYPES.MIN_LENGTH:
          rules.minLength = {
            value: parseInt(rule.value, 10),
            message: rule.message || `Minimum ${rule.value} characters required`,
          };
          break;

        case VALIDATION_TYPES.MAX_LENGTH:
          rules.maxLength = {
            value: parseInt(rule.value, 10),
            message: rule.message || `Maximum ${rule.value} characters allowed`,
          };
          break;

        case VALIDATION_TYPES.PATTERN:
          rules.pattern = {
            value: new RegExp(rule.value),
            message: rule.message || 'Invalid format',
          };
          break;

        case VALIDATION_TYPES.EMAIL:
          rules.pattern = {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: rule.message || 'Please enter a valid email address',
          };
          break;

        case VALIDATION_TYPES.PHONE:
          rules.pattern = {
            value: /^[0-9\-\+\(\)\s]+$/,
            message: rule.message || 'Please enter a valid phone number',
          };
          break;

        case VALIDATION_TYPES.URL:
          rules.pattern = {
            value: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&/=]*)$/,
            message: rule.message || 'Please enter a valid URL',
          };
          break;

        default:
          break;
      }
    });
  }

  return rules;
};

/**
 * Validate a single value against field rules
 * @param {*} value - Value to validate
 * @param {Object} field - Field configuration
 * @returns {Array} Array of error messages
 */
export const validateFieldValue = (value, field) => {
  const errors = [];

  if (field.required && (!value || value.toString().trim() === '')) {
    errors.push(`${field.label} is required`);
  }

  if (field.validation && Array.isArray(field.validation)) {
    field.validation.forEach((rule) => {
      switch (rule.type) {
        case VALIDATION_TYPES.MIN_LENGTH:
          if (value && value.toString().length < parseInt(rule.value, 10)) {
            errors.push(
              rule.message || `Minimum ${rule.value} characters required`
            );
          }
          break;

        case VALIDATION_TYPES.MAX_LENGTH:
          if (value && value.toString().length > parseInt(rule.value, 10)) {
            errors.push(
              rule.message || `Maximum ${rule.value} characters allowed`
            );
          }
          break;

        case VALIDATION_TYPES.PATTERN:
          if (value && !new RegExp(rule.value).test(value)) {
            errors.push(rule.message || 'Invalid format');
          }
          break;

        default:
          break;
      }
    });
  }

  return errors;
};
```

---

## ✅Step 9: Create CSS Files for New Components

### ✅9.1 Create `src/components/FormBuilder/FieldItem.css`

```css
.field-item {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 0;
  cursor: grab;
  transition: all 0.2s ease;
  display: flex;
  align-items: stretch;
  user-select: none;
}

.field-item:hover {
  background-color: #f0f0f0;
  border-color: #2196f3;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.field-item.selected {
  background-color: #e3f2fd;
  border-color: #2196f3;
  border-width: 2px;
}

.field-item.dragging {
  opacity: 0.5;
  cursor: grabbing;
}

.field-item.dragging.overlay {
  background-color: #2196f3;
  color: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.field-item-drag-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  background-color: #f5f5f5;
  border-right: 1px solid #e0e0e0;
  flex-shrink: 0;
  cursor: grab;
}

.field-item-drag-handle:active {
  cursor: grabbing;
}

.drag-icon {
  font-size: 12px;
  color: #999;
  letter-spacing: -2px;
}

.field-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  padding: 12px;
  gap: 8px;
}

.field-label {
  font-weight: 500;
  color: #333;
  flex: 1;
  word-break: break-word;
}

.field-type {
  font-size: 12px;
  color: #999;
  background-color: #f0f0f0;
  padding: 2px 8px;
  border-radius: 3px;
  white-space: nowrap;
  flex-shrink: 0;
}

.field-required {
  font-size: 12px;
  color: #f44336;
  font-weight: 600;
  margin-left: auto;
  padding: 0 12px;
}
```

### ✅9.2 Create `src/components/FormBuilder/ValidationRulesList.css`

```css
.validation-rules-panel {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 16px;
  margin-top: 16px;
}

.validation-rules-panel h4 {
  margin: 0 0 12px 0;
  font-size: 13px;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.add-validation {
  margin-bottom: 16px;
}

.add-validation label {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.add-validation span {
  font-size: 12px;
  font-weight: 500;
  color: #333;
}

.add-validation select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  font-family: inherit;
}

.add-validation select:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.validation-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.validation-rule {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px;
}

.rule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.rule-label {
  font-size: 12px;
  font-weight: 600;
  color: #333;
}

.btn-remove-rule {
  background: none;
  border: none;
  font-size: 20px;
  color: #f44336;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  transition: all 0.2s ease;
}

.btn-remove-rule:hover {
  background-color: #ffebee;
}

.rule-input,
.rule-message {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  font-family: inherit;
  margin-bottom: 8px;
}

.rule-input:last-child,
.rule-message:last-child {
  margin-bottom: 0;
}

.rule-input:focus,
.rule-message:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.config-divider {
  height: 1px;
  background-color: #eee;
  margin: 16px 0;
}

.btn-small {
  padding: 6px 12px;
  font-size: 13px;
  width: 100%;
}
```

### ✅9.3 Create `src/components/FormPreview/FormPreview.css`

```css
.form-preview {
  background-color: white;
  border-radius: 8px;
  padding: 32px;
  max-width: 600px;
  margin: 0 auto;
}

.form-preview-header {
  margin-bottom: 32px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 16px;
}

.form-preview-header h2 {
  margin: 0 0 8px 0;
  font-size: 28px;
  color: #333;
}

.form-description {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.form-preview-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #eee;
}

.form-actions button {
  flex: 1;
}
```

### ✅9.4 Create `src/components/FormPreview/FormField.css`

```css
.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-field label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.required-asterisk {
  color: #f44336;
  margin-left: 4px;
}

.form-field input,
.form-field textarea,
.form-field select {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  background-color: white;
}

.form-field input:focus,
.form-field textarea:focus,
.form-field select:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.form-field input.input-error,
.form-field textarea.input-error,
.form-field select.input-error {
  border-color: #f44336;
  background-color: #ffebee;
}

.form-field input.input-error:focus,
.form-field textarea.input-error:focus,
.form-field select.input-error:focus {
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
}

.field-help-text {
  font-size: 12px;
  color: #666;
  margin: 0;
  padding-top: 2px;
}

.field-error-message {
  font-size: 12px;
  color: #f44336;
  margin: 0;
  padding-top: 4px;
  font-weight: 500;
}

.checkbox-field {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox-field input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-field label {
  margin: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.radio-field {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.radio-option input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.radio-option label {
  margin: 0;
  cursor: pointer;
}
```

---

## ✅Step 10: Update FormBuilder Component to Include Preview Toggle

### ✅10.1 Update `src/components/FormBuilder/FormBuilder.jsx`

```javascript
import React, { useState } from 'react';
import { useFormStore } from '../../stores/formStore';
import Canvas from './Canvas';
import FieldPalette from './FieldPalette';
import FieldConfigurator from './FieldConfigurator';
import FormPreview from '../FormPreview/FormPreview';
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
        {!showPreview && (
          <aside className="form-builder-sidebar left-sidebar">
            <FieldPalette />
          </aside>
        )}

        <main className="form-builder-main">
          {showPreview ? (
            <FormPreview />
          ) : (
            <Canvas />
          )}
        </main>

        {!showPreview && (
          <aside className="form-builder-sidebar right-sidebar">
            {selectedFieldId ? (
              <FieldConfigurator />
            ) : (
              <div className="no-field-selected">
                <p>Select a field to configure it</p>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
```

---

## Step 11: Test Drag-and-Drop Functionality

### 11.1 Test in Browser

1. ✅**Start dev server:**
   ```bash
   npm run dev
   ```

2. ✅**Test field addition:**
   - Click "Add Fields" buttons on the left
   - Verify fields appear in the canvas

3. ✅**Test drag-and-drop:**
   - Hover over a field, you should see the drag handle appear
   - Click and drag a field to reorder
   - Fields should rearrange smoothly

4. ✅**Test field selection:**
   - Click on a field in the canvas
   - Right panel should populate with config options
   - Edit the label and see it update in real-time

5. ✅**Test validation rules:**
   - Select a field
   - Click "Validation Rules" button
   - Add rules and test validation in preview mode

6. ✅**Test preview mode:**
   - Click "Preview" button at top
   - Form should render with all fields
   - Try submitting and check console for form data
   - Try breaking validation rules

---

## Checklist - Phase 2 Complete

- [✅] Canvas component updated with dnd-kit integration
- [✅] SortableFieldItem component created
- [✅] DraggableFieldItem component created
- [✅] FieldConfigurator enhanced with validation rules UI
- [✅] ValidationRulesList component created
- [✅] FormPreview component created
- [✅] FormField component created
- [✅] validationRules utility created
- [✅] FieldItem.css created
- [✅] ValidationRulesList.css created
- [✅] FormPreview.css created
- [✅] FormField.css created
- [✅] Drag-and-drop functionality working
- [✅] Field reordering working
- [✅] Validation rules UI working
- [✅] Preview mode working
- [✅] Form validation working
- [✅] Form submission working

---

## Common Issues & Solutions

### Issue: Drag-and-drop not working
**Solution:** Ensure DndContext is properly wrapping the draggable items and all sensors are configured correctly.

### Issue: Validation rules not applying
**Solution:** Check that `validationRules.js` is properly building the react-hook-form rules object.

### Issue: Preview shows blank
**Solution:** Ensure `FormField.jsx` is correctly handling all field types defined in `FIELD_TYPES`.

---

## Next Steps

Once Phase 2 is complete, you're ready for **Phase 3: Conditional Fields** which will add:
- Conditional visibility logic
- Show/hide/enable/disable actions based on other field values
- Dependency tracking and validation
- Complex field interactions

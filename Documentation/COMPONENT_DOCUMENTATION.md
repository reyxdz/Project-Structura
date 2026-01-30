# Component Documentation

This document provides detailed documentation for all React components in the Project Structura Form Builder application.

---

## Table of Contents

1. [FormBuilder](#formbuilder)
2. [Canvas](#canvas)
3. [FieldPalette](#fieldpalette)
4. [FieldConfigurator](#fieldconfigurator)
5. [FormPreview](#formpreview)
6. [FormField](#formfield)
7. [DraggableFieldItem](#draggablefielditem)
8. [SortableFieldItem](#sortablefielditem)
9. [DropZone](#dropzone)
10. [ConditionalRuleBuilder](#conditionalrulebuilder)
11. [DependencyGraph](#dependencygraph)
12. [ValidationRulesList](#validationruleslist)
13. [ConfirmModal](#confirmmodal)

---

## FormBuilder

**File**: `src/components/FormBuilder/FormBuilder.jsx`
**Purpose**: Main container component for the form builder application.

### Overview

FormBuilder is the root component that manages the overall layout and mode switching between edit and preview modes.

### State

| State | Type | Purpose |
|-------|------|---------|
| `showPreview` | boolean | Toggles between edit mode and preview mode |
| `showFieldsPalette` | boolean | Controls mobile sidebar for fields palette |
| `showConfigurator` | boolean | Controls mobile sidebar for field configurator |

### Props

None. Uses Zustand store for all state.

### Usage

```jsx
import FormBuilder from './components/FormBuilder/FormBuilder';

function App() {
    return <FormBuilder />;
}
```

### Key Functions

| Function | Purpose |
|----------|---------|
| `onClick={() => setShowPreview(!showPreview)}` | Toggle between edit and preview modes |

### Layout Structure

```
┌─────────────────────────────────────────────────────┐
│ Header                                              │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Logo                    [ Preview | Edit ]      │ │
│ └─────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ┌───────────┐ ┌─────────────────────┐ ┌───────────┐│
│ │           │ │                     │ │           ││
│ │  Field    │ │    Main Content     │ │  Field    ││
│ │  Palette  │ │                     │ │Configurator││
│ │ (Left)    │ │  Canvas/FormPreview │ │ (Right)   ││
│ │           │ │                     │ │           ││
│ └───────────┘ └─────────────────────┘ └───────────┘│
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Dependencies

- `useFormStore` - Zustand store for form state
- `Canvas` - Edit mode component
- `FormPreview` - Preview mode component
- `FieldPalette` - Fields sidebar
- `FieldConfigurator` - Field properties editor

---

## Canvas

**File**: `src/components/FormBuilder/Canvas.jsx`
**Purpose**: Drag-and-drop area for building and arranging form fields.

### Overview

Canvas is the main editing area where users can drag fields from the palette and arrange them. It uses @dnd-kit for drag-and-drop functionality.

### State

| State | Type | Purpose |
|-------|------|---------|
| `activeId` | string \| null | ID of currently dragged field |
| `newFieldDragData` | object \| null | Position data for new field being dragged |

### Props

None. Uses Zustand store.

### Key Functions

| Function | Parameters | Purpose |
|----------|------------|---------|
| `handleDragStart` | `event` | Start dragging a field |
| `handleDragEnd` | `event` | End dragging, reorder if needed |
| `handleCanvasDragOver` | `event` | Track position while dragging over canvas |
| `handleCanvasDrop` | `event` | Drop a new field onto canvas |
| `handleCanvasClick` | `event` | Deselect field when clicking background |
| `handleCanvasDragLeave` | `event` | Clear drag data when leaving canvas |

### DnD Sensors

```javascript
const sensors = useSensors(
    useSensor(PointerSensor, {
        distance: 8, // Minimum drag distance to activate
    }),
    useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
    })
);
```

### Rendering Logic

```javascript
// Empty state
if (form.fields.length === 0) {
    return <div className="canvas-empty-state">Drag fields here</div>;
}

// Render sortable fields
<SortableContext
    items={form.fields.map((f) => f.id)}
    strategy={verticalListSortingStrategy}
>
    {form.fields.map((field, index) => (
        <SortableFieldItem key={field.id} field={field} />
    ))}
</SortableContext>
```

### Dependencies

- `@dnd-kit/core` - DndContext, sensors
- `@dnd-kit/sortable` - SortableContext
- `useFormStore` - Form state and actions
- `SortableFieldItem` - Sortable wrapper for fields
- `DraggableFieldItem` - Drag overlay component

---

## FieldPalette

**File**: `src/components/FormBuilder/FieldPalette.jsx`
**Purpose**: Sidebar displaying available field types that can be dragged onto the canvas.

### Overview

FieldPalette provides a list of all available field types that users can drag to create new form fields.

### Props

None. Uses Zustand store.

### Field Types Provided

| Field Type | Icon | Purpose |
|------------|------|---------|
| SHORT_TEXT | Text input | Single line text |
| LONG_TEXT | Textarea | Multi-line text |
| NUMBER | Number | Numeric input |
| EMAIL | Email | Email input |
| PHONE | Phone | Phone number |
| DATE | Calendar | Date picker |
| TIME | Clock | Time input |
| CHECKBOX | Checkbox | Boolean |
| RADIO | Radio | Single choice |
| SINGLE_CHOICE | List | Single choice |
| MULTIPLE_CHOICE | Checkboxes | Multiple choices |
| DROPDOWN | Dropdown | Dropdown select |
| SELECT | Select | Native select |
| FILE | Upload | File upload |
| SIGNATURE | Pen | Signature |
| FULL_NAME | User | Name fields |
| ADDRESS | Location | Address fields |
| APPOINTMENT | Calendar+Clock | Appointment scheduling |
| HEADING | H1 | Section header |
| PARAGRAPH | Paragraph | Description |
| DIVIDER | Line | Visual separator |
| PAGE_BREAK | Page | Multi-page break |
| SCALE_RATING | Scale | Rating scale |
| STAR_RATING | Star | Star rating |
| CAPTCHA | Shield | Bot prevention |

### Drag Data Structure

When dragging from FieldPalette:

```javascript
e.dataTransfer.setData('fieldType', 'TEXT'); // Field type identifier
```

### Dependencies

- `FIELD_TYPES` from `../../types/formTypes`
- Field icon imports from `../../icons/`

---

## FieldConfigurator

**File**: `src/components/FormBuilder/FieldConfigurator.jsx`
**Purpose**: Panel for editing properties of the selected field.

### Overview

FieldConfigurator displays a dynamic form for editing the properties of the currently selected field in the canvas.

### Props

None. Uses Zustand store to get selected field.

### State

None. Directly reads from store.

### Field Properties Editable

| Property | Type | Purpose |
|----------|------|---------|
| `label` | string | Field label displayed to users |
| `placeholder` | string | Placeholder text |
| `helpText` | string | Helper text below field |
| `required` | boolean | Whether field is required |
| `value` | string | Default value |
| `options` | array | Options for choice fields |
| `metadata` | object | Field-type specific settings |

### Rendering Logic

```javascript
const selectedFieldId = useFormStore((state) => state.selectedFieldId);
const form = useFormStore((state) => state.form);
const selectedField = form.fields.find(f => f.id === selectedFieldId);

if (!selectedFieldId) {
    return <div className="no-field-selected">Select a field to configure</div>;
}

return <FieldConfigurator field={selectedField} />;
```

### Subsections

1. **Basic Properties** - Label, placeholder, help text
2. **Validation Rules** - Required, min/max length, patterns
3. **Conditional Logic** - Show/hide rules
4. **Advanced Settings** - Field-type specific metadata

### Dependencies

- `useFormStore` - Selected field and update actions
- `ValidationRulesList` - Validation rule editor
- `ConditionalRuleBuilder` - Conditional logic editor

---

## FormPreview

**File**: `src/components/FormPreview/FormPreview.jsx`
**Purpose**: Live preview of the form in a renderable format.

### Overview

FormPreview renders the form as it would appear to end users, with real-time validation and device preview capabilities.

### State

| State | Type | Purpose |
|-------|------|---------|
| `selectedDevice` | string | Current preview device (mobile/tablet/desktop) |
| `currentDeviceSize` | string | Detected actual device size |

### Props

None. Uses Zustand store.

### Key Functions

| Function | Purpose |
|----------|---------|
| `detectDeviceSize()` | Auto-detect current device width |
| `getAvailableDevices()` | Determine which devices can be previewed |
| `onSubmit(data)` | Handle form submission |
| `onClear()` | Clear form data |

### Device Preview

```javascript
const deviceSizes = {
    mobile: '375px',
    tablet: '768px',
    desktop: '100%'
};

<div className={`form-preview-container ${selectedDevice}-view`}>
    <form>
        {/* Form fields */}
    </form>
</div>
```

### Form Rendering

```javascript
const { handleSubmit, control } = useForm({
    mode: 'onChange', // Validate on change
});

{form.fields.map((field) => {
    const isVisible = shouldFieldBeVisible(field, previewData, form.fields);
    if (!isVisible) return null;
    
    return (
        <FormField
            key={field.id}
            field={field}
            control={control}
            error={null}
        />
    );
})}
```

### Dependencies

- `useFormStore` - Form data and preview data
- `react-hook-form` - useForm, Controller
- `shouldFieldBeVisible` - Conditional logic evaluation
- `FormField` - Individual field renderer

---

## FormField

**File**: `src/components/FormPreview/FormField.jsx**
**Purpose**: Renders an individual form field based on its type.

### Overview

FormField is a versatile component that renders different input types based on the field's `type` property. It wraps inputs with react-hook-form's Controller for validation.

### Props

| Prop | Type | Purpose |
|------|------|---------|
| `field` | object | Field configuration object |
| `control` | object | React Hook Form control object |
| `error` | object | Validation error object |

### Field Type Rendering

```javascript
switch (field.type) {
    case FIELD_TYPES.TEXT:
        return <input type="text" {...fieldProps} />;
    
    case FIELD_TYPES.NUMBER:
        return <input type="number" {...fieldProps} />;
    
    case FIELD_TYPES.TEXTAREA:
        return <textarea {...fieldProps} rows="4" />;
    
    case FIELD_TYPES.SELECT:
        return <select {...fieldProps}>{/* options */}</select>;
    
    // ... more types
}
```

### Special Field Types

#### Heading (Non-input)
```javascript
if (field.type === FIELD_TYPES.HEADING) {
    return (
        <div className="heading-field">
            <h2>{field.label}</h2>
            <p>{field.placeholder}</p>
        </div>
    );
}
```

#### Signature
```javascript
if (field.type === FIELD_TYPES.SIGNATURE) {
    return (
        <div className="signature-field">
            <label>{field.label}</label>
            <div className="signature-canvas">
                {/* Signature canvas */}
            </div>
        </div>
    );
}
```

#### Appointment
Complex field with:
- Month/year selectors
- Calendar grid
- Time slot generation
- Timezone display
- Selection summary

### Validation Integration

```javascript
const validationRules = buildValidationRules(field);

<Controller
    name={field.id}
    control={control}
    rules={validationRules}
    render={({ field: fieldProps, fieldState }) => (
        <InputComponent {...fieldProps} error={fieldState.error} />
    )}
/>
```

### Dependencies

- `react-hook-form` - Controller
- `FIELD_TYPES` - Field type constants
- `buildValidationRules` - Validation rule builder

---

## DraggableFieldItem

**File**: `src/components/FormBuilder/DraggableFieldItem.jsx`
**Purpose**: Drag overlay component shown while dragging a field.

### Overview

DraggableFieldItem is rendered as the drag overlay during drag operations. It shows a visual representation of the field being dragged.

### Props

| Prop | Type | Purpose |
|------|------|---------|
| `field` | object | Field configuration |
| `isDragging` | boolean | Whether field is being dragged |

### Rendering

```javascript
return (
    <div className="draggable-field-item dragging">
        <div className="field-header">
            <span className="field-type-icon">{/* Icon */}</span>
            <span className="field-label">{field.label}</span>
        </div>
        <div className="field-preview">
            {/* Preview of field input */}
        </div>
    </div>
);
```

### Dependencies

- `@dnd-kit/utilities` - CSS utilities

---

## SortableFieldItem

**File**: `src/components/FormBuilder/SortableFieldItem.jsx`
**Purpose**: Sortable wrapper for fields in the canvas.

### Overview

SortableFieldItem wraps a field in the canvas with sortable functionality from @dnd-kit.

### Props

| Prop | Type | Purpose |
|------|------|---------|
| `field` | object | Field configuration |
| `isSelected` | boolean | Whether field is selected |
| `onSelect` | function | Selection callback |
| `isDragging` | boolean | Whether field is being dragged |

### Key Functions

| Function | Purpose |
|----------|---------|
| `handleKeyDown` | Keyboard navigation for accessibility |
| `attributes` | ARIA attributes for accessibility |
| `listeners` | Event listeners for drag handle |
| `transform` | CSS transform for drag positioning |
| `transition` | Smooth transition animation |

### Usage

```javascript
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
} = useSortable({ id: field.id });

const style = {
    transform: CSS.Transform.toString(transform),
    transition,
};
```

### Dependencies

- `@dnd-kit/sortable` - useSortable hook
- `@dnd-kit/utilities` - CSS utility
- `useFormStore` - Select field action

---

## DropZone

**File**: `src/components/FormBuilder/DropZone.jsx`
**Purpose**: Visual indicator for where a field will be dropped.

### Overview

DropZone shows a visual indicator when dragging a field over the canvas, showing where the field will be inserted.

### Props

| Prop | Type | Purpose |
|------|------|---------|
| `isOver` | boolean | Whether something is being dragged over |
| `position` | string | Position indicator (before/after) |

### Rendering

```javascript
return (
    <div className={`drop-zone ${isOver ? 'over' : ''}`}>
        <div className="drop-indicator">
            Drop here {position}
        </div>
    </div>
);
```

### Usage with dnd-kit

```javascript
const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-drop-zone',
});
```

---

## ConditionalRuleBuilder

**File**: `src/components/FormBuilder/ConditionalRuleBuilder.jsx**
**Purpose**: UI for creating and managing conditional logic rules.

### Overview

ConditionalRuleBuilder provides a user interface for defining when fields should be shown, hidden, enabled, or disabled based on other field values.

### State

| State | Type | Purpose |
|-------|------|---------|
| `rules` | array | Array of conditional rules |

### Rule Structure

```javascript
{
    triggerFieldId: 'field-id-to-watch',
    operator: 'EQUALS', // EQUALS, NOT_EQUALS, CONTAINS, etc.
    value: 'expected-value',
    action: 'SHOW' // SHOW, HIDE, ENABLE, DISABLE
}
```

### UI Components

1. **Trigger Field Selector** - Dropdown of all form fields
2. **Operator Selector** - Comparison operators
3. **Value Input** - Value to compare against
4. **Action Selector** - Action to perform (show/hide/enable/disable)
5. **Add Rule Button** - Add new rule to group
6. **Logic Type Toggle** - AND/OR between rules

### Example Usage

```javascript
const [rules, setRules] = useState([
    {
        triggerFieldId: 'email-field',
        operator: 'CONTAINS',
        value: '@company.com',
        action: 'SHOW'
    }
]);

const addRule = () => {
    setRules([...rules, { triggerFieldId: '', operator: 'EQUALS', value: '', action: 'SHOW' }]);
};
```

### Dependencies

- `useFormStore` - Form fields for trigger selection
- `CONDITIONAL_OPERATORS` - Operator constants
- `CONDITIONAL_ACTIONS` - Action constants
- `createConditionalRule` - Rule creation utility

---

## DependencyGraph

**File**: `src/components/FormBuilder/DependencyGraph.jsx**
**Purpose**: Visual representation of field dependencies.

### Overview

DependencyGraph displays a visual diagram showing how fields are connected through conditional logic.

### Props

None. Reads from formStore.

### Graph Structure

```javascript
// Nodes (Fields)
const nodes = form.fields.map(field => ({
    id: field.id,
    label: field.label,
    type: field.type
}));

// Edges (Dependencies)
const edges = [];
form.fields.forEach(field => {
    if (field.conditionals) {
        field.conditionals.forEach(conditional => {
            conditional.rules.forEach(rule => {
                edges.push({
                    from: rule.triggerFieldId,
                    to: field.id,
                    label: rule.action
                });
            });
        });
    }
});
```

### Rendering

Uses a graph visualization library or SVG to render:
- Nodes for each field
- Directed edges showing dependencies
- Labels indicating the action (SHOW/HIDE/ENABLE/DISABLE)

### Dependencies

- `useFormStore` - Form fields and conditionals
- `getTriggerFields` - Utility to extract dependencies

---

## ValidationRulesList

**File**: `src/components/FormBuilder/ValidationRulesList.jsx`
**Purpose**: UI for managing validation rules on fields.

### Overview

ValidationRulesList provides an interface for adding and configuring validation rules for form fields.

### Props

| Prop | Type | Purpose |
|------|------|---------|
| `field` | object | Field configuration |
| `onUpdate` | function | Callback when rules change |

### Rule Types

| Type | Purpose |
|------|---------|
| `REQUIRED` | Field must have value |
| `MIN_LENGTH` | Minimum character count |
| `MAX_LENGTH` | Maximum character count |
| `PATTERN` | Regex pattern |
| `EMAIL` | Email format |
| `PHONE` | Phone format |
| `URL` | URL format |

### UI Components

1. **Rule Type Selector** - Dropdown of validation types
2. **Value Input** - Value for the rule (e.g., min length number)
3. **Error Message** - Custom validation message
4. **Add Rule Button** - Add new validation rule
5. **Remove Rule Button** - Remove existing rule

### Example

```javascript
const [rules, setRules] = useState([
    { type: 'REQUIRED', value: true, message: 'Name is required' },
    { type: 'MIN_LENGTH', value: '2', message: 'Minimum 2 characters' }
]);

<ValidationRulesList field={field} onUpdate={setRules} />
```

### Dependencies

- `VALIDATION_TYPES` - Validation type constants
- `buildValidationRules` - Validation rule builder
- `validateFieldValue` - Value validation utility

---

## ConfirmModal

**File**: `src/components/Common/ConfirmModal.jsx`
**Purpose**: Reusable confirmation dialog component.

### Overview

ConfirmModal displays a modal dialog for user confirmation before destructive actions.

### Props

| Prop | Type | Purpose |
|------|------|---------|
| `isOpen` | boolean | Whether modal is visible |
| `title` | string | Modal title |
| `message` | string | Modal message |
| `confirmText` | string | Confirm button text |
| `cancelText` | string | Cancel button text |
| `onConfirm` | function | Confirm callback |
| `onCancel` | function | Cancel callback |
| `variant` | string | 'danger' for destructive actions |

### Usage

```javascript
<ConfirmModal
    isOpen={showModal}
    title="Delete Field"
    message="Are you sure you want to delete this field?"
    confirmText="Delete"
    cancelText="Cancel"
    variant="danger"
    onConfirm={handleDelete}
    onCancel={() => setShowModal(false)}
/>
```

### Features

- Escape key to cancel
- Click outside to cancel
- Focus management
- Accessibility attributes

---

## Component Communication Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                         FormBuilder                              │
│                                                                  │
│  ┌──────────────┐                              ┌──────────────┐ │
│  │  FieldPalette│                              │              │ │
│  │  (draggable) │────drag data────────────────▶│    Canvas    │ │
│  └──────────────┘                              │  (drop zone) │ │
│                                                  │              │ │
│                                      ┌───────────┴────────────┐  │
│                                      │                        │  │
│                                      ▼                        │  │
│                              ┌──────────────┐                │  │
│                              │ formStore    │◀───────────────┼──│
│                              │ (Zustand)    │                │  │
│                              └──────┬───────┘                │  │
│                                     │                        │  │
│              ┌──────────────────────┼──────────────────────┐ │  │
│              │                      │                      │ │  │
│              ▼                      ▼                      │ │  │
│      ┌───────────────┐    ┌─────────────────┐    ┌───────┐ │ │  │
│      │    Canvas     │    │  FormPreview    │    │Field  │ │ │  │
│      │ (edit mode)   │    │ (preview mode)  │    │Config.│ │ │  │
│      └───────────────┘    └─────────────────┘    └───────┘ │ │  │
│              │                      │                      │ │  │
│              │                      ▼                      │ │  │
│              │              ┌──────────────┐               │ │  │
│              │              │  FormField   │               │ │  │
│              │              │ (individual) │               │ │  │
│              │              └──────────────┘               │ │  │
│              │                                          │ │  │
│              └──────────────────────────────────────────┘ │  │
│                                                          │  │
└──────────────────────────────────────────────────────────┴──┘
                           │
                           ▼
                   ┌──────────────┐
                   │  MongoDB     │
                   │ (future)     │
                   └──────────────┘
```

---

## Props Interface Summary

### Common Props Across Components

| Component | Key Props |
|-----------|-----------|
| `FormBuilder` | None (uses store) |
| `Canvas` | None (uses store) |
| `FieldPalette` | None (uses store) |
| `FieldConfigurator` | None (uses store) |
| `FormPreview` | None (uses store) |
| `FormField` | `field`, `control`, `error` |
| `DraggableFieldItem` | `field`, `isDragging` |
| `SortableFieldItem` | `field`, `isSelected`, `onSelect`, `isDragging` |
| `DropZone` | `isOver`, `position` |
| `ConditionalRuleBuilder` | None (uses store) |
| `DependencyGraph` | None (uses store) |
| `ValidationRulesList` | `field`, `onUpdate` |
| `ConfirmModal` | `isOpen`, `title`, `message`, `onConfirm`, `onCancel` |

---

## Last Updated

Document generated for Project Structura - Phase 3 implementation.


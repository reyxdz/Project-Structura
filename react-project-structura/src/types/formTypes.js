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
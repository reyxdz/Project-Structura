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

/**
 * @typedef {Object} ConditionalRule
 * @property {string} id - Unique rule identifier
 * @property {string} triggerFieldId - ID of field to watch
 * @property {string} operator - Comparison operator (equals, contains, etc.)
 * @property {*} value - Value to compare against
 * @property {string} action - Action to perform (show, hide, enable, disable)
 */

/**
 * @typedef {Object} ConditionalLogic
 * @property {string} logicType - 'AND' or 'OR' for multiple rules
 * @property {Array<ConditionalRule>} rules - Array of conditional rules
 */

/**
 * @typedef {Object} FieldWithConditionals
 * @property {string} id - Field ID
 * @property {string} type - Field type
 * @property {string} label - Field label
 * @property {Array<ConditionalLogic>} conditionals - Array of conditional logic groups
 * @property {boolean} isVisible - Calculated visibility (default: true)
 * @property {boolean} isEnabled - Calculated enabled state (default: true)
 */

// Export field type constants
export const FIELD_TYPES = {
  // Top section
  HEADING: 'heading',
  FULL_NAME: 'fullName',
  EMAIL: 'email',
  ADDRESS: 'address',
  PHONE: 'phone',
  DATE: 'date',
  APPOINTMENT: 'appointment',
  SIGNATURE: 'signature',
  
  // Basic Elements
  SHORT_TEXT: 'shortText',
  LONG_TEXT: 'longText',
  TEXT: 'text',
  DROPDOWN: 'dropdown',
  SELECT: 'select',
  SINGLE_CHOICE: 'singleChoice',
  RADIO: 'radio',
  MULTIPLE_CHOICE: 'multipleChoice',
  CHECKBOX: 'checkbox',
  NUMBER: 'number',
  IMAGE: 'image',
  FILE: 'file',
  CAPTCHA: 'captcha',
  SPINNER: 'spinner',
  SUBMIT: 'submit',
  
  // Survey Elements
  INPUT_TABLE: 'inputTable',
  STAR_RATING: 'starRating',
  SCALE_RATING: 'scaleRating',
  
  // Page Elements
  DIVIDER: 'divider',
  SECTION_COLLAPSE: 'sectionCollapse',
  PAGE_BREAK: 'pageBreak',
  
  // Legacy
  TEXTAREA: 'textarea',
  PASSWORD: 'password',
  URL: 'url',
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

// Phase 3 - 1.1 - Add existing exports
export const CONDITIONAL_OPERATORS = {
  EQUALS: 'equals',
  NOT_EQUALS: 'notEquals',
  CONTAINS: 'contains',
  NOT_CONTAINS: 'notContains',
  STARTS_WITH: 'startsWith',
  ENDS_WITH: 'endsWith',
  GREATER_THAN: 'greaterThan',
  LESS_THAN: 'lessThan',
  GREATER_EQUAL: 'greaterEqual',
  LESS_EQUAL: 'lessEqual',
  IN_ARRAY: 'inArray',
  NOT_IN_ARRAY: 'notInArray',
  IS_EMPTY: 'isEmpty',
  IS_NOT_EMPTY: 'isNotEmpty',
  MATCHES_REGEX: 'matchesRegex',
};

export const CONDITIONAL_ACTIONS = {
  SHOW: 'show',
  HIDE: 'hide',
  ENABLE: 'enable',
  DISABLE: 'disable',
  SET_REQUIRED: 'setRequired',
  SET_NOT_REQUIRED: 'setNotRequired',
};

export const CONDITIONAL_LOGIC_TYPES = {
  AND: 'AND',
  OR: 'OR',
};
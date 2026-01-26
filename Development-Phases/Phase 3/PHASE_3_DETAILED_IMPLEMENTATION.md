# Phase 3: Complex Logic - Conditional Fields - Detailed Step-by-Step Guide

## Overview
Phase 3 focuses on implementing conditional field visibility. This allows fields to show/hide based on the values of other fields. This is a complex but powerful feature that makes forms dynamic and responsive to user input.

**Estimated Time:** 5-7 days
**Prerequisites:** Phase 1 & 2 complete, understanding of form state management

---

## Key Concepts to Understand

### Conditional Logic
A conditional rule determines when a field should be visible based on:
1. **Triggering Field**: The field being watched (e.g., "Do you have a phone?")
2. **Operator**: How to compare (equals, contains, greater than, etc.)
3. **Value**: What to compare against (e.g., "yes")
4. **Action**: What to do (show, hide, enable, disable)

### Example
```
IF "Do you have a phone?" EQUALS "yes"
THEN SHOW "Phone Number" field
```

---

## Step 1: Update Type Definitions

### 1.1 Update `src/types/formTypes.js`

Add new type definitions for conditionals:

```javascript
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

// Add to existing exports
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
```

---

## Step 2: Create Conditional Utility Functions

### 2.1 Create `src/utils/conditionalRules.js`

This file contains all the logic for evaluating conditions:

```javascript
import { CONDITIONAL_OPERATORS, CONDITIONAL_ACTIONS, CONDITIONAL_LOGIC_TYPES } from '../types/formTypes';

/**
 * Evaluate a single conditional operator
 * @param {*} fieldValue - Current value of the field
 * @param {string} operator - Comparison operator
 * @param {*} compareValue - Value to compare against
 * @returns {boolean} Whether the condition is true
 */
export const evaluateOperator = (fieldValue, operator, compareValue) => {
  if (fieldValue === undefined || fieldValue === null) {
    fieldValue = '';
  }

  switch (operator) {
    case CONDITIONAL_OPERATORS.EQUALS:
      return String(fieldValue) === String(compareValue);

    case CONDITIONAL_OPERATORS.NOT_EQUALS:
      return String(fieldValue) !== String(compareValue);

    case CONDITIONAL_OPERATORS.CONTAINS:
      return String(fieldValue).toLowerCase().includes(String(compareValue).toLowerCase());

    case CONDITIONAL_OPERATORS.NOT_CONTAINS:
      return !String(fieldValue).toLowerCase().includes(String(compareValue).toLowerCase());

    case CONDITIONAL_OPERATORS.STARTS_WITH:
      return String(fieldValue).toLowerCase().startsWith(String(compareValue).toLowerCase());

    case CONDITIONAL_OPERATORS.ENDS_WITH:
      return String(fieldValue).toLowerCase().endsWith(String(compareValue).toLowerCase());

    case CONDITIONAL_OPERATORS.GREATER_THAN:
      return Number(fieldValue) > Number(compareValue);

    case CONDITIONAL_OPERATORS.LESS_THAN:
      return Number(fieldValue) < Number(compareValue);

    case CONDITIONAL_OPERATORS.GREATER_EQUAL:
      return Number(fieldValue) >= Number(compareValue);

    case CONDITIONAL_OPERATORS.LESS_EQUAL:
      return Number(fieldValue) <= Number(compareValue);

    case CONDITIONAL_OPERATORS.IN_ARRAY:
      // compareValue should be an array
      return Array.isArray(compareValue) && compareValue.includes(fieldValue);

    case CONDITIONAL_OPERATORS.NOT_IN_ARRAY:
      return !Array.isArray(compareValue) || !compareValue.includes(fieldValue);

    case CONDITIONAL_OPERATORS.IS_EMPTY:
      return fieldValue === '' || fieldValue === null || fieldValue === undefined;

    case CONDITIONAL_OPERATORS.IS_NOT_EMPTY:
      return fieldValue !== '' && fieldValue !== null && fieldValue !== undefined;

    case CONDITIONAL_OPERATORS.MATCHES_REGEX:
      try {
        const regex = new RegExp(compareValue);
        return regex.test(String(fieldValue));
      } catch (error) {
        console.error('Invalid regex pattern:', compareValue);
        return false;
      }

    default:
      return false;
  }
};

/**
 * Evaluate a single conditional rule
 * @param {Object} rule - Conditional rule
 * @param {*} triggerFieldValue - Value of the trigger field
 * @returns {boolean} Whether the rule condition is met
 */
export const evaluateRule = (rule, triggerFieldValue) => {
  return evaluateOperator(triggerFieldValue, rule.operator, rule.value);
};

/**
 * Evaluate all rules in a conditional logic group
 * @param {Object} conditionalLogic - Conditional logic object with rules and logicType
 * @param {Object} previewData - Current form data
 * @param {Object} field - The field being evaluated
 * @param {Array} allFields - All fields in the form
 * @returns {boolean} Whether the conditions are met
 */
export const evaluateConditionalLogic = (conditionalLogic, previewData, field, allFields) => {
  if (!conditionalLogic || !conditionalLogic.rules || conditionalLogic.rules.length === 0) {
    return true;
  }

  const results = conditionalLogic.rules.map((rule) => {
    const triggerField = allFields.find((f) => f.id === rule.triggerFieldId);
    if (!triggerField) return false;

    const triggerFieldValue = previewData[rule.triggerFieldId];
    return evaluateRule(rule, triggerFieldValue);
  });

  // Apply AND/OR logic
  const logicType = conditionalLogic.logicType || CONDITIONAL_LOGIC_TYPES.AND;
  if (logicType === CONDITIONAL_LOGIC_TYPES.AND) {
    return results.every((result) => result === true);
  } else if (logicType === CONDITIONAL_LOGIC_TYPES.OR) {
    return results.some((result) => result === true);
  }

  return true;
};

/**
 * Determine if a field should be visible based on all its conditional rules
 * @param {Object} field - Field object with conditionals array
 * @param {Object} previewData - Current form data
 * @param {Array} allFields - All fields in the form
 * @returns {boolean} Whether field should be visible
 */
export const shouldFieldBeVisible = (field, previewData, allFields) => {
  if (!field.conditionals || field.conditionals.length === 0) {
    return true;
  }

  // If multiple conditional logic groups, use AND (all must pass)
  return field.conditionals.every((conditionalLogic) =>
    evaluateConditionalLogic(conditionalLogic, previewData, field, allFields)
  );
};

/**
 * Determine if a field should be enabled based on conditional actions
 * @param {Object} field - Field object with conditionals array
 * @param {Object} previewData - Current form data
 * @param {Array} allFields - All fields in the form
 * @returns {boolean} Whether field should be enabled
 */
export const shouldFieldBeEnabled = (field, previewData, allFields) => {
  if (!field.conditionals || field.conditionals.length === 0) {
    return true;
  }

  // Check if any rule has a DISABLE action and is true
  for (const conditionalLogic of field.conditionals) {
    const isMet = evaluateConditionalLogic(conditionalLogic, previewData, field, allFields);

    if (isMet) {
      for (const rule of conditionalLogic.rules) {
        if (rule.action === CONDITIONAL_ACTIONS.DISABLE) {
          return false;
        }
      }
    }
  }

  return true;
};

/**
 * Get operator label for display
 * @param {string} operator - Operator key
 * @returns {string} Display label
 */
export const getOperatorLabel = (operator) => {
  const labels = {
    [CONDITIONAL_OPERATORS.EQUALS]: 'equals',
    [CONDITIONAL_OPERATORS.NOT_EQUALS]: 'does not equal',
    [CONDITIONAL_OPERATORS.CONTAINS]: 'contains',
    [CONDITIONAL_OPERATORS.NOT_CONTAINS]: 'does not contain',
    [CONDITIONAL_OPERATORS.STARTS_WITH]: 'starts with',
    [CONDITIONAL_OPERATORS.ENDS_WITH]: 'ends with',
    [CONDITIONAL_OPERATORS.GREATER_THAN]: 'is greater than',
    [CONDITIONAL_OPERATORS.LESS_THAN]: 'is less than',
    [CONDITIONAL_OPERATORS.GREATER_EQUAL]: 'is greater than or equal to',
    [CONDITIONAL_OPERATORS.LESS_EQUAL]: 'is less than or equal to',
    [CONDITIONAL_OPERATORS.IN_ARRAY]: 'is in',
    [CONDITIONAL_OPERATORS.NOT_IN_ARRAY]: 'is not in',
    [CONDITIONAL_OPERATORS.IS_EMPTY]: 'is empty',
    [CONDITIONAL_OPERATORS.IS_NOT_EMPTY]: 'is not empty',
    [CONDITIONAL_OPERATORS.MATCHES_REGEX]: 'matches regex',
  };
  return labels[operator] || operator;
};

/**
 * Get action label for display
 * @param {string} action - Action key
 * @returns {string} Display label
 */
export const getActionLabel = (action) => {
  const labels = {
    [CONDITIONAL_ACTIONS.SHOW]: 'Show this field',
    [CONDITIONAL_ACTIONS.HIDE]: 'Hide this field',
    [CONDITIONAL_ACTIONS.ENABLE]: 'Enable this field',
    [CONDITIONAL_ACTIONS.DISABLE]: 'Disable this field',
    [CONDITIONAL_ACTIONS.SET_REQUIRED]: 'Make this field required',
    [CONDITIONAL_ACTIONS.SET_NOT_REQUIRED]: 'Make this field optional',
  };
  return labels[action] || action;
};

/**
 * Create a new conditional rule
 * @param {string} triggerFieldId - ID of field to trigger on
 * @param {string} operator - Comparison operator
 * @param {*} value - Value to compare
 * @param {string} action - Action to perform
 * @returns {Object} New conditional rule
 */
export const createConditionalRule = (triggerFieldId, operator, value, action) => {
  return {
    id: Math.random().toString(36).substr(2, 9),
    triggerFieldId,
    operator: operator || CONDITIONAL_OPERATORS.EQUALS,
    value: value || '',
    action: action || CONDITIONAL_ACTIONS.SHOW,
  };
};

/**
 * Create a new conditional logic group
 * @param {Array} rules - Array of rules
 * @param {string} logicType - AND or OR
 * @returns {Object} New conditional logic group
 */
export const createConditionalLogicGroup = (rules = [], logicType = CONDITIONAL_LOGIC_TYPES.AND) => {
  return {
    logicType,
    rules,
  };
};

/**
 * Get fields that trigger this field (dependency check)
 * @param {Object} field - Field to check
 * @param {Array} allFields - All fields in form
 * @returns {Array} Array of trigger field IDs
 */
export const getTriggerFields = (field, allFields) => {
  if (!field.conditionals) return [];

  const triggerIds = new Set();
  field.conditionals.forEach((conditionalLogic) => {
    conditionalLogic.rules.forEach((rule) => {
      triggerIds.add(rule.triggerFieldId);
    });
  });

  return Array.from(triggerIds);
};

/**
 * Detect circular dependencies in conditionals
 * @param {Object} field - Field to check
 * @param {Array} allFields - All fields in form
 * @returns {Array} Array of circular dependency paths, empty if none
 */
export const detectCircularDependencies = (field, allFields) => {
  const triggerIds = getTriggerFields(field, allFields);
  const circularPaths = [];

  const checkForCircle = (currentId, path = []) => {
    if (path.includes(currentId)) {
      circularPaths.push([...path, currentId]);
      return;
    }

    const currentField = allFields.find((f) => f.id === currentId);
    if (!currentField) return;

    const nextTriggers = getTriggerFields(currentField, allFields);
    nextTriggers.forEach((triggerId) => {
      checkForCircle(triggerId, [...path, currentId]);
    });
  };

  triggerIds.forEach((triggerId) => {
    checkForCircle(triggerId, [field.id]);
  });

  return circularPaths;
};
```

---

## Step 3: Update Field Store

### 3.1 Update `src/stores/formStore.js`

Add conditional field actions to the store:

```javascript
// Add these imports at the top
import { createConditionalLogicGroup, createConditionalRule, detectCircularDependencies } from '../utils/conditionalRules';

// Add these actions inside the create((set, get) => ({...})) function

// After existing removeField action, add:

  /**
   * Add conditional logic to a field
   */
  addConditional: (fieldId, conditionalLogic) => {
    set((state) => {
      const updatedFields = state.form.fields.map((field) => {
        if (field.id === fieldId) {
          const conditionals = field.conditionals || [];
          
          // Check for circular dependencies
          const circularDeps = detectCircularDependencies({
            ...field,
            conditionals: [...conditionals, conditionalLogic],
          }, state.form.fields);

          if (circularDeps.length > 0) {
            console.warn('Circular dependency detected:', circularDeps);
            return field; // Don't add if circular
          }

          return {
            ...field,
            conditionals: [...conditionals, conditionalLogic],
            metadata: {
              ...field.metadata,
              updatedAt: new Date().toISOString(),
            },
          };
        }
        return field;
      });

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

  /**
   * Update a conditional rule
   */
  updateConditional: (fieldId, conditionalIndex, rule, ruleIndex) => {
    set((state) => {
      const updatedFields = state.form.fields.map((field) => {
        if (field.id === fieldId) {
          const conditionals = [...field.conditionals];
          const updatedRules = [...conditionals[conditionalIndex].rules];
          updatedRules[ruleIndex] = rule;
          conditionals[conditionalIndex] = {
            ...conditionals[conditionalIndex],
            rules: updatedRules,
          };

          return {
            ...field,
            conditionals,
            metadata: {
              ...field.metadata,
              updatedAt: new Date().toISOString(),
            },
          };
        }
        return field;
      });

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

  /**
   * Remove a conditional rule
   */
  removeConditionalRule: (fieldId, conditionalIndex, ruleIndex) => {
    set((state) => {
      const updatedFields = state.form.fields.map((field) => {
        if (field.id === fieldId) {
          const conditionals = [...field.conditionals];
          const rules = [...conditionals[conditionalIndex].rules];
          rules.splice(ruleIndex, 1);

          if (rules.length === 0) {
            conditionals.splice(conditionalIndex, 1);
          } else {
            conditionals[conditionalIndex] = {
              ...conditionals[conditionalIndex],
              rules,
            };
          }

          return {
            ...field,
            conditionals: conditionals.length > 0 ? conditionals : null,
            metadata: {
              ...field.metadata,
              updatedAt: new Date().toISOString(),
            },
          };
        }
        return field;
      });

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

  /**
   * Remove all conditionals from a field
   */
  removeAllConditionals: (fieldId) => {
    set((state) => {
      const updatedFields = state.form.fields.map((field) => {
        if (field.id === fieldId) {
          return {
            ...field,
            conditionals: null,
            metadata: {
              ...field.metadata,
              updatedAt: new Date().toISOString(),
            },
          };
        }
        return field;
      });

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

  /**
   * Change logic type (AND/OR) for a conditional group
   */
  setConditionalLogicType: (fieldId, conditionalIndex, logicType) => {
    set((state) => {
      const updatedFields = state.form.fields.map((field) => {
        if (field.id === fieldId) {
          const conditionals = [...field.conditionals];
          conditionals[conditionalIndex] = {
            ...conditionals[conditionalIndex],
            logicType,
          };

          return {
            ...field,
            conditionals,
            metadata: {
              ...field.metadata,
              updatedAt: new Date().toISOString(),
            },
          };
        }
        return field;
      });

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
```

---

## Step 4: Create Conditional Builder Component

### 4.1 Create `src/components/FormBuilder/ConditionalRuleBuilder.jsx`

UI component for building conditional rules:

```javascript
import React from 'react';
import { useFormStore } from '../../stores/formStore';
import {
  CONDITIONAL_OPERATORS,
  CONDITIONAL_ACTIONS,
  CONDITIONAL_LOGIC_TYPES,
} from '../../types/formTypes';
import {
  createConditionalRule,
  createConditionalLogicGroup,
  getOperatorLabel,
  getActionLabel,
  getTriggerFields,
  detectCircularDependencies,
} from '../../utils/conditionalRules';
import './ConditionalRuleBuilder.css';

export default function ConditionalRuleBuilder({ fieldId }) {
  const form = useFormStore((state) => state.form);
  const selectedField = form.fields.find((f) => f.id === fieldId);
  const {
    addConditional,
    updateConditional,
    removeConditionalRule,
    removeAllConditionals,
    setConditionalLogicType,
  } = useFormStore();

  if (!selectedField) return null;

  const conditionals = selectedField.conditionals || [];
  const otherFields = form.fields.filter((f) => f.id !== fieldId);

  const handleAddConditional = () => {
    const newRule = createConditionalRule('', CONDITIONAL_OPERATORS.EQUALS, '', CONDITIONAL_ACTIONS.SHOW);
    const newLogicGroup = createConditionalLogicGroup([newRule], CONDITIONAL_LOGIC_TYPES.AND);
    addConditional(fieldId, newLogicGroup);
  };

  const handleAddRule = (conditionalIndex) => {
    const conditional = conditionals[conditionalIndex];
    const newRule = createConditionalRule('', CONDITIONAL_OPERATORS.EQUALS, '', CONDITIONAL_ACTIONS.SHOW);
    const newRules = [...conditional.rules, newRule];

    updateConditional(fieldId, conditionalIndex, { ...conditional, rules: newRules });
  };

  const handleRuleChange = (conditionalIndex, ruleIndex, field, value) => {
    const conditional = conditionals[conditionalIndex];
    const rule = { ...conditional.rules[ruleIndex], [field]: value };

    // Validate circular dependency if trigger field changed
    if (field === 'triggerFieldId') {
      const testField = {
        ...selectedField,
        conditionals: [
          ...conditionals.slice(0, conditionalIndex),
          {
            ...conditional,
            rules: [
              ...conditional.rules.slice(0, ruleIndex),
              rule,
              ...conditional.rules.slice(ruleIndex + 1),
            ],
          },
          ...conditionals.slice(conditionalIndex + 1),
        ],
      };

      const circularDeps = detectCircularDependencies(testField, form.fields);
      if (circularDeps.length > 0) {
        alert(
          'This would create a circular dependency. The field you selected depends on this field.'
        );
        return;
      }
    }

    updateConditional(fieldId, conditionalIndex, rule, ruleIndex);
  };

  const handleRemoveRule = (conditionalIndex, ruleIndex) => {
    removeConditionalRule(fieldId, conditionalIndex, ruleIndex);
  };

  const handleRemoveAllConditionals = () => {
    if (confirm('Remove all conditional rules from this field?')) {
      removeAllConditionals(fieldId);
    }
  };

  const handleLogicTypeChange = (conditionalIndex, logicType) => {
    setConditionalLogicType(fieldId, conditionalIndex, logicType);
  };

  return (
    <div className="conditional-rule-builder">
      <div className="conditional-header">
        <h4>Conditional Visibility Rules</h4>
        {conditionals.length > 0 && (
          <button
            className="btn-icon btn-danger-text"
            onClick={handleRemoveAllConditionals}
            title="Remove all conditionals"
          >
            ✕ Clear All
          </button>
        )}
      </div>

      {conditionals.length === 0 ? (
        <div className="no-conditionals">
          <p>No conditional rules. This field is always visible.</p>
          <button className="btn btn-secondary" onClick={handleAddConditional}>
            + Add Conditional Rule
          </button>
        </div>
      ) : (
        <div className="conditionals-list">
          {conditionals.map((conditional, conditionalIndex) => (
            <div key={`conditional-${conditionalIndex}`} className="conditional-group">
              <div className="conditional-group-header">
                <span className="group-label">If</span>
                <select
                  className="logic-type-select"
                  value={conditional.logicType}
                  onChange={(e) => handleLogicTypeChange(conditionalIndex, e.target.value)}
                >
                  <option value={CONDITIONAL_LOGIC_TYPES.AND}>ALL conditions are true</option>
                  <option value={CONDITIONAL_LOGIC_TYPES.OR}>ANY condition is true</option>
                </select>
              </div>

              {conditional.rules.map((rule, ruleIndex) => (
                <ConditionalRuleRow
                  key={`rule-${ruleIndex}`}
                  rule={rule}
                  ruleIndex={ruleIndex}
                  conditionalIndex={conditionalIndex}
                  otherFields={otherFields}
                  onRuleChange={handleRuleChange}
                  onRemoveRule={handleRemoveRule}
                  isFirstRule={ruleIndex === 0}
                  logicType={conditional.logicType}
                />
              ))}

              <button
                className="btn-text btn-secondary"
                onClick={() => handleAddRule(conditionalIndex)}
              >
                + Add Another Condition
              </button>
            </div>
          ))}

          <button className="btn btn-secondary" onClick={handleAddConditional}>
            + Add Rule Group
          </button>
        </div>
      )}
    </div>
  );
}

function ConditionalRuleRow({
  rule,
  ruleIndex,
  conditionalIndex,
  otherFields,
  onRuleChange,
  onRemoveRule,
  isFirstRule,
  logicType,
}) {
  const triggerField = otherFields.find((f) => f.id === rule.triggerFieldId);

  return (
    <div className="conditional-rule">
      {!isFirstRule && <div className="rule-connector">{logicType}</div>}

      <div className="rule-content">
        <select
          className="rule-field-select"
          value={rule.triggerFieldId}
          onChange={(e) =>
            onRuleChange(conditionalIndex, ruleIndex, 'triggerFieldId', e.target.value)
          }
        >
          <option value="">Select field...</option>
          {otherFields.map((field) => (
            <option key={field.id} value={field.id}>
              {field.label}
            </option>
          ))}
        </select>

        {rule.triggerFieldId && (
          <>
            <select
              className="rule-operator-select"
              value={rule.operator}
              onChange={(e) =>
                onRuleChange(conditionalIndex, ruleIndex, 'operator', e.target.value)
              }
            >
              {Object.entries(CONDITIONAL_OPERATORS).map(([key, value]) => (
                <option key={value} value={value}>
                  {getOperatorLabel(value)}
                </option>
              ))}
            </select>

            {![
              CONDITIONAL_OPERATORS.IS_EMPTY,
              CONDITIONAL_OPERATORS.IS_NOT_EMPTY,
            ].includes(rule.operator) && (
              <input
                type="text"
                className="rule-value-input"
                value={rule.value}
                onChange={(e) =>
                  onRuleChange(conditionalIndex, ruleIndex, 'value', e.target.value)
                }
                placeholder="Enter value..."
              />
            )}
          </>
        )}

        <select
          className="rule-action-select"
          value={rule.action}
          onChange={(e) => onRuleChange(conditionalIndex, ruleIndex, 'action', e.target.value)}
        >
          {Object.entries(CONDITIONAL_ACTIONS).map(([key, value]) => (
            <option key={value} value={value}>
              {getActionLabel(value)}
            </option>
          ))}
        </select>

        <button
          className="btn-icon btn-danger-text"
          onClick={() => onRemoveRule(conditionalIndex, ruleIndex)}
          title="Remove this condition"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
```

### 4.2 Create `src/components/FormBuilder/ConditionalRuleBuilder.css`

```css
.conditional-rule-builder {
  background-color: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 12px;
  margin-top: 16px;
}

.conditional-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.conditional-header h4 {
  margin: 0;
  font-size: 13px;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 12px;
  transition: color 0.2s ease;
}

.btn-danger-text {
  color: #f44336;
}

.btn-danger-text:hover {
  color: #d32f2f;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.btn-text {
  background: none;
  border: none;
  color: #2196f3;
  cursor: pointer;
  padding: 0;
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
}

.btn-text:hover {
  text-decoration: underline;
}

.no-conditionals {
  text-align: center;
  padding: 16px 0;
  color: #999;
}

.no-conditionals p {
  margin: 0 0 12px 0;
  font-size: 13px;
}

.conditionals-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.conditional-group {
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 12px;
}

.conditional-group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.group-label {
  font-size: 12px;
  font-weight: 500;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.logic-type-select {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 12px;
  color: #333;
  background-color: white;
}

.conditional-rule {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
  padding: 0;
}

.rule-connector {
  font-size: 11px;
  font-weight: 600;
  color: #2196f3;
  text-align: center;
  padding: 4px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.rule-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.rule-field-select,
.rule-operator-select,
.rule-value-input,
.rule-action-select {
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 12px;
  background-color: white;
  color: #333;
}

.rule-field-select {
  flex: 0 1 150px;
  min-width: 150px;
}

.rule-operator-select {
  flex: 0 1 120px;
  min-width: 120px;
}

.rule-value-input {
  flex: 1;
  min-width: 80px;
}

.rule-action-select {
  flex: 0 1 140px;
  min-width: 140px;
}

.rule-field-select:focus,
.rule-operator-select:focus,
.rule-value-input:focus,
.rule-action-select:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}
```

---

## Step 5: Update Field Configurator

### 5.1 Update `src/components/FormBuilder/FieldConfigurator.jsx`

Add conditional builder to the field configurator:

```javascript
// Add this import at the top
import ConditionalRuleBuilder from './ConditionalRuleBuilder';

// In the return statement, add this before the config-actions div:

<div className="config-section">
  <ConditionalRuleBuilder fieldId={selectedFieldId} />
</div>
```

---

## Step 6: Update Form Preview

### 6.1 Update `src/components/FormPreview/FormPreview.jsx`

Add conditional visibility to field rendering:

```javascript
// Add these imports
import { shouldFieldBeVisible, shouldFieldBeEnabled } from '../../utils/conditionalRules';

// In your FormPreview component, modify the field rendering:

// Replace the existing field mapping with this:
{form.fields.map((field) => {
  // Check if field should be visible based on conditionals
  const isVisible = shouldFieldBeVisible(field, previewData, form.fields);
  const isEnabled = shouldFieldBeEnabled(field, previewData, form.fields);

  if (!isVisible) {
    return null; // Don't render hidden fields
  }

  return (
    <FormField
      key={field.id}
      field={field}
      value={previewData[field.id] || ''}
      onChange={(value) => setPreviewData({ ...previewData, [field.id]: value })}
      disabled={!isEnabled}
    />
  );
})}
```

---

## Step 7: Create Dependency Graph Visualization (Optional)

### 7.1 Create `src/components/FormBuilder/DependencyGraph.jsx`

Visualize field dependencies:

```javascript
import React from 'react';
import { useFormStore } from '../../stores/formStore';
import { getTriggerFields, detectCircularDependencies } from '../../utils/conditionalRules';
import './DependencyGraph.css';

export default function DependencyGraph() {
  const form = useFormStore((state) => state.form);

  // Build dependency map
  const dependencyMap = {};
  form.fields.forEach((field) => {
    const triggers = getTriggerFields(field, form.fields);
    if (triggers.length > 0) {
      dependencyMap[field.id] = triggers;
    }
  });

  // Check for circular dependencies
  const circularDependencies = [];
  form.fields.forEach((field) => {
    const circles = detectCircularDependencies(field, form.fields);
    if (circles.length > 0) {
      circularDependencies.push({ field: field.label, circles });
    }
  });

  if (Object.keys(dependencyMap).length === 0) {
    return (
      <div className="dependency-graph">
        <p>No conditional dependencies</p>
      </div>
    );
  }

  return (
    <div className="dependency-graph">
      <h4>Field Dependencies</h4>
      
      {circularDependencies.length > 0 && (
        <div className="warning">
          <strong>⚠️ Circular Dependencies Detected:</strong>
          {circularDependencies.map((item, idx) => (
            <div key={idx}>
              {item.field}: {item.circles.map((c) => c.join(' → ')).join(', ')}
            </div>
          ))}
        </div>
      )}

      <ul className="dependency-list">
        {Object.entries(dependencyMap).map(([fieldId, triggers]) => {
          const field = form.fields.find((f) => f.id === fieldId);
          return (
            <li key={fieldId}>
              <strong>{field.label}</strong> depends on:
              <ul>
                {triggers.map((triggerId) => {
                  const triggerField = form.fields.find((f) => f.id === triggerId);
                  return <li key={triggerId}>{triggerField.label}</li>;
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
```

### 7.2 Create `src/components/FormBuilder/DependencyGraph.css`

```css
.dependency-graph {
  background-color: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 12px;
  margin-top: 16px;
  font-size: 12px;
}

.dependency-graph h4 {
  margin: 0 0 12px 0;
  font-size: 13px;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dependency-graph p {
  margin: 0;
  color: #999;
}

.dependency-list {
  margin: 0;
  padding-left: 20px;
  list-style: none;
}

.dependency-list li {
  margin-bottom: 8px;
  color: #333;
}

.dependency-list li ul {
  margin: 4px 0 0 0;
  padding-left: 20px;
  color: #666;
}

.warning {
  background-color: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 3px;
  padding: 8px 12px;
  margin-bottom: 12px;
  color: #856404;
  font-size: 12px;
}

.warning strong {
  display: block;
  margin-bottom: 4px;
}

.warning div {
  margin-bottom: 4px;
}
```

---

## Step 8: Test Conditional Logic

### 8.1 Manual Testing Steps

1. **Create a test form with 2 fields:**
   - Field 1: "Do you have a phone?" (Yes/No Select)
   - Field 2: "Phone Number" (Text Input)

2. **Add conditional to Field 2:**
   - Trigger: "Do you have a phone?"
   - Operator: "equals"
   - Value: "yes"
   - Action: "Show"

3. **Test in preview:**
   - When Field 1 = "yes", Field 2 should be visible
   - When Field 1 = "no", Field 2 should be hidden

4. **Test with multiple conditions:**
   - Create a form with conditions using AND/OR logic
   - Verify behavior matches expectations

5. **Test circular dependency prevention:**
   - Try to create a circular dependency
   - Verify the system prevents it with a warning

---

## Step 9: Add Conditional Display to Canvas

### 9.1 Update `src/components/FormBuilder/SortableFieldItem.jsx`

Add visual indicator for conditional fields:

```javascript
// Add this in the JSX where you show the field type:

{field.conditionals && field.conditionals.length > 0 && (
  <span className="field-conditional-badge" title="Has conditional visibility">
    ⚙️
  </span>
)}
```

### 9.2 Update `src/components/FormBuilder/FieldItem.css`

Add styling for the badge:

```css
.field-conditional-badge {
  display: inline-block;
  margin-left: 4px;
  font-size: 11px;
  cursor: help;
}
```

---

## Checklist - Phase 3 Complete

- [ ] Updated `formTypes.js` with conditional type definitions
- [ ] Created `conditionalRules.js` with evaluation logic
- [ ] Updated `formStore.js` with conditional actions
- [ ] Created `ConditionalRuleBuilder.jsx` component
- [ ] Created `ConditionalRuleBuilder.css` styling
- [ ] Updated `FieldConfigurator.jsx` to include ConditionalRuleBuilder
- [ ] Updated `FormPreview.jsx` to evaluate conditionals
- [ ] Created `DependencyGraph.jsx` component (optional)
- [ ] Updated `SortableFieldItem.jsx` with conditional badge
- [ ] Manual testing completed successfully
- [ ] Circular dependency detection working
- [ ] Form fields show/hide correctly based on conditions

---

## Testing Scenarios

### Scenario 1: Simple Show/Hide
- Create two fields
- Set Field 2 to show when Field 1 equals "yes"
- Verify it works in preview

### Scenario 2: Multiple Conditions with AND
- Create three fields
- Set Field 3 to show when (Field 1 = "yes" AND Field 2 = "option1")
- Verify it requires both conditions

### Scenario 3: Multiple Conditions with OR
- Create three fields
- Set Field 3 to show when (Field 1 = "yes" OR Field 2 = "option1")
- Verify it shows when either condition is true

### Scenario 4: Complex Nesting
- Create a form with multiple levels of dependencies
- Verify the dependency graph shows correct relationships
- Confirm circular detection prevents invalid setups

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Field not showing/hiding | Condition not triggered | Check previewData has correct field value |
| Circular dependency allowed | Missing validation | Verify detectCircularDependencies is called |
| Performance slow with many conditions | Too many evaluations | Memoize conditional evaluation |
| Conditionals lost on refresh | Not saved to form | Ensure conditionals saved in form schema |

---

## Next Steps

Once Phase 3 is complete, you're ready for:
- **Phase 4: Advanced Validation** - Add conditional validation rules
- **Phase 5: Persistence** - Save/load forms with conditionals

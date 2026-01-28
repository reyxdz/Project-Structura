// This file contains all the logic for evaluating conditions

import {CONDITIONAL_OPERATORS, CONDITIONAL_ACTIONS, CONDITIONAL_LOGIC_TYPES } from '../types/formTypes';

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
            return Number((fieldValue) > Number(compareValue));

        case CONDITIONAL_OPERATORS.LESS_THAN:
            return Number((fieldValue) < Number(compareValue));

        case CONDITIONAL_OPERATORS.GREATER_EQUAL:
            return Number((fieldValue) >= Number(compareValue));

        case CONDITIONAL_OPERATORS.LESS_EQUAL:
            return Number((fieldValue) <= Number(compareValue));

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
            } catch {
                console.error('Invalid regex pattern: ', compareValue);
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
    if(!conditionalLogic || !conditionalLogic.rules || conditionalLogic.rules.length === 0) {
        return true;
    }

    const results = conditionalLogic.rules.map((rule) => {
        const triggerField = allFields.find((f) => f.id === rule.triggerFieldId);
        if(!triggerField) return false;

        const triggerFieldValue = previewData[rule.triggerFieldId];
        return evaluateRule(rule, triggerFieldValue);
    });

    // Apply AND/OR logic
    const logicType = conditionalLogic.logicType || CONDITIONAL_LOGIC_TYPES.AND;
    if(logicType === CONDITIONAL_LOGIC_TYPES.AND) {
        return results.every((result) => result === true);
    } else if(logicType === CONDITIONAL_LOGIC_TYPES.OR) {
        return results.some((result) => result === true);
    }

    return true;
};

/**
 * Determine if a field should be visible based on all its conditional rules
 * @param {Object} field - Field object with conditional arrays
 * @param {Object} previewData - Current form data
 * @param {Array} allFields - All fields in the form
 * @returns {boolean} Whether field should be visible
 */

export const shouldFieldBeVisible = (field, previewData, allFields) => {
    if(!field.conditionals || field.conditionals.length === 0) {
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
                if(rule.action === CONDITIONAL_ACTIONS.DISABLE) {
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

export const getTriggerFields = (field) => {
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
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
// Convert field validation config to react-hook-form rules

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
                        message: rule.message || `Minimum of ${rule.value} characters required`,
                    };
                    break;

                case VALIDATION_TYPES.MAX_LENGTH:
                    rules.maxLength = {
                        value: parseInt(rule.value, 10),
                        message: rule.message || `Maximum of ${rule.value} characters allowed`,
                    };
                    break;

                case VALIDATION_TYPES.PATTERN:
                    rules.pattern = {
                        value: new RegExp(rule.value),
                        message: rule.message || 'Invalid format'
                    };
                    break;

                case VALIDATION_TYPES.EMAIL:
                    rules.pattern = {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: rule.message || 'Please enter a valid email address',
                    }
                    break;

                case VALIDATION_TYPES.PHONE:
                    rules.pattern = {
                        value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                        message: rule.message || 'Please enter a valid phone number',
                    }
                    break;

                case VALIDATION_TYPES.URL:
                    rules.pattern = {
                        value: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)$/,
                        message: rule.message || 'Please enter a valid URL'
                    };
                    break;

                default:
                    break;
            }
        });
    }

    return rules;
};


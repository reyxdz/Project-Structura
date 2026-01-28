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
                            rule.message || `Minimum of ${rule.value} characters required`
                        );
                    }
                    break;

                case VALIDATION_TYPES.MAX_LENGTH:
                    if (value && value.toString().length > parseInt(rule.value, 10)) {
                        errors.push(
                            rule.message || `Maximum of ${rule.value} characters allowed`
                        );
                    }
                    break;

                case VALIDATION_TYPES.PATTERN:
                    if (value && !new RegExp(rule.value).test(value)) {
                        errors.push(rule.message || 'Invalid format');
                    }
                    break;

                case VALIDATION_TYPES.EMAIL:
                    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        errors.push(rule.message || 'Please enter a valid email address');
                    }
                    break;

                case VALIDATION_TYPES.PHONE:
                    if (value && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(value)) {
                        errors.push(rule.message || 'Please enter a valid phone number');
                    }
                    break;

                case VALIDATION_TYPES.URL:
                    if (value && !/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(value)) {
                        errors.push(rule.message || 'Please enter a valid URL');
                    }
                    break;

                default:
                    break;
            }
        })
    }

    return errors;
}
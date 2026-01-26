/* Helper functions for field operations */

import { v4 as uuidv4 } from 'uuid';
import {FIELD_TYPES, VALIDATION_TYPES } from '../types/formTypes';

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
 * @param {string} Display label
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
}



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

    if(!field.label || field.label.trim() === ''){
        errors.push('Field label is required.');
    }

    if(!field.type){
        errors.push('Field type is required.');
    }

    if(fieldTypeAcceptsOptions(field.type)){
        if(!field.options || field.options.length === 0){
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
 * @returns {Object} Clone field
 */

export const cloneField = (field) => {
    return{
        ...field,
        id: uuidv4(),
        metadata:{
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
        :field
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
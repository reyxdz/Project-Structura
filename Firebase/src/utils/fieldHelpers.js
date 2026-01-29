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
    const field = {
        id: uuidv4(),
        type,
        label: `Field ${order + 1}`,
        placeholder: '',
        required: false,
        value: '',
        order,
        options: type === FIELD_TYPES.SELECT ||
                 type === FIELD_TYPES.RADIO ||
                 type === FIELD_TYPES.SINGLE_CHOICE ||
                 type === FIELD_TYPES.MULTIPLE_CHOICE ||
                 type === FIELD_TYPES.CHECKBOX ? [] : null,
        validation: [],
        conditional: null,
        helpText: '',
        metadata: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    };

    // Initialize heading-specific metadata
    if (type === FIELD_TYPES.HEADING) {
        field.label = 'Heading';
        field.placeholder = 'Type a subheader';
        field.metadata.headingSize = 'default';
        field.metadata.textAlignment = 'left';
    }

    // Initialize full name field
    if (type === FIELD_TYPES.FULL_NAME) {
        field.label = 'Name';
        field.metadata.firstNameLabel = 'First Name';
        field.metadata.lastNameLabel = 'Last Name';
    }

    // Initialize email field
    if (type === FIELD_TYPES.EMAIL) {
        field.label = 'Email';
        field.placeholder = '';
        field.metadata.sublabel = 'example@example.com';
    }

    // Initialize address field
    if (type === FIELD_TYPES.ADDRESS) {
        field.label = 'Address';
        field.metadata.streetAddress1 = 'Street Address';
        field.metadata.streetAddress2 = 'Street Address Line 2';
        field.metadata.city = 'City';
        field.metadata.stateProvince = 'State / Province';
        field.metadata.postalZipCode = 'Postal / Zip Code';
    }

    // Initialize phone field
    if (type === FIELD_TYPES.PHONE) {
        field.label = 'Phone Number';
        field.placeholder = '(000) 000-0000';
        field.metadata.sublabel = 'Please enter a valid phone number';
    }

    // Initialize date field
    if (type === FIELD_TYPES.DATE) {
        field.label = 'Date';
        field.placeholder = 'MM/DD/YYYY';
        field.metadata.separator = '/';
        field.metadata.sublabel = 'Date';
    }

    // Initialize appointment field
    if (type === FIELD_TYPES.APPOINTMENT) {
        field.label = 'Appointment';
        field.placeholder = '';
        field.metadata.slotDuration = '30'; // 15, 30, 45, 60, or 'custom'
        field.metadata.customSlotDuration = null; // For custom durations
        field.metadata.intervals = [ // Array of time intervals per day
            {
                id: 'interval-1',
                startTime: '09:00',
                endTime: '17:00',
                daysOfWeek: ['MON', 'TUE', 'WED', 'THU', 'FRI']
            }
        ];
        field.metadata.timezone = 'America/New York';
        field.metadata.sublabel = 'Select your preferred appointment date and time';
        // Runtime state (not persisted)
        field.metadata.selectedDate = null;
        field.metadata.selectedTime = null;
    }

    // Initialize signature field
    if (type === FIELD_TYPES.SIGNATURE) {
        field.label = 'Signature';
        field.placeholder = 'Sign Here';
    }

    // Initialize single choice field
    if (type === FIELD_TYPES.SINGLE_CHOICE) {
        field.label = 'Type a question';
        field.placeholder = '';
        field.options = [
            { label: 'Type option 1' },
            { label: 'Type option 2' },
            { label: 'Type option 3' },
            { label: 'Type option 4' },
        ];
    }

    // Initialize multiple choice field
    if (type === FIELD_TYPES.MULTIPLE_CHOICE) {
        field.label = 'Type a question';
        field.placeholder = '';
        field.options = [
            { label: 'Type option 1' },
            { label: 'Type option 2' },
            { label: 'Type option 3' },
            { label: 'Type option 4' },
        ];
    }

    return field;
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
        // Top section
        [FIELD_TYPES.HEADING]: 'Heading',
        [FIELD_TYPES.FULL_NAME]: 'Full Name',
        [FIELD_TYPES.EMAIL]: 'Email',
        [FIELD_TYPES.ADDRESS]: 'Address',
        [FIELD_TYPES.PHONE]: 'Phone',
        [FIELD_TYPES.DATE]: 'Date Picker',
        [FIELD_TYPES.APPOINTMENT]: 'Appointment',
        [FIELD_TYPES.SIGNATURE]: 'Signature',
        
        // Basic Elements
        [FIELD_TYPES.SHORT_TEXT]: 'Short Text',
        [FIELD_TYPES.LONG_TEXT]: 'Long Text',
        [FIELD_TYPES.PARAGRAPH]: 'Paragraph',
        [FIELD_TYPES.TEXT]: 'Text Input',
        [FIELD_TYPES.DROPDOWN]: 'Dropdown',
        [FIELD_TYPES.SELECT]: 'Select Dropdown',
        [FIELD_TYPES.SINGLE_CHOICE]: 'Single Choice',
        [FIELD_TYPES.RADIO]: 'Radio Button',
        [FIELD_TYPES.MULTIPLE_CHOICE]: 'Multiple Choice',
        [FIELD_TYPES.CHECKBOX]: 'Checkbox',
        [FIELD_TYPES.NUMBER]: 'Number',
        [FIELD_TYPES.IMAGE]: 'Image',
        [FIELD_TYPES.FILE]: 'File Upload',
        [FIELD_TYPES.TIME]: 'Time',
        [FIELD_TYPES.CAPTCHA]: 'Captcha',
        [FIELD_TYPES.SPINNER]: 'Spinner',
        [FIELD_TYPES.SUBMIT]: 'Submit',
        
        // Survey Elements
        [FIELD_TYPES.INPUT_TABLE]: 'Input Table',
        [FIELD_TYPES.STAR_RATING]: 'Star Rating',
        [FIELD_TYPES.SCALE_RATING]: 'Scale Rating',
        
        // Page Elements
        [FIELD_TYPES.DIVIDER]: 'Divider',
        [FIELD_TYPES.SECTION_COLLAPSE]: 'Section Collapse',
        [FIELD_TYPES.PAGE_BREAK]: 'Page Break',
        
        // Legacy
        [FIELD_TYPES.TEXTAREA]: 'Text Area',
        [FIELD_TYPES.PASSWORD]: 'Password',
        [FIELD_TYPES.URL]: 'Website URL',
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
                    ...(updates.metadata || {}),
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
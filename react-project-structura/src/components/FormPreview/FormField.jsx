// Individual form field renderer

import React from 'react';
import { Controller } from 'react-hook-form';
import { FIELD_TYPES } from '../../types/formTypes';
import { buildValidationRules } from '../../utils/ValidationRules';
import './FormField.css';

export default function FormField({ field, control, error }) {
    const validationRules = buildValidationRules(field);

    return (
        <div className = "form-field">
            {field.type !== FIELD_TYPES.CHECKBOX && (
                <label htmlFor = {field.id}>
                    {field.label}
                    {field.required && <span className = "required-asterisk">*</span>}
                </label>
            )}

            <Controller
                name = {field.id}
                control = {control}
                rules = {validationRules}
                defaultValue = {field.value || ''}
                render = {({ field: fieldProps }) => {
                    switch (field.type) {
                        case FIELD_TYPES.TEXT:
                            return (
                                <input
                                    {...fieldProps}
                                    type = "text"
                                    placeholder = {field.placeholder}
                                    className = {error ? 'input-error' : ''}
                                 />
                            );

                        case FIELD_TYPES.EMAIL:
                            const emailSublabel = field.metadata?.sublabel || '';
                            return (
                                <div className="email-field-wrapper">
                                    <input 
                                        {...fieldProps}
                                        type = "email"
                                        placeholder = ""
                                        className = {error ? 'input-error' : ''}
                                    />
                                    {emailSublabel && (
                                        <p className="email-field-sublabel">{emailSublabel}</p>
                                    )}
                                </div>
                            );
                        
                        case FIELD_TYPES.NUMBER:
                            return (
                                <input
                                    {...fieldProps}
                                    type = "number"
                                    placeholder = {field.placeholder}
                                    className = {error ? 'input-error' : ''}
                                />
                            );

                        case FIELD_TYPES.TEXTAREA:
                            return (
                                <textarea 
                                    {...fieldProps}
                                    placeholder = {field.placeholder}
                                    rows = "4"
                                    className = {error ? 'input-error' : ''}
                                />
                            );

                        case FIELD_TYPES.DATE:
                            return (
                                <input 
                                    {...fieldProps}
                                    type = "date"
                                    className = {error ? 'input-error' : ''}
                                />
                            );

                        case FIELD_TYPES.FILE:
                            return (
                                <input 
                                    {...fieldProps}
                                    type = "file"
                                    className = {error ? 'input-error' : ''}
                                />
                            );

                        case FIELD_TYPES.CHECKBOX:
                            return (
                                <div className = "checkbox-field">
                                    <input 
                                        {...fieldProps}
                                        type = "checkbox"
                                        id = {field.id}
                                    />
                                    <label htmlFor = {field.id}>
                                        {field.label}
                                        {field.required && <span className = "required-asterisk">*</span>}
                                    </label>
                                </div>
                            )

                        case FIELD_TYPES.RADIO:
                            return (
                                <div className = "radio-field">
                                    {field.options?.map((option, idx) => (
                                        <div key = {idx} className = "radio-option">
                                            <input 
                                                type = "radio"
                                                id = {`${field.id}-${idx}`}
                                                value = {option.value || option}
                                                {...fieldProps}
                                            />
                                            <label htmlFor = {`${field.id}-${idx}`}>
                                                {option.label || option}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            );

                        case FIELD_TYPES.SELECT:
                            return (
                                <select
                                    {...fieldProps}
                                    className = {error ? 'input-error' : ''}
                                >
                                    <option value = "">Select an option...</option>
                                    {field.options?.map((option, idx) => (
                                        <option key = {idx} value = {option.value || option}>
                                            {option.label || option}
                                        </option>
                                    ))}
                                </select>
                            );

                        case FIELD_TYPES.FULL_NAME:
                            const firstNameLabel = field.metadata?.firstNameLabel || 'First Name';
                            const lastNameLabel = field.metadata?.lastNameLabel || 'Last Name';
                            return (
                                <div className="full-name-field">
                                    <div className="full-name-input-group">
                                        <input
                                            type="text"
                                            className={`full-name-input ${error ? 'input-error' : ''}`}
                                            placeholder=""
                                            defaultValue={field.value?.firstName || ''}
                                        />
                                        <label className="full-name-label">{firstNameLabel}</label>
                                    </div>
                                    <div className="full-name-input-group">
                                        <input
                                            type="text"
                                            className={`full-name-input ${error ? 'input-error' : ''}`}
                                            placeholder=""
                                            defaultValue={field.value?.lastName || ''}
                                        />
                                        <label className="full-name-label">{lastNameLabel}</label>
                                    </div>
                                </div>
                            );

                        case FIELD_TYPES.HEADING:
                            const headingSize = field.metadata?.headingSize || 'default';
                            const textAlignment = field.metadata?.textAlignment || 'left';
                            return (
                                <div className={`heading-field heading-${headingSize} heading-${textAlignment}`}>
                                    <h2 className="heading-title">{field.label || 'Heading'}</h2>
                                    <p className="heading-subtitle">{field.placeholder || 'Type a subheader'}</p>
                                </div>
                            );

                        default:
                            return null;
                    }
                }}
            />

            {error && (
                <div className = "error-message">
                    {error.message}
                </div>
            )}

            {field.helpText && (
                <div className = "help-text">
                    {field.helpText}
                </div>
            )}
        </div>
    );
}
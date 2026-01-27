// Individual form field renderer

import React from 'react';
import { Controller } from 'react-hook-form';
import { FIELD_TYPES } from '../../types/formTypes';
import { buildValidationRules } from '../../utils/ValidationRules';
import './FormField.css';

export default function FormField({ field, control, error }) {
    const validationRules = buildValidationRules(field);

    // Handle non-input fields (like HEADING) that don't need form control
    if (field.type === FIELD_TYPES.HEADING) {
        const headingSize = field.metadata?.headingSize || 'default';
        const textAlignment = field.metadata?.textAlignment || 'left';
        return (
            <div className="form-field">
                <div className={`heading-field heading-${headingSize} heading-${textAlignment}`}>
                    <h2 className="heading-title">{field.label || 'Heading'}</h2>
                    <p className="heading-subtitle">{field.placeholder || 'Type a subheader'}</p>
                </div>
            </div>
        );
    }

    // Handle APPOINTMENT field
    if (field.type === FIELD_TYPES.APPOINTMENT) {
        const timeSlots = field.metadata?.timeSlots || [];
        const timezone = field.metadata?.timezone || 'America/New_York';
        const sublabel = field.metadata?.sublabel || '';

        return (
            <div className="form-field">
                <label htmlFor={field.id}>
                    {field.label}
                    {field.required && <span className="required-asterisk">*</span>}
                </label>
                <div className="appointment-field-wrapper">
                    <div className="appointment-main-container">
                        <div className="appointment-calendar-display">
                            <div className="appointment-date-input">
                                <input type="text" placeholder="MM/DD/YYYY" />
                                <svg className="appointment-calendar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                                    <path d="M16 2v4M8 2v4M3 10h18"></path>
                                </svg>
                            </div>
                            <div className="appointment-month-year">
                                <select disabled>
                                    <option>January</option>
                                </select>
                                <select disabled>
                                    <option>2026</option>
                                </select>
                            </div>
                            <div className="appointment-weekdays">
                                <div>SUN</div>
                                <div>MON</div>
                                <div>TUE</div>
                                <div>WED</div>
                                <div>THU</div>
                                <div>FRI</div>
                                <div>SAT</div>
                            </div>
                            <div className="appointment-calendar-grid">
                                {Array.from({ length: 35 }, (_, i) => (
                                    <div key={i} className="appointment-day">{i % 31 + 1}</div>
                                ))}
                            </div>
                        </div>
                        <div className="appointment-times">
                            <div className="appointment-date-display">Select Time</div>
                            <div className="appointment-time-slots">
                                {timeSlots.map((slot, idx) => (
                                    <button key={idx} className="appointment-time-slot" disabled>{slot}</button>
                                ))}
                            </div>
                            {timezone && (
                                <div className="appointment-timezone">{timezone}</div>
                            )}
                        </div>
                    </div>
                    {sublabel && <p className="appointment-sublabel">{sublabel}</p>}
                </div>
            </div>
        );
    }

    // Handle SIGNATURE field
    if (field.type === FIELD_TYPES.SIGNATURE) {
        const placeholder = field.placeholder || 'Sign Here';
        return (
            <div className="form-field">
                <label htmlFor={field.id}>
                    {field.label}
                    {field.required && <span className="required-asterisk">*</span>}
                </label>
                <div className="signature-field-wrapper">
                    <div className="signature-canvas">
                        <div className="signature-placeholder-display">{placeholder}</div>
                        <svg className="signature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </div>
                </div>
            </div>
        );
    }

    // Handle FULL_NAME field
    if (field.type === FIELD_TYPES.FULL_NAME) {
        const firstNameLabel = field.metadata?.firstNameLabel || 'First Name';
        const lastNameLabel = field.metadata?.lastNameLabel || 'Last Name';
        return (
            <div className="full-name-field">
                <label htmlFor={field.id}>
                    {field.label}
                    {field.required && <span className="required-asterisk">*</span>}
                </label>
                <div className="full-name-inputs-preview">
                    <div className="full-name-preview-group">
                        <input type="text" placeholder="" />
                        <p style={{fontSize: '12px', color: '#757575', margin: '4px 0 0 0', lineHeight: '1.4'}}>{firstNameLabel}</p>
                    </div>
                    <div className="full-name-preview-group">
                        <input type="text" placeholder="" />
                        <p style={{fontSize: '12px', color: '#757575', margin: '4px 0 0 0', lineHeight: '1.4'}}>{lastNameLabel}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Handle EMAIL field
    if (field.type === FIELD_TYPES.EMAIL) {
        const emailSublabel = field.metadata?.sublabel || '';
        return (
            <div className="email-field-wrapper">
                <label htmlFor={field.id}>
                    {field.label}
                    {field.required && <span className="required-asterisk">*</span>}
                </label>
                <input 
                    type="email"
                    placeholder={field.placeholder || ''}
                />
                {emailSublabel && (
                    <p style={{fontSize: '12px', color: '#757575', margin: '6px 0 0 0', lineHeight: '1.4'}}>{emailSublabel}</p>
                )}
            </div>
        );
    }

    // Handle ADDRESS field
    if (field.type === FIELD_TYPES.ADDRESS) {
        const streetAddress1 = field.metadata?.streetAddress1 || 'Street Address';
        const streetAddress2 = field.metadata?.streetAddress2 || 'Street Address Line 2';
        const city = field.metadata?.city || 'City';
        const stateProvince = field.metadata?.stateProvince || 'State / Province';
        const postalZipCode = field.metadata?.postalZipCode || 'Postal / Zip Code';
        return (
            <div className="address-field">
                <label htmlFor={field.id}>
                    {field.label}
                    {field.required && <span className="required-asterisk">*</span>}
                </label>
                <div className="address-inputs-preview">
                    <div className="address-input-group-preview">
                        <input type="text" placeholder="" />
                        <p style={{fontSize: '12px', color: '#757575', margin: '4px 0 0 0', lineHeight: '1.4'}}>{streetAddress1}</p>
                    </div>
                    <div className="address-input-group-preview">
                        <input type="text" placeholder="" />
                        <p style={{fontSize: '12px', color: '#757575', margin: '4px 0 0 0', lineHeight: '1.4'}}>{streetAddress2}</p>
                    </div>
                    <div className="address-row-preview">
                        <div className="address-col-preview">
                            <div className="address-input-group-preview">
                                <input type="text" placeholder="" />
                                <p style={{fontSize: '12px', color: '#757575', margin: '4px 0 0 0', lineHeight: '1.4'}}>{city}</p>
                            </div>
                        </div>
                        <div className="address-col-preview">
                            <div className="address-input-group-preview">
                                <input type="text" placeholder="" />
                                <p style={{fontSize: '12px', color: '#757575', margin: '4px 0 0 0', lineHeight: '1.4'}}>{stateProvince}</p>
                            </div>
                        </div>
                    </div>
                    <div className="address-input-group-preview">
                        <input type="text" placeholder="" />
                        <p style={{fontSize: '12px', color: '#757575', margin: '4px 0 0 0', lineHeight: '1.4'}}>{postalZipCode}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Handle PHONE field
    if (field.type === FIELD_TYPES.PHONE) {
        const phoneSublabel = field.metadata?.sublabel || '';
        return (
            <div className="phone-field-wrapper">
                <label htmlFor={field.id}>
                    {field.label}
                    {field.required && <span className="required-asterisk">*</span>}
                </label>
                <input type="tel" placeholder={field.placeholder || ''} />
                {phoneSublabel && (
                    <p style={{fontSize: '12px', color: '#757575', margin: '6px 0 0 0', lineHeight: '1.4'}}>{phoneSublabel}</p>
                )}
            </div>
        );
    }

    // Handle DATE field
    if (field.type === FIELD_TYPES.DATE) {
        const dateSublabel = field.metadata?.sublabel || '';
        const separator = field.metadata?.separator || '/';
        const placeholder = `MM${separator}DD${separator}YYYY`;
        return (
            <div className="date-field-wrapper">
                <label htmlFor={field.id}>
                    {field.label}
                    {field.required && <span className="required-asterisk">*</span>}
                </label>
                <div className="date-input-wrapper">
                    <input type="text" placeholder={placeholder} />
                    <svg className="calendar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                        <path d="M16 2v4M8 2v4M3 10h18"></path>
                    </svg>
                </div>
                {dateSublabel && (
                    <p style={{fontSize: '12px', color: '#757575', margin: '6px 0 0 0', lineHeight: '1.4'}}>{dateSublabel}</p>
                )}
            </div>
        );
    }

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

                        case FIELD_TYPES.APPOINTMENT: {
                            const appointmentSublabel = field.metadata?.sublabel || '';
                            const timeSlots = field.metadata?.timeSlots || ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];
                            return (
                                <div className="appointment-field-wrapper">
                                    <div className="appointment-main-container">
                                        <div className="appointment-calendar-display">
                                            <div className="appointment-input-container">
                                                <input 
                                                    {...fieldProps}
                                                    type="text"
                                                    placeholder="MM/DD/YYYY"
                                                    className={error ? 'input-error' : ''}
                                                />
                                                <svg className="appointment-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                                                    <path d="M16 2v4M8 2v4M3 10h18"></path>
                                                </svg>
                                            </div>
                                            <div className="appointment-month-year-display">
                                                <select>
                                                    <option>January</option>
                                                    <option>February</option>
                                                    <option>March</option>
                                                    <option>April</option>
                                                    <option>May</option>
                                                    <option>June</option>
                                                    <option>July</option>
                                                    <option>August</option>
                                                    <option>September</option>
                                                    <option>October</option>
                                                    <option>November</option>
                                                    <option>December</option>
                                                </select>
                                                <select>
                                                    <option>2024</option>
                                                    <option>2025</option>
                                                    <option>2026</option>
                                                    <option>2027</option>
                                                    <option>2028</option>
                                                </select>
                                            </div>
                                            <div className="appointment-weekdays-display">
                                                <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div>
                                            </div>
                                            <div className="appointment-days-grid">
                                                {Array.from({ length: 42 }, (_, i) => (
                                                    <div key={i} className="appointment-day-cell">{i % 31 + 1}</div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="appointment-times-display">
                                            <div className="appointment-selected-date">Select Date</div>
                                            <div className="appointment-time-buttons">
                                                {timeSlots.map((slot, idx) => (
                                                    <button key={idx} type="button" className="appointment-time-btn">{slot}</button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    {appointmentSublabel && (
                                        <p className="appointment-field-sublabel">{appointmentSublabel}</p>
                                    )}
                                </div>
                            );
                        }

                        case FIELD_TYPES.SIGNATURE: {
                            const placeholder = field.placeholder || 'Sign Here';
                            return (
                                <div className="signature-field-wrapper">
                                    <div className="signature-canvas">
                                        <div className="signature-placeholder-display">{placeholder}</div>
                                        <svg className="signature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                    </div>
                                </div>
                            );
                        }

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
// Field item shown during drag overlay

import React from 'react';
import { FIELD_TYPES } from '../../types/formTypes';
import './FieldItem.css';

export default function DraggableFieldItem({ field, isDragging }) {
    return (
        <div className = { `field-item ${isDragging ? 'dragging overlay' : ''}`}>
            {field.type === FIELD_TYPES.HEADING ? (
                <div className="heading-field-builder">
                    <div className={`heading-builder-content heading-${field.metadata?.headingSize || 'default'} heading-${field.metadata?.textAlignment || 'left'}`}>
                        <h2 className="heading-builder-title">{field.label || 'Heading'}</h2>
                        <p className="heading-builder-subtitle">{field.placeholder || 'Type a subheader'}</p>
                    </div>
                </div>
            ) : field.type === FIELD_TYPES.FULL_NAME ? (
                <div className="full-name-field-builder">
                    <div className="field-item-header">
                        <span className="field-label">
                            {field.label || 'Name'}
                            {field.required && <span className="required-asterisk">*</span>}
                        </span>
                    </div>
                    <div className="full-name-inputs-preview">
                        <div className="full-name-preview-group">
                            <input type="text" disabled />
                            <label>{field.metadata?.firstNameLabel || 'First Name'}</label>
                        </div>
                        <div className="full-name-preview-group">
                            <input type="text" disabled />
                            <label>{field.metadata?.lastNameLabel || 'Last Name'}</label>
                        </div>
                    </div>
                </div>
            ) : field.type === FIELD_TYPES.EMAIL ? (
                <div className="email-field-builder">
                    <div className="field-item-header">
                        <span className="field-label">
                            {field.label || 'Email'}
                            {field.required && <span className="required-asterisk">*</span>}
                        </span>
                    </div>
                    <input type="email" placeholder="" disabled />
                    {field.metadata?.sublabel && (
                        <p className="email-sublabel">{field.metadata.sublabel}</p>
                    )}
                </div>
            ) : field.type === FIELD_TYPES.ADDRESS ? (
                <div className="address-field-builder">
                    <div className="field-item-header">
                        <span className="field-label">
                            {field.label || 'Address'}
                            {field.required && <span className="required-asterisk">*</span>}
                        </span>
                    </div>
                    <div className="address-inputs-preview">
                        <div className="address-input-group-preview">
                            <input type="text" placeholder="" disabled />
                            <p className="address-sublabel">{field.metadata?.streetAddress1 || 'Street Address'}</p>
                        </div>
                        <div className="address-input-group-preview">
                            <input type="text" placeholder="" disabled />
                            <p className="address-sublabel">{field.metadata?.streetAddress2 || 'Street Address Line 2'}</p>
                        </div>
                        <div className="address-row-preview">
                            <div className="address-col-preview">
                                <div className="address-input-group-preview">
                                    <input type="text" placeholder="" disabled />
                                    <p className="address-sublabel">{field.metadata?.city || 'City'}</p>
                                </div>
                            </div>
                            <div className="address-col-preview">
                                <div className="address-input-group-preview">
                                    <input type="text" placeholder="" disabled />
                                    <p className="address-sublabel">{field.metadata?.stateProvince || 'State / Province'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="address-input-group-preview">
                            <input type="text" placeholder="" disabled />
                            <p className="address-sublabel">{field.metadata?.postalZipCode || 'Postal / Zip Code'}</p>
                        </div>
                    </div>
                </div>
            ) : field.type === FIELD_TYPES.PHONE ? (
                <div className="phone-field-builder">
                    <div className="field-item-header">
                        <span className="field-label">
                            {field.label || 'Phone Number'}
                            {field.required && <span className="required-asterisk">*</span>}
                        </span>
                    </div>
                    <input type="tel" placeholder="" disabled />
                    {field.metadata?.sublabel && (
                        <p className="phone-sublabel">{field.metadata.sublabel}</p>
                    )}
                </div>
            ) : field.type === FIELD_TYPES.DATE ? (
                <div className="date-field-builder">
                    <div className="field-item-header">
                        <span className="field-label">
                            {field.label || 'Date'}
                            {field.required && <span className="required-asterisk">*</span>}
                        </span>
                    </div>
                    <div className="date-input-wrapper">
                        <input type="text" placeholder={`MM${field.metadata?.separator || '/'}DD${field.metadata?.separator || '/'}YYYY`} disabled />
                        <svg className="date-calendar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                            <path d="M16 2v4M8 2v4M3 10h18"></path>
                        </svg>
                    </div>
                    {field.metadata?.sublabel && (
                        <p className="date-sublabel">{field.metadata.sublabel}</p>
                    )}
                </div>
            ) : (
                <>
                    <div className = "field-item-header">
                        <span className = "field-label">
                            {field.label}
                            {field.required && <span className="required-asterisk">*</span>}
                        </span>
                    </div>
                </>
            )}
        </div>
    );
}
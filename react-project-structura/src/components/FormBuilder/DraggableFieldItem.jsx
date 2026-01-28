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
            ) : field.type === FIELD_TYPES.APPOINTMENT ? (
                <div className="appointment-field-builder">
                    <div className="field-item-header">
                        <span className="field-label">
                            {field.label || 'Appointment'}
                            {field.required && <span className="required-asterisk">*</span>}
                        </span>
                    </div>
                    <div className="appointment-picker-preview">
                        <div className="appointment-calendar-wrapper">
                            <div className="appointment-date-input">
                                <input type="text" placeholder="MM/DD/YYYY" disabled />
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
                                {field.metadata?.timeSlots?.map((slot, idx) => (
                                    <button key={idx} className="appointment-time-slot" disabled>{slot}</button>
                                ))}
                            </div>
                            {field.metadata?.timezone && (
                                <div className="appointment-timezone">{field.metadata.timezone}</div>
                            )}
                        </div>
                    </div>
                    {field.metadata?.sublabel && (
                        <p className="appointment-sublabel">{field.metadata.sublabel}</p>
                    )}
                </div>
            ) : field.type === FIELD_TYPES.SIGNATURE ? (
                <div className="signature-field-builder">
                    <div className="field-item-header">
                        <span className="field-label">
                            {field.label || 'Signature'}
                            {field.required && <span className="required-asterisk">*</span>}
                        </span>
                    </div>
                    <div className="signature-canvas-preview">
                        <div className="signature-placeholder-text">{field.placeholder || 'Sign Here'}</div>
                        <svg className="signature-pen-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </div>
                </div>
            ) : field.type === FIELD_TYPES.SHORT_TEXT ? (
                <div className="short-text-field-builder">
                    <div className="field-item-header">
                        <span className="field-label">
                            {field.label || 'Short Text'}
                            {field.required && <span className="required-asterisk">*</span>}
                        </span>
                    </div>
                    <input type="text" placeholder={field.placeholder || ''} disabled />
                </div>
            ) : field.type === FIELD_TYPES.LONG_TEXT ? (
                <div className="long-text-field-builder">
                    <div className="field-item-header">
                        <span className="field-label">
                            {field.label || 'Long Text'}
                            {field.required && <span className="required-asterisk">*</span>}
                        </span>
                    </div>
                    <textarea placeholder={field.placeholder || ''} rows="4" disabled />
                </div>
            ) : field.type === FIELD_TYPES.DROPDOWN || field.type === FIELD_TYPES.SELECT ? (
                <div className="dropdown-field-builder">
                    <div className="field-item-header">
                        <span className="field-label">
                            {field.label || 'Dropdown'}
                            {field.required && <span className="required-asterisk">*</span>}
                        </span>
                    </div>
                    <select disabled>
                        <option>Select an option...</option>
                        {field.options?.map((opt, idx) => (
                            <option key={idx}>{opt.label || opt}</option>
                        ))}
                    </select>
                </div>
            ) : field.type === FIELD_TYPES.SINGLE_CHOICE ? (
                <div className="single-choice-field-builder">
                    <div className="field-item-header">
                        <span className="field-label">
                            {field.label || 'Single Choice'}
                            {field.required && <span className="required-asterisk">*</span>}
                        </span>
                    </div>
                    <div className="radio-options-builder">
                        {field.options?.map((opt, idx) => (
                            <div key={idx} className="radio-option-builder">
                                <input type="radio" disabled />
                                <label>{opt.label || opt}</label>
                            </div>
                        ))}
                    </div>
                </div>
            ) : field.type === FIELD_TYPES.MULTIPLE_CHOICE ? (
                <div className="multiple-choice-field-builder">
                    <div className="field-item-header">
                        <span className="field-label">
                            {field.label || 'Multiple Choice'}
                            {field.required && <span className="required-asterisk">*</span>}
                        </span>
                    </div>
                    <div className="checkbox-options-builder">
                        {field.options?.map((opt, idx) => (
                            <div key={idx} className="checkbox-option-builder">
                                <input type="checkbox" disabled />
                                <label>{opt.label || opt}</label>
                            </div>
                        ))}
                    </div>
                </div>
            ) : field.type === FIELD_TYPES.NUMBER ? (
                <div className="number-field-builder">
                    <div className="field-item-header">
                        <span className="field-label">
                            {field.label || 'Number'}
                            {field.required && <span className="required-asterisk">*</span>}
                        </span>
                    </div>
                    <input type="number" placeholder={field.placeholder || ''} disabled />
                </div>
            ) : field.type === FIELD_TYPES.IMAGE ? (
                <div className="image-field-builder">
                    <div className="field-item-header">
                        <span className="field-label">
                            {field.label || 'Image'}
                            {field.required && <span className="required-asterisk">*</span>}
                        </span>
                    </div>
                    <div className="image-placeholder">🖼️ Image Upload</div>
                </div>
            ) : field.type === FIELD_TYPES.FILE ? (
                <div className="file-field-builder">
                    <div className="field-item-header">
                        <span className="field-label">
                            {field.label || 'File Upload'}
                            {field.required && <span className="required-asterisk">*</span>}
                        </span>
                    </div>
                    <div className="file-placeholder">📎 Click to upload or drag file</div>
                </div>
            ) : field.type === FIELD_TYPES.TIME ? (
                <div className="time-field-builder">
                    <div className="field-item-header">
                        <span className="field-label">
                            {field.label || 'Time'}
                            {field.required && <span className="required-asterisk">*</span>}
                        </span>
                    </div>
                    <input type="time" disabled />
                </div>
            ) : field.type === FIELD_TYPES.STAR_RATING ? (
                <div className="star-rating-field-builder">
                    <div className="field-item-header">
                        <span className="field-label">
                            {field.label || 'Star Rating'}
                            {field.required && <span className="required-asterisk">*</span>}
                        </span>
                    </div>
                    <div className="stars-preview">
                        {Array.from({length: field.metadata?.maxRating || 5}).map((_, i) => (
                            <span key={i} className="star">★</span>
                        ))}
                    </div>
                </div>
            ) : field.type === FIELD_TYPES.SCALE_RATING ? (
                <div className="scale-rating-field-builder">
                    <div className="field-item-header">
                        <span className="field-label">
                            {field.label || 'Scale Rating'}
                            {field.required && <span className="required-asterisk">*</span>}
                        </span>
                    </div>
                    <div className="scale-labels-preview">
                        <span>{field.metadata?.minLabel || 'Not Satisfied'}</span>
                        <span>{field.metadata?.maxLabel || 'Very Satisfied'}</span>
                    </div>
                    <div className="scale-numbers">
                        {Array.from({length: field.metadata?.scaleRange || 5}).map((_, i) => (
                            <span key={i} className="scale-num">{i + 1}</span>
                        ))}
                    </div>
                </div>
            ) : field.type === FIELD_TYPES.INPUT_TABLE ? (
                <div className="input-table-field-builder">
                    <div className="field-item-header">
                        <span className="field-label">
                            {field.label || 'Input Table'}
                            {field.required && <span className="required-asterisk">*</span>}
                        </span>
                    </div>
                    <div className="table-preview">
                        <strong>Table with {field.metadata?.columns?.length || 0} columns × {field.metadata?.rows || 3} rows</strong>
                    </div>
                </div>
            ) : field.type === FIELD_TYPES.DIVIDER ? (
                <div className="divider-field-builder">
                    <hr className="divider-preview" />
                </div>
            ) : field.type === FIELD_TYPES.SECTION_COLLAPSE ? (
                <div className="section-collapse-field-builder">
                    <div className="collapse-header-preview">
                        <span>▶</span>
                        <span className="collapse-title">{field.label || 'Collapsible Section'}</span>
                    </div>
                </div>
            ) : field.type === FIELD_TYPES.PAGE_BREAK ? (
                <div className="page-break-field-builder">
                    <div className="page-break-preview">
                        <div className="page-break-line" />
                        <span>Page Break</span>
                    </div>
                </div>
            ) : field.type === FIELD_TYPES.CAPTCHA ? (
                <div className="captcha-field-builder">
                    <div className="field-item-header">
                        <span className="field-label">
                            {field.label || 'CAPTCHA'}
                            {field.required && <span className="required-asterisk">*</span>}
                        </span>
                    </div>
                    <div className="captcha-preview">🔒 reCAPTCHA</div>
                </div>
            ) : field.type === FIELD_TYPES.SUBMIT ? (
                <div className="submit-field-builder">
                    <button className="submit-button-preview" disabled>
                        {field.label || 'Submit'}
                    </button>
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
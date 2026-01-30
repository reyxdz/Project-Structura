import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FIELD_TYPES } from '../../types/formTypes';
import './FieldItem.css';

export default function SortableFieldItem({
    field,
    isSelected,
    onSelect,
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isSortableDragging,
    } = useSortable({ id: field.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isSortableDragging ? 0 : 1,
    };

    const handleClick = () => {
        // Only select if not dragging
        if (!isSortableDragging) {
            onSelect();
        }
    };

    return (
        <div
            ref = {setNodeRef}
            style = {style}
            className = {`field-item ${isSelected ? 'selected' : ''} ${
                isSortableDragging ? 'dragging' : ''
            }`}
            onClick = {handleClick}
            {...attributes}
            {...(isSelected && listeners)}
        >
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
                </div>            ) : field.type === FIELD_TYPES.SINGLE_CHOICE ? (
                <div className="single-choice-field-builder">
                    <div className="field-item-header">
                        <span className="field-label">
                            {field.label || 'Type a question'}
                            {field.required && <span className="required-asterisk">*</span>}
                        </span>
                    </div>
                    <div className="radio-options-builder">
                        {field.options && field.options.length > 0 ? (
                            field.options.map((option, idx) => (
                                <div key={idx} className="radio-option-builder">
                                    <input type="radio" disabled />
                                    <label>{option.label || option}</label>
                                </div>
                            ))
                        ) : (
                            <div className="radio-option-builder">
                                <input type="radio" disabled />
                                <label>No options yet</label>
                            </div>
                        )}
                    </div>
                </div>            ) : field.type === FIELD_TYPES.ADDRESS ? (
                <div className="address-field-builder">
                    <div className="field-item-header">
                        <span className="field-label">
                            {field.label || 'Address'}
                            {field.required && <span className="required-asterisk">*</span>}
                        </span>
                    </div>
                    <div className="address-inputs-preview">
                        <input type="text" placeholder="" disabled />
                        <p className="address-sublabel">{field.metadata?.streetAddress1 || 'Street Address'}</p>
                        <input type="text" placeholder="" disabled />
                        <p className="address-sublabel">{field.metadata?.streetAddress2 || 'Street Address Line 2'}</p>
                        <div className="address-row-preview">
                            <div className="address-col-preview">
                                <input type="text" placeholder="" disabled />
                                <p className="address-sublabel">{field.metadata?.city || 'City'}</p>
                            </div>
                            <div className="address-col-preview">
                                <input type="text" placeholder="" disabled />
                                <p className="address-sublabel">{field.metadata?.stateProvince || 'State / Province'}</p>
                            </div>
                        </div>
                        <input type="text" placeholder="" disabled />
                        <p className="address-sublabel">{field.metadata?.postalZipCode || 'Postal / Zip Code'}</p>
                    </div>
                </div>
            ) : field.type === FIELD_TYPES.PHONE ? (
                <div className="phone-field-builder">
                    <div className="field-item-header">
                        <span className="field-label">
                            {field.label || 'Phone'}
                            {field.required && <span className="required-asterisk">*</span>}
                        </span>
                    </div>
                    <input type="tel" placeholder="" disabled />
                    {field.metadata?.sublabel && (
                        <p className="phone-sublabel">{field.metadata.sublabel}</p>
                    )}
                </div>            ) : field.type === FIELD_TYPES.DATE ? (
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
                </div>            ) : field.type === FIELD_TYPES.APPOINTMENT ? (
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
                            <div className="appointment-date-display">Select Date</div>
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
            ) : field.type === FIELD_TYPES.MULTIPLE_CHOICE ? (
                <div className="multiple-choice-field-builder">
                    <div className="field-item-header">
                        <span className="field-label">
                            {field.label || 'Type a question'}
                            {field.required && <span className="required-asterisk">*</span>}
                        </span>
                    </div>
                    <div className="checkbox-options-builder">
                        {field.options && field.options.length > 0 ? (
                            field.options.map((option, idx) => (
                                <div key={idx} className="checkbox-option-builder">
                                    <input type="checkbox" disabled />
                                    <label>{option.label || option}</label>
                                </div>
                            ))
                        ) : (
                            <div className="checkbox-option-builder">
                                <input type="checkbox" disabled />
                                <label>No options yet</label>
                            </div>
                        )}
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
                    <input type="number" placeholder={field.placeholder || 'e.g., 23'} disabled />
                    <p className="field-sublabel">{field.metadata?.sublabel || ''}</p>
                </div>
            ) : field.type === FIELD_TYPES.IMAGE ? (
                <div className="image-field-builder">
                    <div className="field-item-header">
                        <span className="field-label">
                            {field.label || 'Image'}
                            {field.required && <span className="required-asterisk">*</span>}
                        </span>
                    </div>
                    <div 
                        className="image-placeholder-wrapper"
                        style={{
                            justifyContent: 
                                field.metadata?.imageAlignment === 'left' ? 'flex-start' :
                                field.metadata?.imageAlignment === 'right' ? 'flex-end' :
                                'center'
                        }}
                    >
                        {field.metadata?.imageData ? (
                            <img 
                                src={field.metadata.imageData} 
                                alt="Uploaded" 
                                style={{
                                    height: `${field.metadata?.imageHeight || 200}px`,
                                    width: `${field.metadata?.imageWidth || 200}px`,
                                    objectFit: 'contain',
                                    display: 'block'
                                }}
                            />
                        ) : (
                            <div className="image-placeholder">
                                <svg className="image-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                    <path d="M21 15l-5-5L5 21"></path>
                                </svg>
                                <p>No image uploaded</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : field.type === FIELD_TYPES.FILE ? (
                <div className="file-field-builder">
                    <div className="field-item-header">
                        <span className="field-label">
                            {field.label || 'File Upload'}
                        </span>
                    </div>
                    <div 
                        className="file-upload-placeholder-wrapper"
                        style={{
                            justifyContent: 'center'
                        }}
                    >
                        <div className="file-upload-placeholder">
                            <svg className="file-upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            <div>
                                <p>Browse Files</p>
                                <p className="file-upload-hint">Drag and drop files here</p>
                            </div>
                        </div>
                    </div>
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
            ) : field.type === FIELD_TYPES.SUBMIT ? (
                <div className="submit-field-builder">
                    {(() => {
                        const buttonWidth = field.metadata?.buttonWidth || '';
                        const buttonHeight = field.metadata?.buttonHeight || '';
                        const backgroundColor = field.metadata?.backgroundColor || '#0D47A1';
                        const fontColor = field.metadata?.fontColor || '#FFFFFF';
                        const borderStyle = field.metadata?.borderStyle || 'none';
                        const borderColor = field.metadata?.borderColor || '#000000';
                        const fontWeight = field.metadata?.fontWeight || '600';
                        const buttonAlignment = field.metadata?.buttonAlignment || 'center';
                        
                        const buttonHeightNum = buttonHeight ? parseInt(buttonHeight) : null;
                        const fontSize = buttonHeightNum ? Math.max(12, Math.floor(buttonHeightNum * 0.4)) : 'inherit';
                        
                        const buttonStyles = {
                            width: buttonWidth ? `${buttonWidth}%` : 'auto',
                            height: buttonHeight ? `${buttonHeight}%` : 'auto',
                            backgroundColor: backgroundColor,
                            color: fontColor,
                            borderStyle: borderStyle === 'none' ? 'none' : borderStyle,
                            borderWidth: borderStyle === 'none' ? '0' : '2px',
                            borderColor: borderStyle === 'none' ? 'transparent' : borderColor,
                            fontWeight: fontWeight,
                            fontSize: fontSize,
                            padding: buttonHeight ? '0 16px' : '10px 24px',
                            cursor: 'not-allowed',
                            transition: 'all 0.3s ease',
                            borderRadius: '4px',
                        };
                        
                        // Determine alignment
                        let justifyContent = 'center';
                        if (buttonAlignment === 'left') justifyContent = 'flex-start';
                        else if (buttonAlignment === 'right') justifyContent = 'flex-end';
                        
                        return (
                            <div style={{ display: 'flex', width: '100%', justifyContent }}>
                                <button 
                                    style={buttonStyles}
                                    disabled
                                >
                                    {field.label || 'Submit'}
                                </button>
                            </div>
                        );
                    })()}
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
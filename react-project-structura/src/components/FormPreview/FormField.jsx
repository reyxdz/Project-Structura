// Individual form field renderer

import React from 'react';
import { Controller } from 'react-hook-form';
import { FIELD_TYPES } from '../../types/formTypes';
import { buildValidationRules } from '../../utils/ValidationRules';
import './FormField.css';

export default function FormField({ field, control, error }) {
    const validationRules = buildValidationRules(field);

    // Appointment field state
    const [appointmentState, setAppointmentState] = React.useState(() => ({
        selectedDate: null,
        selectedTime: null,
        currentMonth: new Date().getMonth(),
        currentYear: new Date().getFullYear(),
    }));

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

    // Handle IMAGE field
    if (field.type === FIELD_TYPES.IMAGE) {
        const imageHeight = field.metadata?.imageHeight || 200;
        const imageWidth = field.metadata?.imageWidth || 200;
        const imageData = field.metadata?.imageData || null;
        const imageAlignment = field.metadata?.imageAlignment || 'center';

        return (
            <div className="image-field-wrapper">
                <label htmlFor={field.id}>
                    {field.label}
                    {field.required && <span className="required-asterisk">*</span>}
                </label>
                <div className="image-display-container" style={{
                    width: '100%',
                    border: '2px dashed #ccc',
                    borderRadius: '8px',
                    padding: '20px',
                    minHeight: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: imageAlignment === 'left' ? 'flex-start' : imageAlignment === 'right' ? 'flex-end' : 'center'
                }}>
                    {imageData ? (
                        <img 
                            src={imageData} 
                            alt="Uploaded" 
                            style={{
                                height: `${imageHeight}px`,
                                width: `${imageWidth}px`,
                                objectFit: 'contain',
                                display: 'block'
                            }}
                        />
                    ) : (
                        <div style={{color: '#999', fontSize: '14px'}}>
                            <svg className="image-upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '48px', height: '48px', margin: '0 auto 8px', color: '#ccc'}}>
                                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <path d="M21 15l-5-5L5 21"></path>
                            </svg>
                            <p>No image uploaded</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (field.type === FIELD_TYPES.FILE) {
        const maxFileSize = field.metadata?.maxFileSize || 5;
        const maxFileSizeUnit = field.metadata?.maxFileSizeUnit || 'mb';
        const acceptedFileTypes = field.metadata?.acceptedFileTypes || [];

        return (
            <div className="file-field-wrapper">
                <label htmlFor={field.id}>
                    {field.label}
                </label>
                <div className="file-upload-container" style={{
                    width: '100%',
                    border: '2px solid #aaa',
                    borderRadius: '12px',
                    padding: '40px',
                    minHeight: '140px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    background: '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                }}>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'flex-start',
                        gap: '20px',
                        color: '#333', 
                        fontSize: '14px',
                        width: '100%'
                    }}>
                        <svg style={{width: '56px', height: '56px', color: '#888', flexShrink: 0, marginTop: '2px'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        <div>
                            <p style={{ margin: '0 0 4px 0', fontWeight: '500', color: '#333' }}>Browse Files</p>
                            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#666', fontWeight: '400' }}>Drag and drop files here</p>
                            {acceptedFileTypes.length > 0 && (
                                <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>
                                    Accepted: {acceptedFileTypes.join(', ').toUpperCase()}<br />
                                    Max: {maxFileSize} {maxFileSizeUnit.toUpperCase()}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Handle SUBMIT field
    if (field.type === FIELD_TYPES.SUBMIT) {
        const buttonWidth = field.metadata?.buttonWidth || '';
        const buttonHeight = field.metadata?.buttonHeight || '';
        const backgroundColor = field.metadata?.backgroundColor || '#0D47A1';
        const fontColor = field.metadata?.fontColor || '#FFFFFF';
        const borderStyle = field.metadata?.borderStyle || 'none';
        const borderColor = field.metadata?.borderColor || '#000000';
        const fontWeight = field.metadata?.fontWeight || '600';
        const buttonAlignment = field.metadata?.buttonAlignment || 'center';
        
        // Calculate font size based on button height if provided
        const buttonHeightNum = buttonHeight ? parseInt(buttonHeight) : null;
        const fontSize = buttonHeightNum ? Math.max(12, Math.floor(buttonHeightNum * 0.4)) : 'inherit';
        
        // Build button styles
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
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            borderRadius: '4px',
        };
        
        // Determine alignment
        let justifyContent = 'center';
        if (buttonAlignment === 'left') justifyContent = 'flex-start';
        else if (buttonAlignment === 'right') justifyContent = 'flex-end';
        
        return (
            <div className="submit-field-wrapper" style={{ justifyContent }}>
                <button 
                    type="submit"
                    style={buttonStyles}
                >
                    {field.label || 'Submit'}
                </button>
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

                        case FIELD_TYPES.SHORT_TEXT: {
                            const sublabel = field.metadata?.sublabel || '';
                            return (
                                <div style={{ position: 'relative' }}>
                                    <input
                                        {...fieldProps}
                                        type = "text"
                                        placeholder = {field.placeholder}
                                        className = {error ? 'input-error' : ''}
                                    />
                                    {sublabel && (
                                        <p style={{
                                            fontSize: '12px',
                                            color: '#757575',
                                            margin: '6px 0 0 0',
                                            lineHeight: '1.4'
                                        }}>
                                            {sublabel}
                                        </p>
                                    )}
                                </div>
                            );
                        }

                        case FIELD_TYPES.NUMBER: {
                            const minValue = field.metadata?.minimumValue ?? '';
                            const maxValue = field.metadata?.maximumValue ?? '';
                            const sublabel = field.metadata?.sublabel || '';
                            
                            let validationError = '';
                            
                            if (fieldProps.value !== '' && fieldProps.value !== undefined && fieldProps.value !== null) {
                                const numVal = parseFloat(fieldProps.value);
                                if (minValue !== '' && !isNaN(parseFloat(minValue)) && numVal < parseFloat(minValue)) {
                                    validationError = `Must be at least ${minValue}`;
                                } else if (maxValue !== '' && !isNaN(parseFloat(maxValue)) && numVal > parseFloat(maxValue)) {
                                    validationError = `Must not exceed ${maxValue}`;
                                }
                            }

                            return (
                                <div style={{ position: 'relative' }}>
                                    <input
                                        {...fieldProps}
                                        type = "number"
                                        placeholder = {field.placeholder}
                                        className = {error ? 'input-error' : ''}
                                    />
                                    {validationError && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '-28px',
                                            left: 0,
                                            fontSize: '12px',
                                            color: '#f44336',
                                            fontWeight: '500',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {validationError}
                                        </div>
                                    )}
                                    {sublabel && !validationError && (
                                        <p style={{
                                            fontSize: '12px',
                                            color: '#757575',
                                            margin: '6px 0 0 0',
                                            lineHeight: '1.4'
                                        }}>
                                            {sublabel}
                                        </p>
                                    )}
                                </div>
                            );
                        }

                        case FIELD_TYPES.TEXTAREA:
                            return (
                                <textarea 
                                    {...fieldProps}
                                    placeholder = {field.placeholder}
                                    rows = "4"
                                    className = {error ? 'input-error' : ''}
                                />
                            );

                        case FIELD_TYPES.LONG_TEXT: {
                            const sublabel = field.metadata?.sublabel || '';
                            return (
                                <div style={{ position: 'relative' }}>
                                    <textarea 
                                        {...fieldProps}
                                        placeholder = {field.placeholder}
                                        rows = "4"
                                        className = {error ? 'input-error' : ''}
                                    />
                                    {sublabel && (
                                        <p style={{
                                            fontSize: '12px',
                                            color: '#757575',
                                            margin: '6px 0 0 0',
                                            lineHeight: '1.4'
                                        }}>
                                            {sublabel}
                                        </p>
                                    )}
                                </div>
                            );
                        }

                        case FIELD_TYPES.APPOINTMENT: {
                            const appointmentSublabel = field.metadata?.sublabel || '';
                            const slotDuration = field.metadata?.slotDuration || '30';
                            const customSlotDuration = field.metadata?.customSlotDuration || '';
                            const intervals = field.metadata?.intervals || [];
                            const timezone = field.metadata?.timezone || 'Philippines/Cebu';

                            const getSlotMinutes = () => {
                                if (slotDuration === 'custom') {
                                    return parseInt(customSlotDuration) || 30;
                                }
                                return parseInt(slotDuration) || 30;
                            };

                            const generateSlotsForDate = (date) => {
                                if (!intervals || intervals.length === 0) return [];
                                
                                const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
                                const dayOfWeek = dayNames[date.getDay()];
                                const slotMinutes = getSlotMinutes();
                                const slots = [];

                                const matchingIntervals = intervals.filter((interval) =>
                                    interval && (interval.daysOfWeek || []).includes(dayOfWeek)
                                );

                                matchingIntervals.forEach((interval) => {
                                    if (!interval.startTime || !interval.endTime) return;
                                    
                                    const [startHour, startMin] = interval.startTime.split(':').map(Number);
                                    const [endHour, endMin] = interval.endTime.split(':').map(Number);

                                    const startTotalMin = startHour * 60 + startMin;
                                    const endTotalMin = endHour * 60 + endMin;

                                    for (let time = startTotalMin; time < endTotalMin; time += slotMinutes) {
                                        const hour = Math.floor(time / 60);
                                        const minute = time % 60;
                                        const displayHour = hour % 12 || 12;
                                        const period = hour < 12 ? 'AM' : 'PM';
                                        const timeStr = `${displayHour}:${String(minute).padStart(2, '0')} ${period}`;
                                        slots.push(timeStr);
                                    }
                                });

                                return slots;
                            };

                            const getDaysInMonth = (month, year) => {
                                return new Date(year, month + 1, 0).getDate();
                            };

                            const getFirstDayOfMonth = (month, year) => {
                                return new Date(year, month, 1).getDay();
                            };

                            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                            
                            const daysInMonth = getDaysInMonth(appointmentState.currentMonth, appointmentState.currentYear);
                            const firstDay = getFirstDayOfMonth(appointmentState.currentMonth, appointmentState.currentYear);
                            const calendarDays = [];
                            for (let i = 0; i < firstDay; i++) {
                                calendarDays.push(null);
                            }
                            for (let day = 1; day <= daysInMonth; day++) {
                                calendarDays.push(day);
                            }

                            const handleDateClick = (day) => {
                                if (day) {
                                    const selectedDate = new Date(appointmentState.currentYear, appointmentState.currentMonth, day);
                                    const dateStr = selectedDate.toISOString().split('T')[0];
                                    setAppointmentState((prev) => ({
                                        ...prev,
                                        selectedDate: dateStr,
                                        selectedTime: null,
                                    }));
                                }
                            };

                            const handleTimeSelect = (time) => {
                                setAppointmentState((prev) => ({ ...prev, selectedTime: time }));
                                const newValue = `${appointmentState.selectedDate} ${time}`;
                                fieldProps.onChange(newValue);
                            };

                            const handleMonthChange = (newMonth) => {
                                setAppointmentState((prev) => ({
                                    ...prev,
                                    currentMonth: parseInt(newMonth)
                                }));
                            };

                            const handleYearChange = (newYear) => {
                                setAppointmentState((prev) => ({
                                    ...prev,
                                    currentYear: parseInt(newYear)
                                }));
                            };

                            const getFormattedDate = () => {
                                if (!appointmentState.selectedDate) return '';
                                const date = new Date(appointmentState.selectedDate + 'T00:00:00');
                                const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                const dayName = dayNames[date.getDay()];
                                const monthName = monthNames[date.getMonth()];
                                const dayDate = date.getDate();
                                return `${dayName}, ${monthName} ${dayDate}`;
                            };

                            const handleCancelSelection = () => {
                                setAppointmentState({ 
                                    selectedDate: null, 
                                    selectedTime: null, 
                                    currentMonth: new Date().getMonth(), 
                                    currentYear: new Date().getFullYear() 
                                });
                                fieldProps.onChange('');
                            };

                            const timeSlots = appointmentState.selectedDate ? generateSlotsForDate(new Date(appointmentState.selectedDate + 'T00:00:00')) : [];

                            return (
                                <div className="appointment-field-wrapper">
                                    <div className="appointment-main-container">
                                        <div className="appointment-calendar-display">
                                            <div className="appointment-date-input">
                                                <input
                                                    type="text"
                                                    placeholder="MM/DD/YYYY"
                                                    readOnly
                                                    value={appointmentState.selectedDate ? appointmentState.selectedDate.replace(/(\d{4})-(\d{2})-(\d{2})/, '$3/$2/$1') : ''}
                                                />
                                                <svg className="appointment-calendar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                                                    <path d="M16 2v4M8 2v4M3 10h18"></path>
                                                </svg>
                                            </div>
                                            <div className="appointment-month-year-controls">
                                                <select 
                                                    className="appointment-month-dropdown"
                                                    value={appointmentState.currentMonth}
                                                    onChange={(e) => handleMonthChange(e.target.value)}
                                                >
                                                    {monthNames.map((month, idx) => (
                                                        <option key={idx} value={idx}>{month}</option>
                                                    ))}
                                                </select>
                                                <select 
                                                    className="appointment-year-dropdown"
                                                    value={appointmentState.currentYear}
                                                    onChange={(e) => handleYearChange(e.target.value)}
                                                >
                                                    {[2024, 2025, 2026, 2027, 2028].map((year) => (
                                                        <option key={year} value={year}>{year}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="appointment-weekdays">
                                                <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div>
                                            </div>
                                            <div className="appointment-calendar-grid">
                                                {calendarDays.map((day, i) => (
                                                    <div
                                                        key={i}
                                                        className={`appointment-day ${day ? 'clickable' : ''} ${appointmentState.selectedDate === `${appointmentState.currentYear}-${String(appointmentState.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` ? 'selected' : ''}`}
                                                        onClick={() => handleDateClick(day)}
                                                    >
                                                        {day}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="appointment-times">
                                            {appointmentState.selectedDate && (
                                                <div className="appointment-date-display">{getFormattedDate()}</div>
                                            )}
                                            <div className="appointment-time-slots">
                                                {timeSlots.length > 0 ? (
                                                    timeSlots.map((slot, idx) => (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            className={`appointment-time-slot ${appointmentState.selectedTime === slot ? 'selected' : ''}`}
                                                            onClick={() => handleTimeSelect(slot)}
                                                        >
                                                            {slot}
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="appointment-no-slots">
                                                        {appointmentState.selectedDate ? 'No available slots for this date' : 'Select a date'}
                                                    </div>
                                                )}
                                            </div>
                                            {timezone && (
                                                <div className="appointment-timezone">{timezone}</div>
                                            )}
                                        </div>
                                    </div>
                                    {appointmentState.selectedDate && appointmentState.selectedTime && (
                                        <div className="appointment-selected-summary">
                                            <div className="appointment-summary-content">
                                                <svg className="appointment-summary-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                                <div className="appointment-summary-text">
                                                    <div className="appointment-summary-label">Selected Time</div>
                                                    <div className="appointment-summary-value">{appointmentState.selectedTime} {getFormattedDate()}</div>
                                                </div>
                                            </div>
                                            <button type="button" className="appointment-cancel-btn" onClick={handleCancelSelection}>Cancel Selection</button>
                                        </div>
                                    )}
                                    {appointmentSublabel && !appointmentState.selectedTime && (
                                        <p className="appointment-sublabel">{appointmentSublabel}</p>
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
                        case FIELD_TYPES.SINGLE_CHOICE:
                            return (
                                <div className = "radio-field">
                                    {field.options?.map((option, idx) => (
                                        <div key = {idx} className = "radio-option">
                                            <input 
                                                type = "radio"
                                                id = {`${field.id}-${idx}`}
                                                value = {option.value || option.label || option}
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

                        case FIELD_TYPES.DROPDOWN: {
                            const dropdownSublabel = field.metadata?.sublabel || '';
                            return (
                                <div className="dropdown-field-wrapper">
                                    <select
                                        {...fieldProps}
                                        className = {error ? 'input-error' : ''}
                                    >
                                        <option value = "">Please Select</option>
                                        {field.options?.map((option, idx) => (
                                            <option key = {idx} value = {option.label || option}>
                                                {option.label || option}
                                            </option>
                                        ))}
                                    </select>
                                    {dropdownSublabel && (
                                        <p style={{fontSize: '12px', color: '#757575', margin: '6px 0 0 0', lineHeight: '1.4'}}>{dropdownSublabel}</p>
                                    )}
                                </div>
                            );
                        }

                        case FIELD_TYPES.MULTIPLE_CHOICE: {
                            return (
                                <div className = "checkbox-field">
                                    {field.options?.map((option, idx) => (
                                        <div key = {idx} className = "checkbox-option">
                                            <input 
                                                type = "checkbox"
                                                id = {`${field.id}-${idx}`}
                                                value = {option.label || option}
                                                {...fieldProps}
                                            />
                                            <label htmlFor = {`${field.id}-${idx}`}>
                                                {option.label || option}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            );
                        }

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
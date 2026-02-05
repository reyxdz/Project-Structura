// Individual form field renderer

import React from 'react';
import { FIELD_TYPES } from '../../types/formTypes';
import { evaluateFormula, calculateAggregation, isEditableColumn, formatNumber } from '../../utils/tableFormulas';
import html2pdf from 'html2pdf.js';
import './FormField.css';

export default function FormField({ 
    field, 
    error, 
    isEditMode = false,
    value = '',
    onChange = null,
    isPublic = false 
}) {
    // Appointment field state
    const [appointmentState, setAppointmentState] = React.useState(() => ({
        selectedDate: null,
        selectedTime: null,
        currentMonth: new Date().getMonth(),
        currentYear: new Date().getFullYear(),
    }));

    // Signature field state
    const [isDrawing, setIsDrawing] = React.useState(false);
    const [hasSignature, setHasSignature] = React.useState(false);
    const canvasRef = React.useRef(null);

    // Date field state
    const [selectedDate, setSelectedDate] = React.useState(null);
    const [showCalendar, setShowCalendar] = React.useState(false);
    const [showYearPicker, setShowYearPicker] = React.useState(false);
    const [displayMonth, setDisplayMonth] = React.useState(new Date().getMonth());
    const [displayYear, setDisplayYear] = React.useState(new Date().getFullYear());
    const dateInputRef = React.useRef(null);
    const calendarRef = React.useRef(null);

    // File field state
    const [uploadedFiles, setUploadedFiles] = React.useState([]);
    const [dragActive, setDragActive] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const fileInputRef = React.useRef(null);

    // Handle non-input fields before the form controller
    if (field.type === FIELD_TYPES.MULTI_FIELDS) {
        const columns = field.metadata?.columns || 1;
        const rows = field.metadata?.rows || 1;
        const headingSize = field.metadata?.headingSize || 'default';
        const textAlignment = field.metadata?.textAlignment || 'left';
        const nestedFields = field.metadata?.nestedFields || [];
        const totalSlots = rows * columns;

        return (
            <div className="form-field">
                <div style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 
                        textAlignment === 'left' ? 'flex-start' :
                        textAlignment === 'center' ? 'center' :
                        textAlignment === 'right' ? 'flex-end' : 'flex-start',
                    alignItems: 'center',
                    marginBottom: '12px'
                }}>
                    <label htmlFor={field.id} style={{
                        fontSize: 
                            headingSize === 'small' ? '14px' :
                            headingSize === 'large' ? '20px' :
                            '16px',
                        fontWeight: '500',
                        color: '#333',
                        margin: 0
                    }}>
                        {field.label}
                        {field.required && <span className="required-asterisk">*</span>}
                    </label>
                </div>
                <div style={{
                    border: '1px solid #d0d0d0',
                    borderRadius: '4px',
                    padding: '16px',
                    backgroundColor: '#f8f8f8'
                }}>
                    <div 
                        className="multi-field-grid"
                        style={{
                            gridTemplateColumns: `repeat(${columns}, 1fr)`,
                            padding: '0',
                            gap: '12px'
                        }}
                    >
                        {Array.from({ length: totalSlots }, (_, idx) => {
                            // Find the field that belongs in this slot by slotIndex
                            const nestedField = nestedFields.find(f => f && f.metadata?.slotIndex === idx);
                            return nestedField ? (
                                <FormField key={idx} field={nestedField} error={null} isEditMode={isEditMode} />
                            ) : null;
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // Handle TABLE field - Editable table with headers and cell data
    if (field.type === FIELD_TYPES.TABLE) {
        const columns = field.metadata?.columns || 2;
        const rows = field.metadata?.rows || 3;
        const headingSize = field.metadata?.headingSize || 'default';
        const textAlignment = field.metadata?.textAlignment || 'left';
        const labelBold = field.metadata?.labelBold || false;
        const labelItalic = field.metadata?.labelItalic || false;
        const labelUnderline = field.metadata?.labelUnderline || false;
        const headerBold = field.metadata?.headerBold || false;
        const headerItalic = field.metadata?.headerItalic || false;
        const headerUnderline = field.metadata?.headerUnderline || false;
        
        // Initialize headers with proper defaults
        const currentHeaders = field.metadata?.headers || [];
        const headers = Array.from({ length: columns }, (_, idx) => 
            currentHeaders[idx] || `Column ${idx + 1}`
        );
        
        // State for user input data - initialized from template data if available
        const [tableData, setTableData] = React.useState(() => {
            const currentData = field.metadata?.tableData || Array.from({ length: rows }, () => Array.from({ length: columns }, () => ''));
            return Array.isArray(currentData) ? [...currentData] : Array.from({ length: rows }, () => Array.from({ length: columns }, () => ''));
        });

        // State for generated summary/invoice
        const [showSummary, setShowSummary] = React.useState(false);
        const summaryRef = React.useRef(null);
        
        // Handle cell input changes
        const handleCellChange = (rIdx, cIdx, newValue) => {
            const updatedData = tableData.map((row, rowIdx) => {
                if (rowIdx === rIdx) {
                    return row.map((cell, cellIdx) => cellIdx === cIdx ? newValue : cell);
                }
                return row;
            });
            setTableData(updatedData);
        };

        // Generate invoice/summary with aggregation rows
        const generateSummary = () => {
            setShowSummary(true);
        };

        // Download summary as PDF
        const downloadSummaryPDF = () => {
            if (summaryRef.current) {
                const options = {
                    margin: 10,
                    filename: `${field.label || 'Summary'}-${new Date().toISOString().split('T')[0]}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
                };
                html2pdf().set(options).from(summaryRef.current).save();
            }
        };

        return (
            <div className="form-field">
                <div style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 
                        textAlignment === 'left' ? 'flex-start' :
                        textAlignment === 'center' ? 'center' :
                        textAlignment === 'right' ? 'flex-end' : 'flex-start',
                    alignItems: 'center',
                    marginBottom: '12px'
                }}>
                    <label style={{
                        fontSize: 
                            headingSize === 'small' ? '14px' :
                            headingSize === 'large' ? '20px' :
                            '16px',
                        fontWeight: labelBold ? 'bold' : '500',
                        fontStyle: labelItalic ? 'italic' : 'normal',
                        textDecoration: labelUnderline ? 'underline' : 'none',
                        color: '#333',
                        margin: 0
                    }}>
                        {field.label}
                        {field.required && <span className="required-asterisk">*</span>}
                    </label>
                </div>
                <div className="table-container" style={{
                    overflowX: 'auto',
                    border: '1px solid #d0d0d0',
                    borderRadius: '4px',
                    backgroundColor: '#ffffff'
                }}>
                    <table className="editable-table">
                        <thead>
                            <tr>
                                {headers.map((header, idx) => (
                                    <th key={idx} className="table-header-cell" style={{
                                        fontWeight: headerBold ? 'bold' : '600',
                                        fontStyle: headerItalic ? 'italic' : 'normal',
                                        textDecoration: headerUnderline ? 'underline' : 'none',
                                        fontSize: field.metadata?.headerSize === 'small' ? '12px' : field.metadata?.headerSize === 'large' ? '16px' : '14px',
                                        textAlign: field.metadata?.headerAlignment || 'left',
                                    }}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tableData && tableData.length > 0 ? (
                                tableData.map((row, rIdx) => (
                                    <tr key={`row-${rIdx}`}>
                                        {Array.isArray(row) ? (
                                            row.map((cell, cIdx) => {
                                                const columnConfig = field.metadata?.columnConfigs?.[cIdx];
                                                const isEditable = isEditableColumn(columnConfig);
                                                let displayValue = cell || '';
                                                
                                                // Note: Formulas are now only used in Summary columns
                                                // Regular columns display their raw values
                                                
                                                return (
                                                    <td key={`cell-${rIdx}-${cIdx}`} className="table-data-cell" style={{
                                                        color: '#333',
                                                        backgroundColor: isEditable ? '#ffffff' : '#f5f5f5',
                                                        padding: isEditable ? '0' : '8px',
                                                    }}>
                                                        {isEditable ? (
                                                            <input
                                                                type={columnConfig?.dataType === 'number' ? 'number' : 
                                                                      columnConfig?.dataType === 'date' ? 'date' :
                                                                      columnConfig?.dataType === 'email' ? 'email' :
                                                                      columnConfig?.dataType === 'phone' ? 'tel' :
                                                                      'text'}
                                                                value={cell || ''}
                                                                onChange={(e) => handleCellChange(rIdx, cIdx, e.target.value)}
                                                                style={{
                                                                    width: '100%',
                                                                    padding: '8px',
                                                                    border: 'none',
                                                                    backgroundColor: 'transparent',
                                                                    fontSize: '13px',
                                                                    fontFamily: 'inherit',
                                                                }}
                                                            />
                                                        ) : (
                                                            <div style={{
                                                                fontWeight: columnConfig?.columnFunction === 'summary' ? 'bold' : 'normal',
                                                                color: columnConfig?.columnFunction === 'summary' ? '#0066cc' : '#333',
                                                            }}>
                                                                {formatNumber(displayValue, 2)}
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })
                                        ) : (
                                            Array.from({ length: columns }, (_, cIdx) => (
                                                <td key={`cell-${rIdx}-${cIdx}`} className="table-data-cell" style={{color: '#333'}}>
                                                    {row && row[cIdx] ? row[cIdx] : ''}
                                                </td>
                                            ))
                                        )}
                                    </tr>
                                ))
                            ) : (
                                Array.from({ length: rows }, (_, rIdx) => (
                                    <tr key={`empty-row-${rIdx}`}>
                                        {Array.from({ length: columns }, (_, cIdx) => (
                                            <td key={`empty-cell-${rIdx}-${cIdx}`} className="table-data-cell">
                                                {' '}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                            
                            {/* Summary Row if any column has aggregation */}
                            {field.metadata?.columnConfigs?.some(c => c?.columnFunction === 'summary') && (
                                <tr style={{ backgroundColor: '#f9f9f9', fontWeight: 'bold' }}>
                                    {Array.from({ length: columns }, (_, cIdx) => {
                                        const columnConfig = field.metadata?.columnConfigs?.[cIdx];
                                        
                                        let displayValue = '';
                                        if (columnConfig?.columnFunction === 'summary') {
                                            const aggregationResult = calculateAggregation(
                                                columnConfig.aggregationFn,
                                                tableData || [],
                                                cIdx,
                                                columnConfig.formula
                                            );
                                            displayValue = formatNumber(aggregationResult, 2);
                                        }
                                        
                                        return (
                                            <td key={`summary-${cIdx}`} className="table-data-cell" style={{
                                                color: '#0066cc',
                                                backgroundColor: '#f0f7ff',
                                                fontWeight: 'bold',
                                                padding: '8px',
                                            }}>
                                                {displayValue}
                                            </td>
                                        );
                                    })}
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Generate Button */}
                {field.metadata?.showButton && (
                    <div style={{
                        marginTop: '16px',
                        display: 'flex',
                        justifyContent: field.metadata?.buttonAlignment === 'left' ? 'flex-start' : 
                                       field.metadata?.buttonAlignment === 'right' ? 'flex-end' : 'center'
                    }}>
                        <button
                            type="button"
                            onClick={generateSummary}
                            style={{
                                padding: '10px 24px',
                                fontSize: '14px',
                                fontWeight: field.metadata?.fontWeight || '600',
                                backgroundColor: field.metadata?.backgroundColor || '#0D47A1',
                                color: field.metadata?.fontColor || '#FFFFFF',
                                border: field.metadata?.borderStyle === 'none' ? 'none' : 
                                       `2px ${field.metadata?.borderStyle || 'solid'} ${field.metadata?.borderColor || '#000000'}`,
                                borderRadius: '4px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                width: field.metadata?.buttonWidth ? `${field.metadata?.buttonWidth}%` : 'auto',
                                height: field.metadata?.buttonHeight ? `${field.metadata?.buttonHeight}%` : 'auto',
                                minHeight: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                whiteSpace: 'nowrap'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.opacity = '0.9';
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.opacity = '1';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            {field.metadata?.buttonText || 'Generate Summary'}
                        </button>
                    </div>
                )}

                {/* Generated Invoice/Summary */}
                {showSummary && (
                    <div style={{
                        marginTop: '32px',
                        padding: '32px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                    }} ref={summaryRef}>
                        {/* Header */}
                        <div style={{
                            marginBottom: '32px',
                            paddingBottom: '16px',
                            borderBottom: '2px solid #0D47A1'
                        }}>
                            <h2 style={{
                                fontSize: '28px',
                                fontWeight: '700',
                                color: '#0D47A1',
                                margin: '0 0 8px 0'
                            }}>Summary & Invoice</h2>
                            <p style={{
                                fontSize: '12px',
                                color: '#666',
                                margin: '0',
                                letterSpacing: '0.5px'
                            }}>Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
                        </div>

                        {/* Summary Table */}
                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#333',
                                marginBottom: '16px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>Data Summary</h3>
                            <table style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                marginBottom: '24px'
                            }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                                        {headers.map((header, idx) => (
                                            <th key={idx} style={{
                                                padding: '12px 16px',
                                                textAlign: 'left',
                                                fontWeight: '600',
                                                color: '#333',
                                                borderBottom: '2px solid #0D47A1',
                                                fontSize: '13px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.3px'
                                            }}>
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData
                                        .map((row, rIdx) => ({ row, rIdx }))
                                        .filter(({ row }) => row.every(cell => cell && cell.toString().trim() !== ''))
                                        .map(({ row, rIdx }) => (
                                        <tr key={rIdx} style={{
                                            backgroundColor: rIdx % 2 === 0 ? '#ffffff' : '#fafafa',
                                            borderBottom: '1px solid #e0e0e0'
                                        }}>
                                            {row.map((cell, cIdx) => (
                                                <td key={cIdx} style={{
                                                    padding: '12px 16px',
                                                    textAlign: 'left',
                                                    color: '#666',
                                                    fontSize: '13px'
                                                }}>
                                                    {cell || '-'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Summary Rows */}
                            {field.metadata?.columnConfigs?.some(cfg => cfg.columnFunction === 'summary') && (
                                <div style={{
                                    backgroundColor: '#f0f7ff',
                                    borderLeft: '4px solid #0D47A1',
                                    padding: '16px',
                                    borderRadius: '4px',
                                    marginTop: '16px'
                                }}>
                                    <h4 style={{
                                        margin: '0 0 12px 0',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#0D47A1'
                                    }}>Calculations</h4>
                                    {field.metadata?.columnConfigs?.map((config, idx) => {
                                        if (config.columnFunction === 'summary' && config.aggregationFn) {
                                            // Filter out rows with any blank cells for aggregation
                                            const completeRows = tableData.filter(row => 
                                                row.every(cell => cell && cell.toString().trim() !== '')
                                            );
                                            const aggregationValue = calculateAggregation(
                                                config.aggregationFn,
                                                completeRows,
                                                idx,
                                                config.formula || ''
                                            );
                                            return (
                                                <div key={idx} style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    paddingBottom: '8px',
                                                    marginBottom: '8px',
                                                    borderBottom: '1px solid #ddd'
                                                }}>
                                                    <span style={{ color: '#666', fontSize: '13px' }}>
                                                        {headers[idx]} ({config.aggregationFn}):
                                                    </span>
                                                    <span style={{
                                                        fontWeight: '600',
                                                        color: '#0D47A1',
                                                        fontSize: '13px'
                                                    }}>
                                                        {formatNumber(aggregationValue)}
                                                    </span>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer with Download Button */}
                        <div style={{
                            marginTop: '32px',
                            paddingTop: '16px',
                            borderTop: '1px solid #e0e0e0',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '12px'
                        }}>
                            <button
                                type="button"
                                onClick={() => setShowSummary(false)}
                                style={{
                                    padding: '10px 20px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    backgroundColor: '#f5f5f5',
                                    color: '#333',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#e8e8e8';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#f5f5f5';
                                }}
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                onClick={downloadSummaryPDF}
                                style={{
                                    padding: '10px 24px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    backgroundColor: '#0D47A1',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#0a3380';
                                    e.target.style.boxShadow = '0 4px 8px rgba(13, 71, 161, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#0D47A1';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                Download as PDF
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Handle non-input fields (like HEADING, DIVIDER) that don't need form control
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

    // Handle DIVIDER field
    if (field.type === FIELD_TYPES.DIVIDER) {
        const lineColor = field.metadata?.lineColor || '#cccccc';
        const dividerStyle = field.metadata?.dividerStyle || 'solid';
        const dividerHeight = field.metadata?.dividerHeight || 1;
        const spaceBelow = field.metadata?.spaceBelow || 0;
        const spaceAbove = field.metadata?.spaceAbove || 0;

        let borderStyle = 'solid';
        if (dividerStyle === 'dashed') {
            borderStyle = 'dashed';
        } else if (dividerStyle === 'dots') {
            borderStyle = 'dotted';
        }

        return (
            <div className="form-field">
                <div style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    paddingTop: `${spaceAbove}px`,
                    paddingBottom: `${spaceBelow}px`,
                    minHeight: `${Math.max(dividerHeight + 8, 24)}px`
                }}>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        borderTop: `${dividerHeight}px ${borderStyle} ${lineColor}`,
                        margin: 0,
                        display: 'flex',
                        alignItems: 'center'
                    }} />
                </div>
            </div>
        );
    }



    // Handle SIGNATURE field
    if (field.type === FIELD_TYPES.SIGNATURE) {
        const placeholder = field.placeholder || 'Sign Here';

        const getMousePos = (e) => {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;
            return { x, y };
        };

        const startDrawing = (e) => {
            setIsDrawing(true);
            if (!hasSignature) {
                setHasSignature(true);
            }
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const { x, y } = getMousePos(e);
            ctx.beginPath();
            ctx.moveTo(x, y);
        };

        const draw = (e) => {
            if (!isDrawing) return;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const { x, y } = getMousePos(e);
            ctx.lineTo(x, y);
            ctx.stroke();
        };

        const stopDrawing = () => {
            setIsDrawing(false);
        };

        const clearSignature = () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            setHasSignature(false);
        };

        const initializeCanvas = (canvas) => {
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.strokeStyle = '#000000';
            }
        };

        const clearButtonAlignment = field.metadata?.clearButtonAlignment || 'center';
        const clearButtonLabel = field.metadata?.clearButtonLabel || 'Clear';
        const clearButtonBgColor = field.metadata?.clearButtonBgColor || '#FFFFFF';
        const clearButtonFontColor = field.metadata?.clearButtonFontColor || '#000000';

        let justifyContent = 'center';
        if (clearButtonAlignment === 'left') justifyContent = 'flex-start';
        else if (clearButtonAlignment === 'right') justifyContent = 'flex-end';
        return (
            <div className="form-field">
                <label htmlFor={field.id}>
                    {field.label}
                    {field.required && <span className="required-asterisk">*</span>}
                </label>
                <div className="signature-field-wrapper" style={{ position: 'relative', display: 'block', width: '100%' }}>
                    <canvas
                        ref={canvasRef}
                        className="signature-canvas"
                        width={600}
                        height={200}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        style={{
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            cursor: 'crosshair',
                            display: 'block',
                            backgroundColor: '#fff',
                            width: '100%'
                        }}
                        onLoad={() => initializeCanvas(canvasRef.current)}
                    />
                    {!hasSignature && (
                        <div style={{
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            right: '0',
                            bottom: '0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            pointerEvents: 'none'
                        }}>
                            <span style={{
                                color: '#ccc',
                                fontSize: '16px',
                                whiteSpace: 'nowrap'
                            }}>{placeholder}</span>
                        </div>
                    )}
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: justifyContent,
                    marginTop: '12px'
                }}>
                    <button
                        type="button"
                        onClick={clearSignature}
                        style={{
                            backgroundColor: clearButtonBgColor,
                            color: clearButtonFontColor,
                            border: '1px solid #ccc',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {clearButtonLabel}
                    </button>
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
                        <input id={field.id} name={`${field.id}.first`} type="text" placeholder="" />
                        <p style={{fontSize: '12px', color: '#757575', margin: '4px 0 0 0', lineHeight: '1.4'}}>{firstNameLabel}</p>
                    </div>
                    <div className="full-name-preview-group">
                        <input id={`${field.id}-last`} name={`${field.id}.last`} type="text" placeholder="" />
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
                    id={field.id}
                    name={field.id}
                    type="email"
                    placeholder={field.placeholder || ''}
                    aria-label={field.label || field.id}
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
                        <input id={field.id} name={`${field.id}.street1`} type="text" placeholder="" />
                        <p style={{fontSize: '12px', color: '#757575', margin: '4px 0 0 0', lineHeight: '1.4'}}>{streetAddress1}</p>
                    </div>
                    <div className="address-input-group-preview">
                        <input id={`${field.id}-street2`} name={`${field.id}.street2`} type="text" placeholder="" />
                        <p style={{fontSize: '12px', color: '#757575', margin: '4px 0 0 0', lineHeight: '1.4'}}>{streetAddress2}</p>
                    </div>
                    <div className="address-row-preview">
                        <div className="address-col-preview">
                            <div className="address-input-group-preview">
                                <input id={`${field.id}-city`} name={`${field.id}.city`} type="text" placeholder="" />
                                <p style={{fontSize: '12px', color: '#757575', margin: '4px 0 0 0', lineHeight: '1.4'}}>{city}</p>
                            </div>
                        </div>
                        <div className="address-col-preview">
                            <div className="address-input-group-preview">
                                <input id={`${field.id}-state`} name={`${field.id}.state`} type="text" placeholder="" />
                                <p style={{fontSize: '12px', color: '#757575', margin: '4px 0 0 0', lineHeight: '1.4'}}>{stateProvince}</p>
                            </div>
                        </div>
                    </div>
                    <div className="address-input-group-preview">
                        <input id={`${field.id}-postal`} name={`${field.id}.postal`} type="text" placeholder="" />
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
                <input id={field.id} name={field.id} type="tel" placeholder={field.placeholder || ''} aria-label={field.label || field.id} />
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

        const formatDate = (date) => {
            if (!date) return '';
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const year = date.getFullYear();
            return `${month}${separator}${day}${separator}${year}`;
        };

        const parseDate = (dateString) => {
            const parts = dateString.replace(/\D/g, '').split('');
            if (parts.length === 8) {
                const month = parseInt(parts.slice(0, 2).join(''));
                const day = parseInt(parts.slice(2, 4).join(''));
                const year = parseInt(parts.slice(4, 8).join(''));
                if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
                    const date = new Date(year, month - 1, day);
                    if (date.getMonth() === month - 1) {
                        return date;
                    }
                }
            }
            return null;
        };

        const handleInputChange = (e) => {
            const value = e.target.value.replace(/\D/g, '');
            let formatted = '';
            
            if (value.length > 0) {
                // Extract month, day, year
                let monthStr = value.slice(0, 2);
                let dayStr = value.slice(2, 4);
                let yearStr = value.slice(4, 8);
                
                // Validate month (1-12)
                if (monthStr) {
                    const month = parseInt(monthStr);
                    if (month > 12) {
                        monthStr = '12';
                    } else if (month === 0 && monthStr.length > 1) {
                        monthStr = monthStr.slice(-1);
                    }
                }
                
                formatted = monthStr;
                if (value.length > 2) {
                    // Validate day based on selected month
                    let month = parseInt(monthStr || '1');
                    if (month < 1) month = 1;
                    if (month > 12) month = 12;
                    
                    const daysInSelectedMonth = new Date(yearStr || 2024, month, 0).getDate();
                    let day = parseInt(dayStr || '1');
                    
                    if (day > daysInSelectedMonth) {
                        dayStr = String(daysInSelectedMonth).padStart(2, '0');
                    } else if (day === 0 && dayStr.length > 1) {
                        dayStr = dayStr.slice(-1);
                    }
                    
                    formatted += separator + dayStr;
                }
                if (value.length > 4) {
                    formatted += separator + yearStr;
                }
            }
            
            dateInputRef.current.value = formatted;

            if (formatted.replace(/\D/g, '').length === 8) {
                const date = parseDate(formatted);
                if (date) {
                    setSelectedDate(date);
                    setDisplayMonth(date.getMonth());
                    setDisplayYear(date.getFullYear());
                }
            }
        };

        const handleCalendarClick = () => {
            setShowCalendar(!showCalendar);
        };

        const handleDateSelect = (day) => {
            const date = new Date(displayYear, displayMonth, day);
            setSelectedDate(date);
            dateInputRef.current.value = formatDate(date);
            setShowCalendar(false);
        };

        const handleMonthChange = (offset) => {
            let newMonth = displayMonth + offset;
            let newYear = displayYear;
            if (newMonth < 0) {
                newMonth = 11;
                newYear--;
            } else if (newMonth > 11) {
                newMonth = 0;
                newYear++;
            }
            setDisplayMonth(newMonth);
            setDisplayYear(newYear);
        };

        const handlePrevMonth = (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleMonthChange(-1);
        };

        const handleNextMonth = (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleMonthChange(1);
        };

        const handleYearClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowYearPicker(!showYearPicker);
        };

        const handleYearSelect = (year) => {
            setDisplayYear(year);
            setShowYearPicker(false);
        };

        const getDaysInMonth = (year, month) => {
            return new Date(year, month + 1, 0).getDate();
        };

        const getFirstDayOfMonth = (year, month) => {
            return new Date(year, month, 1).getDay();
        };

        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

        const calendarDays = [];
        const firstDay = getFirstDayOfMonth(displayYear, displayMonth);
        const daysInMonth = getDaysInMonth(displayYear, displayMonth);
        
        for (let i = 0; i < firstDay; i++) {
            calendarDays.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            calendarDays.push(i);
        }

        return (
            <div className="date-field-wrapper">
                <label htmlFor={field.id}>
                    {field.label}
                    {field.required && <span className="required-asterisk">*</span>}
                </label>
                <div style={{position: 'relative', overflow: 'visible'}}>
                    <div className="date-input-wrapper" style={{position: 'relative', overflow: 'visible'}}>
                        <input 
                            ref={dateInputRef}
                            id={field.id}
                            name={field.id}
                            type="text" 
                            placeholder={placeholder}
                            onChange={handleInputChange}
                            maxLength="10"
                            aria-label={field.label || field.id}
                        />
                        <svg 
                            className="calendar-icon" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                            onClick={handleCalendarClick}
                            style={{
                                cursor: 'pointer',
                                pointerEvents: 'auto'
                            }}
                        >
                            <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                            <path d="M16 2v4M8 2v4M3 10h18"></path>
                        </svg>
                    </div>
                    {showCalendar && (
                        <div ref={calendarRef} style={{
                            position: 'absolute',
                            top: 'calc(100% + 8px)',
                            left: '0',
                            backgroundColor: '#fff',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            padding: '12px',
                            zIndex: 1000,
                            minWidth: '320px',
                            overflow: 'visible'
                        }}>
                            {!showYearPicker ? (
                            <>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '12px',
                                paddingBottom: '8px',
                                borderBottom: '1px solid #eee'
                            }}>
                                <button type="button" onClick={handlePrevMonth} style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                    padding: '0 8px',
                                    color: '#333'
                                }}>←</button>
                                <div style={{minWidth: '180px', textAlign: 'center'}}>
                                    <span style={{fontWeight: 'bold', fontSize: '16px', color: '#333'}}>
                                        {monthNames[displayMonth]}
                                    </span>
                                    <span 
                                        onClick={handleYearClick}
                                        style={{fontWeight: 'bold', fontSize: '16px', color: '#0D47A1', cursor: 'pointer', marginLeft: '8px'}}
                                    >
                                        {displayYear}
                                    </span>
                                </div>
                                <button type="button" onClick={handleNextMonth} style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                    padding: '0 8px',
                                    color: '#333'
                                }}>→</button>
                            </div>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(7, 1fr)',
                                gap: '4px',
                                marginBottom: '12px'
                            }}>
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <div key={day} style={{
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        fontSize: '12px',
                                        padding: '6px',
                                        color: '#333'
                                    }}>
                                        {day}
                                    </div>
                                ))}
                                {calendarDays.map((day, idx) => (
                                    <div key={idx} style={{
                                        textAlign: 'center',
                                        padding: '6px',
                                        cursor: day ? 'pointer' : 'default',
                                        backgroundColor: day === selectedDate?.getDate() && 
                                            selectedDate?.getMonth() === displayMonth && 
                                            selectedDate?.getFullYear() === displayYear ? '#0D47A1' : 'transparent',
                                        color: day === selectedDate?.getDate() && 
                                            selectedDate?.getMonth() === displayMonth && 
                                            selectedDate?.getFullYear() === displayYear ? '#fff' : '#333',
                                        borderRadius: '4px',
                                        fontSize: '14px'
                                    }} onClick={() => day && handleDateSelect(day)}>
                                        {day}
                                    </div>
                                ))}
                            </div>
                            </>
                            ) : (
                                <div>
                                    <button type="button" onClick={handleYearClick} style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        color: '#0D47A1',
                                        marginBottom: '12px'
                                    }}>← Back</button>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(4, 1fr)',
                                        gap: '8px'
                                    }}>
                                        {Array.from({ length: 20 }, (_, i) => displayYear - 10 + i).map(year => (
                                            <button 
                                                key={year}
                                                type="button"
                                                onClick={() => handleYearSelect(year)}
                                                style={{
                                                    padding: '8px',
                                                    border: year === displayYear ? '2px solid #0D47A1' : '1px solid #ddd',
                                                    borderRadius: '4px',
                                                    backgroundColor: year === displayYear ? '#0D47A1' : '#fff',
                                                    color: year === displayYear ? '#fff' : '#333',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    fontWeight: year === displayYear ? 'bold' : 'normal'
                                                }}
                                            >
                                                {year}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
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

        // Convert file size to bytes
        const getMaxSizeInBytes = () => {
            const size = parseInt(maxFileSize);
            return maxFileSizeUnit === 'kb' ? size * 1024 : size * 1024 * 1024;
        };

        const validateFile = (file) => {
            // Check file size
            if (file.size > getMaxSizeInBytes()) {
                return `File "${file.name}" exceeds maximum size of ${maxFileSize} ${maxFileSizeUnit.toUpperCase()}`;
            }

            // Check file type
            if (acceptedFileTypes.length > 0) {
                const fileExtension = file.name.split('.').pop().toLowerCase();
                if (!acceptedFileTypes.includes(fileExtension)) {
                    return `File type "${fileExtension.toUpperCase()}" is not accepted. Allowed types: ${acceptedFileTypes.map(t => t.toUpperCase()).join(', ')}`;
                }
            }

            return null;
        };

        const handleFiles = (files) => {
            setErrorMessage('');
            const fileArray = Array.from(files);
            const validFiles = [];
            let firstError = null;

            fileArray.forEach(file => {
                const error = validateFile(file);
                if (error) {
                    if (!firstError) firstError = error;
                } else {
                    validFiles.push({
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        file: file
                    });
                }
            });

            if (firstError) {
                setErrorMessage(firstError);
            }

            if (validFiles.length > 0) {
                setUploadedFiles([...uploadedFiles, ...validFiles]);
            }
        };

        const handleDrag = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.type === 'dragenter' || e.type === 'dragover') {
                setDragActive(true);
            } else if (e.type === 'dragleave') {
                setDragActive(false);
            }
        };

        const handleDrop = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
            handleFiles(e.dataTransfer.files);
        };

        const handleChange = (e) => {
            handleFiles(e.target.files);
        };

        const removeFile = (index) => {
            setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
        };

        const formatFileSize = (bytes) => {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
        };

        return (
            <div className="file-field-wrapper">
                <label htmlFor={field.id}>
                    {field.label}
                    {field.required && <span className="required-asterisk">*</span>}
                </label>
                <div
                    className="file-upload-container"
                    style={{
                        width: '100%',
                        border: dragActive ? '2px dashed #0D47A1' : '2px solid #aaa',
                        borderRadius: '12px',
                        padding: '40px',
                        minHeight: '140px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        background: dragActive ? '#f5f5f5' : '#fff',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleChange}
                        style={{ display: 'none' }}
                        accept={acceptedFileTypes.length > 0 ? acceptedFileTypes.map(t => `.${t}`).join(',') : undefined}
                    />
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
                                    Accepted: {acceptedFileTypes.map(t => t.toUpperCase()).join(', ')}<br />
                                    Max: {maxFileSize} {maxFileSizeUnit.toUpperCase()}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                {errorMessage && (
                    <div style={{ 
                        marginTop: '8px', 
                        padding: '8px 12px', 
                        backgroundColor: '#ffebee', 
                        color: '#c62828', 
                        borderRadius: '4px',
                        fontSize: '12px'
                    }}>
                        {errorMessage}
                    </div>
                )}
                {uploadedFiles.length > 0 && (
                    <div style={{ marginTop: '16px' }}>
                        <p style={{ fontSize: '12px', fontWeight: '500', color: '#333', marginBottom: '8px' }}>
                            Uploaded Files ({uploadedFiles.length})
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {uploadedFiles.map((file, index) => (
                                <div 
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '12px',
                                        backgroundColor: '#f5f5f5',
                                        borderRadius: '4px',
                                        fontSize: '13px'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                                        <svg style={{width: '16px', height: '16px', color: '#888', flexShrink: 0}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                                            <polyline points="13 2 13 9 20 9"></polyline>
                                        </svg>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#333' }}>
                                                {file.name}
                                            </p>
                                            <p style={{ margin: '4px 0 0 0', color: '#999', fontSize: '12px' }}>
                                                {formatFileSize(file.size)}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#f44336',
                                            cursor: 'pointer',
                                            padding: '4px',
                                            fontSize: '18px',
                                            lineHeight: 1,
                                            flexShrink: 0
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
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

            {(() => {
                switch (field.type) {
                    case FIELD_TYPES.TEXT:
                        return (
                            <input
                                id={field.id}
                                type="text"
                                placeholder={field.placeholder}
                                defaultValue={field.value || ''}
                                className={error ? 'input-error' : ''}
                            />
                        );

                    case FIELD_TYPES.SHORT_TEXT: {
                        const sublabel = field.metadata?.sublabel || '';
                        return (
                            <div style={{ position: 'relative' }}>
                                <input
                                    id={field.id}
                                    type="text"
                                    placeholder={field.placeholder}
                                    defaultValue={field.value || ''}
                                    className={error ? 'input-error' : ''}
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
                        
                        return (
                            <div style={{ position: 'relative' }}>
                                <input
                                    id={field.id}
                                    type="number"
                                    placeholder={field.placeholder}
                                    defaultValue={field.value || ''}
                                    className={error ? 'input-error' : ''}
                                    min={minValue || undefined}
                                    max={maxValue || undefined}
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

                    case FIELD_TYPES.TEXTAREA:
                        return (
                            <textarea 
                                id={field.id}
                                placeholder={field.placeholder}
                                defaultValue={field.value || ''}
                                rows="4"
                                className={error ? 'input-error' : ''}
                            />
                        );

                    case FIELD_TYPES.LONG_TEXT: {
                        const sublabel = field.metadata?.sublabel || '';
                        return (
                            <div style={{ position: 'relative' }}>
                                <textarea 
                                    id={field.id}
                                    placeholder={field.placeholder}
                                    defaultValue={field.value || ''}
                                    rows="4"
                                    className={error ? 'input-error' : ''}
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
                                id={field.id}
                                type="file"
                                className={error ? 'input-error' : ''}
                            />
                        );

                    case FIELD_TYPES.CHECKBOX:
                        return (
                            <div className="checkbox-field">
                                <input 
                                    type="checkbox"
                                    id={field.id}
                                    defaultChecked={field.value || false}
                                />
                                <label htmlFor={field.id}>
                                    {field.label}
                                    {field.required && <span className="required-asterisk">*</span>}
                                </label>
                            </div>
                        )

                    case FIELD_TYPES.RADIO:
                    case FIELD_TYPES.SINGLE_CHOICE:
                        return (
                            <div className="radio-field">
                                {field.options?.map((option, idx) => (
                                    <div key={idx} className="radio-option">
                                        <input 
                                            type="radio"
                                            id={`${field.id}-${idx}`}
                                            name={field.id}
                                            value={option.value || option.label || option}
                                            defaultChecked={field.value === (option.value || option.label || option)}
                                        />
                                        <label htmlFor={`${field.id}-${idx}`}>
                                            {option.label || option}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        );

                    case FIELD_TYPES.SELECT:
                        return (
                            <select
                                id={field.id}
                                defaultValue={field.value || ''}
                                className={error ? 'input-error' : ''}
                            >
                                <option value="">Select an option...</option>
                                {field.options?.map((option, idx) => (
                                    <option key={idx} value={option.value || option}>
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
                                    id={field.id}
                                    defaultValue={field.value || ''}
                                    className={error ? 'input-error' : ''}
                                >
                                    <option value="">Please Select</option>
                                    {field.options?.map((option, idx) => (
                                        <option key={idx} value={option.label || option}>
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
                            <div className="checkbox-field">
                                {field.options?.map((option, idx) => (
                                    <div key={idx} className="checkbox-option">
                                        <input 
                                            type="checkbox"
                                            id={`${field.id}-${idx}`}
                                            value={option.label || option}
                                            defaultChecked={Array.isArray(field.value) && field.value.includes(option.label || option)}
                                        />
                                        <label htmlFor={`${field.id}-${idx}`}>
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
            })()}

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
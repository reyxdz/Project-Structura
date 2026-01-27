// Configure selected field properties
// Phase 3 Step 5.1: Added conditional builder to the field configurator

import React, { useState } from 'react';
import ConditionalRuleBuilder from './ConditionalRuleBuilder';
import { useFormStore } from '../../stores/formStore';
import {FIELD_TYPES, VALIDATION_TYPES } from '../../types/formTypes';
import ValidationRulesList from './ValidationRulesList';
import ConfirmModal from '../Common/ConfirmModal';
import './FieldConfigurator.css';

export default function FieldConfigurator() {
    const form = useFormStore((state) => state.form);
    const selectedFieldId = useFormStore((state) => state.selectedFieldId);
    const updateField = useFormStore((state) => state.updateField);
    const removeField = useFormStore((state) => state.removeField);
    const duplicateField = useFormStore((state) => state.duplicateField);
    const [showValidationPanel, setShowValidationPanel] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const selectedField = form.fields.find((f) => f.id === selectedFieldId);

    if (!selectedField) {
        return <div>No field selected</div>;
    }

    const handleLabelChange = (e) => {
        updateField(selectedFieldId, { label: e.target.value });
    };

    const handlePlaceholderChange = (e) => {
        updateField(selectedFieldId, { placeholder: e.target.value });
    };

    const handleRequiredChange = (e) => {
        updateField(selectedFieldId, {required: e.target.checked });
    };

    const handleHelpTextChange = (e) => {
        updateField(selectedFieldId, { helpText: e.target.value });
    };

    const handleAddValidation = (validationType) => {
        const newValidation = {
            type: validationType,
            value: '',
            message: '',
        };
        const updatedValidations = [...selectedField.validation, newValidation];
        updateField(selectedFieldId, { validation: updatedValidations });
    };

    const handleUpdateValidation = (index, updates) => {
        const updatedValidations = selectedField.validation.map((v, i) =>
            i === index ? { ...v, ...updates } : v
        );
        updateField(selectedFieldId, { validation: updatedValidations });
    };

    const handleRemoveValidation = (index) => {
        const updatedValidations = selectedField.validation.filter(
            (_, i) => i !== index
        );
        updateField(selectedFieldId, { validation: updatedValidations });
    }

    const handleRemove = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        setShowDeleteModal(false);
        removeField(selectedFieldId);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };

    const handleDuplicate = () => {
        duplicateField(selectedFieldId);
    }

    // Render Email-specific configuration
    if (selectedField.type === FIELD_TYPES.EMAIL) {
        const sublabel = selectedField.metadata?.sublabel || '';

        return (
            <div className="field-configurator">
                <h3>Email Configuration</h3>

                {/* Field Label */}
                <div className="config-section">
                    <label>
                        <span>Field Label</span>
                        <input
                            type="text"
                            value={selectedField.label}
                            onChange={handleLabelChange}
                            placeholder="Email"
                        />
                    </label>
                </div>

                <div className="config-divider" />

                {/* Required */}
                <div className="config-section">
                    <label>
                        <span>Required</span>
                        <button
                            type="button"
                            className={`alignment-btn ${selectedField.required ? 'active' : ''}`}
                            onClick={() =>
                                updateField(selectedFieldId, {
                                    required: !selectedField.required,
                                })
                            }
                        >
                            {selectedField.required ? 'Required' : 'Optional'}
                        </button>
                    </label>
                    <p className="config-hint">Prevent submission if this field is empty</p>
                </div>

                <div className="config-divider" />

                {/* Sublabel */}
                <div className="config-section">
                    <label>
                        <span>Sublabel</span>
                        <input
                            type="text"
                            value={sublabel}
                            onChange={(e) =>
                                updateField(selectedFieldId, {
                                    metadata: {
                                        ...selectedField.metadata,
                                        sublabel: e.target.value,
                                    },
                                })
                            }
                            placeholder="example@example.com"
                        />
                    </label>
                    <p className="config-hint">Add a short description below the field</p>
                </div>

                <div className="config-divider" />

                {/* Duplicate Field */}
                <div className="config-section">
                    <button className="btn btn-secondary btn-block" onClick={handleDuplicate}>
                        Duplicate Field
                    </button>
                    <p className="config-hint">Duplicate this field with all saved settings</p>
                </div>

                <div className="config-divider" />

                {/* Delete Field */}
                <div className="config-section">
                    <button className="btn btn-danger btn-block" onClick={handleRemove}>
                        Delete Field
                    </button>
                </div>

                <ConfirmModal
                    isOpen={showDeleteModal}
                    title="Delete Field"
                    message={`Are you sure you want to delete "${selectedField.label}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    isDangerous={true}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            </div>
        );
    }

    // Render Full Name-specific configuration
    if (selectedField.type === FIELD_TYPES.FULL_NAME) {
        const firstNameLabel = selectedField.metadata?.firstNameLabel || 'First Name';
        const lastNameLabel = selectedField.metadata?.lastNameLabel || 'Last Name';

        return (
            <div className="field-configurator">
                <h3>Full Name Configuration</h3>

                {/* Field Name */}
                <div className="config-section">
                    <label>
                        <span>Field Name</span>
                        <input
                            type="text"
                            value={selectedField.label}
                            onChange={handleLabelChange}
                            placeholder="Enter field name"
                        />
                    </label>
                </div>

                <div className="config-divider" />

                {/* Required */}
                <div className="config-section">
                    <label>
                        <span>Required</span>
                        <button
                            type="button"
                            className={`alignment-btn ${selectedField.required ? 'active' : ''}`}
                            onClick={() =>
                                updateField(selectedFieldId, {
                                    required: !selectedField.required,
                                })
                            }
                        >
                            {selectedField.required ? 'Required' : 'Optional'}
                        </button>
                    </label>
                    <p className="config-hint">Prevent submission if this field is empty</p>
                </div>

                <div className="config-divider" />

                {/* Sublabels */}
                <div className="config-section">
                    <label>
                        <span>Sublabels</span>
                        <div className="sublabel-group">
                            <input
                                type="text"
                                value={firstNameLabel}
                                onChange={(e) =>
                                    updateField(selectedFieldId, {
                                        metadata: {
                                            ...selectedField.metadata,
                                            firstNameLabel: e.target.value,
                                        },
                                    })
                                }
                                placeholder="First Name"
                            />

                            <input
                                type="text"
                                value={lastNameLabel}
                                onChange={(e) =>
                                    updateField(selectedFieldId, {
                                        metadata: {
                                            ...selectedField.metadata,
                                            lastNameLabel: e.target.value,
                                        },
                                    })
                                }
                                placeholder="Last Name"
                            />
                        </div>
                    </label>
                </div>

                <div className="config-divider" />

                {/* Duplicate Field */}
                <div className="config-section">
                    <button className="btn btn-secondary btn-block" onClick={handleDuplicate}>
                        Duplicate Field
                    </button>
                    <p className="config-hint">Duplicate this field with all saved settings</p>
                </div>

                <div className="config-divider" />

                {/* Delete Field */}
                <div className="config-section">
                    <button className="btn btn-danger btn-block" onClick={handleRemove}>
                        Delete Field
                    </button>
                </div>

                <ConfirmModal
                    isOpen={showDeleteModal}
                    title="Delete Field"
                    message={`Are you sure you want to delete "${selectedField.label}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    isDangerous={true}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            </div>
        );
    }

    // Render Address-specific configuration
    if (selectedField.type === FIELD_TYPES.ADDRESS) {
        const streetAddress1 = selectedField.metadata?.streetAddress1 || 'Street Address';
        const streetAddress2 = selectedField.metadata?.streetAddress2 || 'Street Address Line 2';
        const city = selectedField.metadata?.city || 'City';
        const stateProvince = selectedField.metadata?.stateProvince || 'State / Province';
        const postalZipCode = selectedField.metadata?.postalZipCode || 'Postal / Zip Code';

        return (
            <div className="field-configurator">
                <h3>Address Configuration</h3>

                {/* Field Name */}
                <div className="config-section">
                    <label>
                        <span>Field Name</span>
                        <input
                            type="text"
                            value={selectedField.label}
                            onChange={handleLabelChange}
                            placeholder="Address"
                        />
                    </label>
                </div>

                <div className="config-divider" />

                {/* Required */}
                <div className="config-section">
                    <label>
                        <span>Required</span>
                        <button
                            type="button"
                            className={`alignment-btn ${selectedField.required ? 'active' : ''}`}
                            onClick={() =>
                                updateField(selectedFieldId, {
                                    required: !selectedField.required,
                                })
                            }
                        >
                            {selectedField.required ? 'Required' : 'Optional'}
                        </button>
                    </label>
                    <p className="config-hint">Prevent submission if this field is empty</p>
                </div>

                <div className="config-divider" />

                {/* Sublabels */}
                <div className="config-section">
                    <label>
                        <span>Sublabels</span>
                        <div className="sublabel-group">
                            <input
                                type="text"
                                value={streetAddress1}
                                onChange={(e) =>
                                    updateField(selectedFieldId, {
                                        metadata: {
                                            ...selectedField.metadata,
                                            streetAddress1: e.target.value,
                                        },
                                    })
                                }
                                placeholder="Street Address"
                            />

                            <input
                                type="text"
                                value={streetAddress2}
                                onChange={(e) =>
                                    updateField(selectedFieldId, {
                                        metadata: {
                                            ...selectedField.metadata,
                                            streetAddress2: e.target.value,
                                        },
                                    })
                                }
                                placeholder="Street Address Line 2"
                            />

                            <input
                                type="text"
                                value={city}
                                onChange={(e) =>
                                    updateField(selectedFieldId, {
                                        metadata: {
                                            ...selectedField.metadata,
                                            city: e.target.value,
                                        },
                                    })
                                }
                                placeholder="City"
                            />

                            <input
                                type="text"
                                value={stateProvince}
                                onChange={(e) =>
                                    updateField(selectedFieldId, {
                                        metadata: {
                                            ...selectedField.metadata,
                                            stateProvince: e.target.value,
                                        },
                                    })
                                }
                                placeholder="State / Province"
                            />

                            <input
                                type="text"
                                value={postalZipCode}
                                onChange={(e) =>
                                    updateField(selectedFieldId, {
                                        metadata: {
                                            ...selectedField.metadata,
                                            postalZipCode: e.target.value,
                                        },
                                    })
                                }
                                placeholder="Postal / Zip Code"
                            />
                        </div>
                    </label>
                </div>

                <div className="config-divider" />

                {/* Duplicate Field */}
                <div className="config-section">
                    <button className="btn btn-secondary btn-block" onClick={handleDuplicate}>
                        Duplicate Field
                    </button>
                    <p className="config-hint">Duplicate this field with all saved settings</p>
                </div>

                <ConfirmModal
                    isOpen={showDeleteModal}
                    title="Delete Field"
                    message={`Are you sure you want to delete "${selectedField.label}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    isDangerous={true}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            </div>
        );
    }

    // Render Full Phone-specific configuration
    if (selectedField.type === FIELD_TYPES.PHONE) {
        const sublabel = selectedField.metadata?.sublabel || '';

        return (
            <div className="field-configurator">
                <h3>Phone Configuration</h3>

                {/* Field Label */}
                <div className="config-section">
                    <label>
                        <span>Field Label</span>
                        <input
                            type="text"
                            value={selectedField.label}
                            onChange={handleLabelChange}
                            placeholder="Phone Number"
                        />
                    </label>
                </div>

                <div className="config-divider" />

                {/* Required */}
                <div className="config-section">
                    <label>
                        <span>Required</span>
                        <button
                            type="button"
                            className={`alignment-btn ${selectedField.required ? 'active' : ''}`}
                            onClick={() =>
                                updateField(selectedFieldId, {
                                    required: !selectedField.required,
                                })
                            }
                        >
                            {selectedField.required ? 'Required' : 'Optional'}
                        </button>
                    </label>
                    <p className="config-hint">Prevent submission if this field is empty</p>
                </div>

                <div className="config-divider" />

                {/* Sublabel */}
                <div className="config-section">
                    <label>
                        <span>Sublabel</span>
                        <input
                            type="text"
                            value={sublabel}
                            onChange={(e) =>
                                updateField(selectedFieldId, {
                                    metadata: {
                                        ...selectedField.metadata,
                                        sublabel: e.target.value,
                                    },
                                })
                            }
                            placeholder="(000) 000-0000"
                        />
                    </label>
                    <p className="config-hint">Add a short description below the field</p>
                </div>

                <div className="config-divider" />

                {/* Duplicate Field */}
                <div className="config-section">
                    <button className="btn btn-secondary btn-block" onClick={handleDuplicate}>
                        Duplicate Field
                    </button>
                    <p className="config-hint">Duplicate this field with all saved settings</p>
                </div>

                <div className="config-divider" />

                {/* Delete Field */}
                <div className="config-section">
                    <button className="btn btn-danger btn-block" onClick={handleRemove}>
                        Delete Field
                    </button>
                </div>

                <ConfirmModal
                    isOpen={showDeleteModal}
                    title="Delete Field"
                    message={`Are you sure you want to delete "${selectedField.label}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    isDangerous={true}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            </div>
        );
    }

    // Render Date-specific configuration
    if (selectedField.type === FIELD_TYPES.DATE) {
        const sublabel = selectedField.metadata?.sublabel || '';
        const separator = selectedField.metadata?.separator || '/';

        return (
            <div className="field-configurator">
                <h3>Date Configuration</h3>

                {/* Field Label */}
                <div className="config-section">
                    <label>
                        <span>Field Label</span>
                        <input
                            type="text"
                            value={selectedField.label}
                            onChange={handleLabelChange}
                            placeholder="Date"
                        />
                    </label>
                </div>

                <div className="config-divider" />

                {/* Required */}
                <div className="config-section">
                    <label>
                        <span>Required</span>
                        <button
                            type="button"
                            className={`alignment-btn ${selectedField.required ? 'active' : ''}`}
                            onClick={() =>
                                updateField(selectedFieldId, {
                                    required: !selectedField.required,
                                })
                            }
                        >
                            {selectedField.required ? 'Required' : 'Optional'}
                        </button>
                    </label>
                    <p className="config-hint">Prevent submission if this field is empty</p>
                </div>

                <div className="config-divider" />

                {/* Separator */}
                <div className="config-section">
                    <label>
                        <span>Separator</span>
                        <div className="alignment-buttons">
                            <button
                                type="button"
                                className={`alignment-btn ${separator === '-' ? 'active' : ''}`}
                                onClick={() =>
                                    updateField(selectedFieldId, {
                                        metadata: {
                                            ...selectedField.metadata,
                                            separator: '-',
                                        },
                                    })
                                }
                            >
                                -
                            </button>
                            <button
                                type="button"
                                className={`alignment-btn ${separator === '/' ? 'active' : ''}`}
                                onClick={() =>
                                    updateField(selectedFieldId, {
                                        metadata: {
                                            ...selectedField.metadata,
                                            separator: '/',
                                        },
                                    })
                                }
                            >
                                /
                            </button>
                            <button
                                type="button"
                                className={`alignment-btn ${separator === '.' ? 'active' : ''}`}
                                onClick={() =>
                                    updateField(selectedFieldId, {
                                        metadata: {
                                            ...selectedField.metadata,
                                            separator: '.',
                                        },
                                    })
                                }
                            >
                                .
                            </button>
                        </div>
                    </label>
                    <p className="config-hint">Select a character to use between date fields</p>
                </div>

                <div className="config-divider" />

                {/* Sublabel */}
                <div className="config-section">
                    <label>
                        <span>Sublabel</span>
                        <input
                            type="text"
                            value={sublabel}
                            onChange={(e) =>
                                updateField(selectedFieldId, {
                                    metadata: {
                                        ...selectedField.metadata,
                                        sublabel: e.target.value,
                                    },
                                })
                            }
                            placeholder="Date"
                        />
                    </label>
                    <p className="config-hint">Add a short description below the field</p>
                </div>

                <div className="config-divider" />

                {/* Duplicate Field */}
                <div className="config-section">
                    <button className="btn btn-secondary btn-block" onClick={handleDuplicate}>
                        Duplicate Field
                    </button>
                    <p className="config-hint">Duplicate this field with all saved settings</p>
                </div>

                <div className="config-divider" />

                {/* Delete Field */}
                <div className="config-section">
                    <button className="btn btn-danger btn-block" onClick={handleRemove}>
                        Delete Field
                    </button>
                </div>

                <ConfirmModal
                    isOpen={showDeleteModal}
                    title="Delete Field"
                    message={`Are you sure you want to delete "${selectedField.label}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    isDangerous={true}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            </div>
        );
    }

    // Render heading-specific configuration
    if (selectedField.type === FIELD_TYPES.HEADING) {
        const headingSize = selectedField.metadata?.headingSize || 'default';
        const textAlignment = selectedField.metadata?.textAlignment || 'left';

        return (
            <div className="field-configurator">
                <h3>Heading Configuration</h3>

                {/* Heading Text */}
                <div className="config-section">
                    <label>
                        <span>Heading Text</span>
                        <input
                            type="text"
                            value={selectedField.label}
                            onChange={handleLabelChange}
                            placeholder="Enter heading text"
                        />
                    </label>
                </div>

                <div className="config-divider" />

                {/* Subheading Text */}
                <div className="config-section">
                    <label>
                        <span>Subheading Text</span>
                        <input
                            type="text"
                            value={selectedField.placeholder}
                            onChange={handlePlaceholderChange}
                            placeholder="Enter subheading text"
                        />
                    </label>
                    <p className="config-hint">Add smaller text below the heading</p>
                </div>

                <div className="config-divider" />

                {/* Heading Size */}
                <div className="config-section">
                    <label>
                        <span>Heading Size</span>
                        <div className="alignment-buttons">
                            <button
                                type="button"
                                className={`alignment-btn ${headingSize === 'small' ? 'active' : ''}`}
                                onClick={() =>
                                    updateField(selectedFieldId, {
                                        metadata: {
                                            ...selectedField.metadata,
                                            headingSize: 'small',
                                        },
                                    })
                                }
                            >
                                Small
                            </button>
                            <button
                                type="button"
                                className={`alignment-btn ${headingSize === 'default' ? 'active' : ''}`}
                                onClick={() =>
                                    updateField(selectedFieldId, {
                                        metadata: {
                                            ...selectedField.metadata,
                                            headingSize: 'default',
                                        },
                                    })
                                }
                            >
                                Default
                            </button>
                            <button
                                type="button"
                                className={`alignment-btn ${headingSize === 'large' ? 'active' : ''}`}
                                onClick={() =>
                                    updateField(selectedFieldId, {
                                        metadata: {
                                            ...selectedField.metadata,
                                            headingSize: 'large',
                                        },
                                    })
                                }
                            >
                                Large
                            </button>
                        </div>
                    </label>
                </div>

                <div className="config-divider" />

                {/* Text Alignment */}
                <div className="config-section">
                    <label>
                        <span>Text Alignment</span>
                        <div className="alignment-buttons">
                            <button
                                type="button"
                                className={`alignment-btn ${textAlignment === 'left' ? 'active' : ''}`}
                                onClick={() =>
                                    updateField(selectedFieldId, {
                                        metadata: {
                                            ...selectedField.metadata,
                                            textAlignment: 'left',
                                        },
                                    })
                                }
                            >
                                Left
                            </button>
                            <button
                                type="button"
                                className={`alignment-btn ${textAlignment === 'center' ? 'active' : ''}`}
                                onClick={() =>
                                    updateField(selectedFieldId, {
                                        metadata: {
                                            ...selectedField.metadata,
                                            textAlignment: 'center',
                                        },
                                    })
                                }
                            >
                                Center
                            </button>
                            <button
                                type="button"
                                className={`alignment-btn ${textAlignment === 'right' ? 'active' : ''}`}
                                onClick={() =>
                                    updateField(selectedFieldId, {
                                        metadata: {
                                            ...selectedField.metadata,
                                            textAlignment: 'right',
                                        },
                                    })
                                }
                            >
                                Right
                            </button>
                        </div>
                    </label>
                    <p className="config-hint">Select how the heading is aligned horizontally</p>
                </div>

                <div className="config-divider" />

                {/* Duplicate Field */}
                <div className="config-section">
                    <button className="btn btn-secondary btn-block" onClick={handleDuplicate}>
                        Duplicate Field
                    </button>
                    <p className="config-hint">Duplicate this field with all saved settings</p>
                </div>

                <div className="config-divider" />

                {/* Hide Field */}
                <div className="config-section">
                    <button className="btn btn-secondary btn-block">
                        Hide Field
                    </button>
                </div>

                <div className="config-divider" />

                {/* Delete Field */}
                <div className="config-section">
                    <button className="btn btn-danger btn-block" onClick={handleRemove}>
                        Delete Field
                    </button>
                </div>

                <ConfirmModal
                    isOpen={showDeleteModal}
                    title="Delete Field"
                    message={`Are you sure you want to delete "${selectedField.label}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    isDangerous={true}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            </div>
        );
    }

    return (
        <div className = "field-configurator">
            <h3>Field Configuration</h3>

            <div className = "config-section">
                <label>
                    <span>Label *</span>
                    <input
                        type = "text"
                        value = {selectedField.label}
                        onChange = {handleLabelChange}
                        placeholder = "Field label"
                    />
                </label>
            </div>

            <div className = "config-section">
                <label>
                    <span>Type</span>
                    <input 
                        type = "text"
                        value = {selectedField.type}
                        disabled
                    />
                </label>
            </div>

            {selectedField.type !== FIELD_TYPES.CHECKBOX && (
                <div className = "config-section">
                    <label>
                        <span>Placeholder</span>
                        <input 
                            type = "text"
                            value = {selectedField.placeholder}
                            onChange = {handlePlaceholderChange}
                            placeholder = "Placeholder text"
                        />
                    </label>
                </div>
            )}

            <div className = "config-section">
                <label>
                    <span>Help Text</span>
                    <textarea 
                        value = {selectedField.helpText}
                        onChange = {handleHelpTextChange}
                        placeholder = "Help text for users"
                        rows = "3"
                    />
                </label>
            </div>

            <div className = "config-section checkbox">
                <label>
                    <input 
                        type = "checkbox"
                        checked = {selectedField.required}
                        onChange = {handleRequiredChange}
                    />
                    <span>Required Field</span>
                </label>
            </div>

            <div className = "config-divider" />

            <div className = "config-section">
                <button
                    className = "btn btn-secondary btn-small"
                    onClick = {() => setShowValidationPanel(!showValidationPanel)}
                >
                    {showValidationPanel ? '- Validation Rules' : '+ Validation Rules'}
                </button>
            </div>

            {showValidationPanel && (
                <ValidationRulesList 
                    field = {selectedField}
                    onAddValidation = {handleAddValidation}
                    onUpdateValidation = {handleUpdateValidation}
                    onRemoveValidation = {handleRemoveValidation}
                />
            )}

            <div className = "config-section">
                <ConditionalRuleBuilder fieldId = {selectedFieldId} />
            </div>

            <div className = "config-actions">
                <button className = "btn btn-secondary" onClick = {handleDuplicate}>
                    Duplicate
                </button>
                <button className = "btn btn-danger" onClick = {handleRemove}>
                    Delete
                </button>
            </div>

            <ConfirmModal 
                isOpen = {showDeleteModal}
                title = "Delete Field"
                message = {`Are you sure you want to delete "${selectedField.label}"? This action cannot be undone.`}
                confirmText = "Delete"
                cancelText = "Cancel"
                isDangerous = {true}
                onConfirm = {handleConfirmDelete}
                onCancel = {handleCancelDelete}
            />
        </div>
    );
}
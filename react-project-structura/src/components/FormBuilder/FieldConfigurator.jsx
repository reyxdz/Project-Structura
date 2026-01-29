// Configure selected field properties
// Phase 3 Step 5.1: Added conditional builder to the field configurator

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
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
    const [newOptionValue, setNewOptionValue] = useState('');

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

    // Render Short Text-specific configuration
    if (selectedField.type === FIELD_TYPES.SHORT_TEXT) {
        const sublabel = selectedField.metadata?.sublabel || '';
        const characterLimitEnabled = selectedField.metadata?.characterLimitEnabled || false;
        const maxCharacters = selectedField.metadata?.maxCharacters || '';

        return (
            <div className="field-configurator">
                <h3>Short Text Configuration</h3>

                {/* Field Label */}
                <div className="config-section">
                    <label>
                        <span>Field Label</span>
                        <input
                            type="text"
                            value={selectedField.label}
                            onChange={handleLabelChange}
                            placeholder="Type a question"
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
                            placeholder="Type a sublabel"
                        />
                    </label>
                    <p className="config-hint">Add a short description below the field</p>
                </div>

                <div className="config-divider" />

                {/* Character Limit */}
                <div className="config-section">
                    <label>
                        <span>Character Limit</span>
                        <div className="character-limit-group">
                            <button
                                type="button"
                                className={`alignment-btn ${characterLimitEnabled ? 'active' : ''}`}
                                onClick={() =>
                                    updateField(selectedFieldId, {
                                        metadata: {
                                            ...selectedField.metadata,
                                            characterLimitEnabled: !characterLimitEnabled,
                                        },
                                    })
                                }
                            >
                                {characterLimitEnabled ? 'On' : 'Off'}
                            </button>
                            {characterLimitEnabled && (
                                <input
                                    type="number"
                                    min="1"
                                    value={maxCharacters}
                                    onChange={(e) =>
                                        updateField(selectedFieldId, {
                                            metadata: {
                                                ...selectedField.metadata,
                                                maxCharacters: parseInt(e.target.value) || 0,
                                            },
                                        })
                                    }
                                    placeholder="Maximum character limit"
                                    className="character-limit-input"
                                />
                            )}
                        </div>
                    </label>
                    <p className="config-hint">Limit the number of characters allowed for this field</p>
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

    // Render Long Text-specific configuration
    if (selectedField.type === FIELD_TYPES.LONG_TEXT) {
        const sublabel = selectedField.metadata?.sublabel || '';
        const wordLimitEnabled = selectedField.metadata?.wordLimitEnabled || false;
        const maxWords = selectedField.metadata?.maxWords || '';

        return (
            <div className="field-configurator">
                <h3>Long Text Configuration</h3>

                {/* Field Label */}
                <div className="config-section">
                    <label>
                        <span>Field Label</span>
                        <input
                            type="text"
                            value={selectedField.label}
                            onChange={handleLabelChange}
                            placeholder="Type a question"
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
                            placeholder="Type a sublabel"
                        />
                    </label>
                    <p className="config-hint">Add a short description below the field</p>
                </div>

                <div className="config-divider" />

                {/* Word Limit */}
                <div className="config-section">
                    <label>
                        <span>Word Limit</span>
                        <div className="word-limit-group">
                            <button
                                type="button"
                                className={`alignment-btn ${wordLimitEnabled ? 'active' : ''}`}
                                onClick={() =>
                                    updateField(selectedFieldId, {
                                        metadata: {
                                            ...selectedField.metadata,
                                            wordLimitEnabled: !wordLimitEnabled,
                                        },
                                    })
                                }
                            >
                                {wordLimitEnabled ? 'On' : 'Off'}
                            </button>
                            {wordLimitEnabled && (
                                <input
                                    type="number"
                                    min="1"
                                    value={maxWords}
                                    onChange={(e) =>
                                        updateField(selectedFieldId, {
                                            metadata: {
                                                ...selectedField.metadata,
                                                maxWords: parseInt(e.target.value) || 0,
                                            },
                                        })
                                    }
                                    placeholder="Maximum word limit"
                                    className="word-limit-input"
                                />
                            )}
                        </div>
                    </label>
                    <p className="config-hint">Limit the number of words allowed for this field</p>
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

    // Render Dropdown-specific configuration
    if (selectedField.type === FIELD_TYPES.DROPDOWN) {
        const sublabel = selectedField.metadata?.sublabel || '';
        const options = selectedField.options || [];

        return (
            <div className="field-configurator">
                <h3>Dropdown Configuration</h3>

                {/* Field Label */}
                <div className="config-section">
                    <label>
                        <span>Field Label</span>
                        <input
                            type="text"
                            value={selectedField.label}
                            onChange={handleLabelChange}
                            placeholder="Type a question"
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
                            placeholder="Type a sublabel"
                        />
                    </label>
                    <p className="config-hint">Add a short description below the field</p>
                </div>

                <div className="config-divider" />

                {/* Options */}
                <div className="config-section">
                    <label>
                        <span>Options</span>
                    </label>
                    <div className="options-list">
                        {options.map((option, idx) => (
                            <div key={idx} className="option-item">
                                <input
                                    type="text"
                                    value={option.label || ''}
                                    onChange={(e) => {
                                        const updatedOptions = [...options];
                                        updatedOptions[idx] = { label: e.target.value };
                                        updateField(selectedFieldId, { options: updatedOptions });
                                    }}
                                    className="option-text-input"
                                />
                                <button
                                    type="button"
                                    className="option-delete-btn"
                                    onClick={() => {
                                        const updatedOptions = options.filter((_, i) => i !== idx);
                                        updateField(selectedFieldId, { options: updatedOptions });
                                    }}
                                    title="Delete option"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="add-new-option-group">
                        <input
                            type="text"
                            placeholder="Enter option text"
                            className="add-option-input"
                            value={newOptionValue}
                            onChange={(e) => setNewOptionValue(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && newOptionValue.trim()) {
                                    const newOption = { label: newOptionValue.trim() };
                                    updateField(selectedFieldId, {
                                        options: [...options, newOption],
                                    });
                                    setNewOptionValue('');
                                }
                            }}
                        />
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                if (newOptionValue.trim()) {
                                    const newOption = { label: newOptionValue.trim() };
                                    updateField(selectedFieldId, {
                                        options: [...options, newOption],
                                    });
                                    setNewOptionValue('');
                                }
                            }}
                            disabled={!newOptionValue.trim()}
                        >
                            Add
                        </button>
                    </div>
                    <p className="config-hint">Add options for users to choose from</p>
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

    // Render Single Choice-specific configuration
    if (selectedField.type === FIELD_TYPES.SINGLE_CHOICE) {
        const options = selectedField.options || [];

        return (
            <div className="field-configurator">
                <h3>Single Choice Configuration</h3>

                {/* Field Label */}
                <div className="config-section">
                    <label>
                        <span>Field Label</span>
                        <input
                            type="text"
                            value={selectedField.label}
                            onChange={handleLabelChange}
                            placeholder="Type a question"
                        />
                    </label>
                </div>

                <div className="config-divider" />

                {/* Options */}
                <div className="config-section">
                    <label>
                        <span>Options</span>
                    </label>
                    <div className="options-list">
                        {options.map((option, idx) => (
                            <div key={idx} className="option-item">
                                <input
                                    type="text"
                                    value={option.label || ''}
                                    onChange={(e) => {
                                        const updatedOptions = [...options];
                                        updatedOptions[idx] = { label: e.target.value };
                                        updateField(selectedFieldId, { options: updatedOptions });
                                    }}
                                    className="option-text-input"
                                />
                                <button
                                    type="button"
                                    className="option-delete-btn"
                                    onClick={() => {
                                        const updatedOptions = options.filter((_, i) => i !== idx);
                                        updateField(selectedFieldId, { options: updatedOptions });
                                    }}
                                    title="Delete option"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="add-new-option-group">
                        <input
                            type="text"
                            placeholder="Enter option text"
                            className="add-option-input"
                            value={newOptionValue}
                            onChange={(e) => setNewOptionValue(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && newOptionValue.trim()) {
                                    const newOption = { label: newOptionValue.trim() };
                                    updateField(selectedFieldId, {
                                        options: [...options, newOption],
                                    });
                                    setNewOptionValue('');
                                }
                            }}
                        />
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                if (newOptionValue.trim()) {
                                    const newOption = { label: newOptionValue.trim() };
                                    updateField(selectedFieldId, {
                                        options: [...options, newOption],
                                    });
                                    setNewOptionValue('');
                                }
                            }}
                            disabled={!newOptionValue.trim()}
                        >
                            Add
                        </button>
                    </div>
                    <p className="config-hint">Add options for users to choose from</p>
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

    // Render Multiple Choice-specific configuration
    if (selectedField.type === FIELD_TYPES.MULTIPLE_CHOICE) {
        const options = selectedField.options || [];

        return (
            <div className="field-configurator">
                <h3>Multiple Choice Configuration</h3>

                {/* Field Label */}
                <div className="config-section">
                    <label>
                        <span>Field Label</span>
                        <input
                            type="text"
                            value={selectedField.label}
                            onChange={handleLabelChange}
                            placeholder="Type a question"
                        />
                    </label>
                </div>

                <div className="config-divider" />

                {/* Options */}
                <div className="config-section">
                    <label>
                        <span>Options</span>
                    </label>
                    <div className="options-list">
                        {options.map((option, idx) => (
                            <div key={idx} className="option-item">
                                <input
                                    type="text"
                                    value={option.label || ''}
                                    onChange={(e) => {
                                        const updatedOptions = [...options];
                                        updatedOptions[idx] = { label: e.target.value };
                                        updateField(selectedFieldId, { options: updatedOptions });
                                    }}
                                    className="option-text-input"
                                />
                                <button
                                    type="button"
                                    className="option-delete-btn"
                                    onClick={() => {
                                        const updatedOptions = options.filter((_, i) => i !== idx);
                                        updateField(selectedFieldId, { options: updatedOptions });
                                    }}
                                    title="Delete option"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="add-new-option-group">
                        <input
                            type="text"
                            placeholder="Enter option text"
                            className="add-option-input"
                            value={newOptionValue}
                            onChange={(e) => setNewOptionValue(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && newOptionValue.trim()) {
                                    const newOption = { label: newOptionValue.trim() };
                                    updateField(selectedFieldId, {
                                        options: [...options, newOption],
                                    });
                                    setNewOptionValue('');
                                }
                            }}
                        />
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                if (newOptionValue.trim()) {
                                    const newOption = { label: newOptionValue.trim() };
                                    updateField(selectedFieldId, {
                                        options: [...options, newOption],
                                    });
                                    setNewOptionValue('');
                                }
                            }}
                            disabled={!newOptionValue.trim()}
                        >
                            Add
                        </button>
                    </div>
                    <p className="config-hint">Add options for users to choose from</p>
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

    // Render appointment-specific configuration
    if (selectedField.type === FIELD_TYPES.APPOINTMENT) {
        const sublabel = selectedField.metadata?.sublabel || '';
        const slotDuration = selectedField.metadata?.slotDuration || '30';
        const customSlotDuration = selectedField.metadata?.customSlotDuration || '';
        const intervals = selectedField.metadata?.intervals || [];
        const timezone = selectedField.metadata?.timezone || 'America/New York';
        const daysOfWeekOptions = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

        const handleSlotDurationChange = (duration) => {
            updateField(selectedFieldId, {
                metadata: {
                    ...selectedField.metadata,
                    slotDuration: duration,
                    customSlotDuration: duration === 'custom' ? customSlotDuration : null,
                },
            });
        };

        const handleCustomSlotDurationChange = (value) => {
            updateField(selectedFieldId, {
                metadata: {
                    ...selectedField.metadata,
                    customSlotDuration: value,
                },
            });
        };

        const handleAddInterval = () => {
            const newInterval = {
                id: uuidv4(),
                startTime: '09:00',
                endTime: '17:00',
                daysOfWeek: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
            };
            updateField(selectedFieldId, {
                metadata: {
                    ...selectedField.metadata,
                    intervals: [...intervals, newInterval],
                },
            });
        };

        const handleUpdateInterval = (intervalId, updates) => {
            const updatedIntervals = intervals.map((interval) =>
                interval.id === intervalId ? { ...interval, ...updates } : interval
            );
            updateField(selectedFieldId, {
                metadata: {
                    ...selectedField.metadata,
                    intervals: updatedIntervals,
                },
            });
        };

        const handleRemoveInterval = (intervalId) => {
            const updatedIntervals = intervals.filter((interval) => interval.id !== intervalId);
            updateField(selectedFieldId, {
                metadata: {
                    ...selectedField.metadata,
                    intervals: updatedIntervals,
                },
            });
        };

        return (
            <div className="field-configurator">
                <h3>Appointment Configuration</h3>

                {/* Field Label */}
                <div className="config-section">
                    <label>
                        <span>Field Label</span>
                        <input
                            type="text"
                            value={selectedField.label}
                            onChange={handleLabelChange}
                            placeholder="Appointment"
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

                {/* Slot Duration */}
                <div className="config-section">
                    <label>
                        <span>Appointment Slot Duration</span>
                        <p className="config-hint" style={{ marginTop: '-2px' }}>
                            Select the length of each appointment slot
                        </p>
                    </label>
                    <div className="appointment-duration-buttons">
                        {['15', '30', '45', '60'].map((duration) => (
                            <button
                                key={duration}
                                type="button"
                                className={`appointment-duration-btn ${slotDuration === duration ? 'active' : ''}`}
                                onClick={() => handleSlotDurationChange(duration)}
                            >
                                {duration} min
                            </button>
                        ))}
                        <button
                            type="button"
                            className={`appointment-duration-btn ${slotDuration === 'custom' ? 'active' : ''}`}
                            onClick={() => handleSlotDurationChange('custom')}
                        >
                            Custom
                        </button>
                    </div>
                    {slotDuration === 'custom' && (
                        <div style={{ marginTop: '12px' }}>
                            <input
                                type="number"
                                min="1"
                                max="480"
                                value={customSlotDuration || ''}
                                onChange={(e) => handleCustomSlotDurationChange(e.target.value)}
                                placeholder="Enter minutes"
                                style={{ width: '100%' }}
                            />
                        </div>
                    )}
                </div>

                <div className="config-divider" />

                {/* Intervals */}
                <div className="config-section">
                    <label>
                        <span>Intervals</span>
                        <p className="config-hint" style={{ marginTop: '-2px' }}>
                            Define the days and times you will accept appointments
                        </p>
                    </label>

                    <div className="appointment-intervals-list">
                        {intervals.length === 0 ? (
                            <p className="config-hint" style={{ textAlign: 'center', padding: '12px' }}>
                                No intervals added yet
                            </p>
                        ) : (
                            intervals.map((interval) => (
                                <div key={interval.id} className="appointment-interval-item">
                                    <div className="appointment-interval-header">
                                        <button
                                            type="button"
                                            className="appointment-interval-delete-btn"
                                            onClick={() => handleRemoveInterval(interval.id)}
                                            title="Remove interval"
                                        >
                                            ×
                                        </button>
                                    </div>

                                    <div className="appointment-interval-times">
                                        <div className="interval-time-group">
                                            <label>From</label>
                                            <input
                                                type="time"
                                                value={interval.startTime || '09:00'}
                                                onChange={(e) =>
                                                    handleUpdateInterval(interval.id, {
                                                        startTime: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className="interval-time-group">
                                            <label>To</label>
                                            <input
                                                type="time"
                                                value={interval.endTime || '17:00'}
                                                onChange={(e) =>
                                                    handleUpdateInterval(interval.id, {
                                                        endTime: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="appointment-weekdays-selector">
                                        <label>Weekdays</label>
                                        <select
                                            multiple
                                            value={interval.daysOfWeek || []}
                                            onChange={(e) => {
                                                const selected = Array.from(
                                                    e.target.selectedOptions,
                                                    (option) => option.value
                                                );
                                                handleUpdateInterval(interval.id, {
                                                    daysOfWeek: selected,
                                                });
                                            }}
                                            className="appointment-weekdays-multi-select"
                                        >
                                            {daysOfWeekOptions.map((day) => (
                                                <option key={day} value={day}>
                                                    {day}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <button
                        type="button"
                        className="appointment-add-interval-btn"
                        onClick={handleAddInterval}
                    >
                        + Add New Interval
                    </button>
                </div>

                <div className="config-divider" />

                {/* Timezone */}
                <div className="config-section">
                    <label>
                        <span>Timezone</span>
                        <input
                            type="text"
                            value={timezone}
                            onChange={(e) =>
                                updateField(selectedFieldId, {
                                    metadata: {
                                        ...selectedField.metadata,
                                        timezone: e.target.value,
                                    },
                                })
                            }
                            placeholder="America/New York"
                        />
                    </label>
                    <p className="config-hint">Display timezone information for users</p>
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
                            placeholder="Select your preferred appointment date and time"
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

    // Render signature-specific configuration
    if (selectedField.type === FIELD_TYPES.SIGNATURE) {
        const placeholder = selectedField.placeholder || 'Sign Here';

        return (
            <div className="field-configurator">
                <h3>Signature Configuration</h3>

                {/* Field Label */}
                <div className="config-section">
                    <label>
                        <span>Field Label</span>
                        <input
                            type="text"
                            value={selectedField.label}
                            onChange={handleLabelChange}
                            placeholder="Signature"
                        />
                    </label>
                </div>

                <div className="config-divider" />

                {/* Placeholder */}
                <div className="config-section">
                    <label>
                        <span>Placeholder</span>
                        <input
                            type="text"
                            value={placeholder}
                            onChange={(e) =>
                                updateField(selectedFieldId, {
                                    placeholder: e.target.value,
                                })
                            }
                            placeholder="Sign Here"
                        />
                    </label>
                    <p className="config-hint">Text shown in the signature area</p>
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

    // Render number-specific configuration
    if (selectedField.type === FIELD_TYPES.NUMBER) {
        const sublabel = selectedField.metadata?.sublabel || '';
        const minimumValue = selectedField.metadata?.minimumValue || '';
        const maximumValue = selectedField.metadata?.maximumValue || '';

        return (
            <div className="field-configurator">
                <h3>Number Configuration</h3>

                {/* Field Label */}
                <div className="config-section">
                    <label>
                        <span>Field Label</span>
                        <input
                            type="text"
                            value={selectedField.label}
                            onChange={handleLabelChange}
                            placeholder="Number"
                        />
                    </label>
                </div>

                <div className="config-divider" />

                {/* Entry Limits */}
                <div className="config-section">
                    <label>
                        <span>Entry Limits</span>
                    </label>
                    <div className="entry-limits-group">
                        <div className="limit-input-wrapper">
                            <label>Minimum</label>
                            <input
                                type="number"
                                value={minimumValue}
                                onChange={(e) =>
                                    updateField(selectedFieldId, {
                                        metadata: { ...selectedField.metadata, minimumValue: e.target.value },
                                    })
                                }
                                placeholder="No limit"
                            />
                        </div>
                        <div className="limit-input-wrapper">
                            <label>Maximum</label>
                            <input
                                type="number"
                                value={maximumValue}
                                onChange={(e) =>
                                    updateField(selectedFieldId, {
                                        metadata: { ...selectedField.metadata, maximumValue: e.target.value },
                                    })
                                }
                                placeholder="No limit"
                            />
                        </div>
                    </div>
                    <p className="config-hint">Set minimum and maximum values allowed</p>
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
                                    metadata: { ...selectedField.metadata, sublabel: e.target.value },
                                })
                            }
                            placeholder="Type a sublabel"
                        />
                    </label>
                    <p className="config-hint">Additional help text shown below the field</p>
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

    // Render image-specific configuration
    if (selectedField.type === FIELD_TYPES.IMAGE) {
        const imageFileName = selectedField.metadata?.imageFileName || '';
        const imageHeight = selectedField.metadata?.imageHeight || 200;
        const imageWidth = selectedField.metadata?.imageWidth || 200;
        const originalImageHeight = selectedField.metadata?.originalImageHeight || 0;
        const originalImageWidth = selectedField.metadata?.originalImageWidth || 0;
        
        const handleImageUpload = (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    updateField(selectedFieldId, {
                        metadata: {
                            ...selectedField.metadata,
                            imageData: event.target?.result,
                            imageFileName: file.name,
                            originalImageHeight: img.height,
                            originalImageWidth: img.width,
                            imageHeight: Math.min(img.height, img.height * 5),
                            imageWidth: Math.min(img.width, img.width * 5),
                        },
                    });
                };
                img.src = event.target?.result;
            };
            reader.readAsDataURL(file);
        };

        const handleDimensionChange = (value) => {
            const numValue = parseInt(value) || 0;
            const maxDimension = Math.max(originalImageHeight, originalImageWidth) * 5 || Infinity;
            
            // Enforce min of 0 and max based on original dimensions
            const constrainedValue = Math.max(0, Math.min(numValue, maxDimension));
            
            updateField(selectedFieldId, {
                metadata: {
                    ...selectedField.metadata,
                    imageHeight: constrainedValue,
                    imageWidth: constrainedValue,
                },
            });
        };

        return (
            <div className="field-configurator">
                <h3>Image Configuration</h3>

                {/* Field Label */}
                <div className="config-section">
                    <label>
                        <span>Field Label</span>
                        <input
                            type="text"
                            value={selectedField.label}
                            onChange={handleLabelChange}
                            placeholder="Image"
                        />
                    </label>
                </div>

                <div className="config-divider" />

                {/* Image Upload */}
                <div className="config-section">
                    <label>
                        <span>Upload Image</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="image-upload-input"
                        />
                    </label>
                    {imageFileName && (
                        <p className="config-hint">Uploaded: {imageFileName}</p>
                    )}
                </div>

                <div className="config-divider" />

                {/* Image Dimensions */}
                {originalImageHeight > 0 && originalImageWidth > 0 && (
                    <>
                        <div className="config-section">
                            <label>
                                <span>Image Size (px)</span>
                                <input
                                    type="number"
                                    value={imageHeight}
                                    onChange={(e) => handleDimensionChange(e.target.value)}
                                    min="0"
                                    max={Math.max(originalImageHeight, originalImageWidth) * 5}
                                />
                            </label>
                            <p className="config-hint">Height and width are locked together. Max: {Math.max(originalImageHeight, originalImageWidth) * 5}px (5x original)</p>
                        </div>

                        <div className="config-divider" />

                        {/* Image Alignment */}
                        <div className="config-section">
                            <label>
                                <span>Image Alignment</span>
                                <div className="alignment-buttons">
                                    <button
                                        type="button"
                                        className={`alignment-btn ${selectedField.metadata?.imageAlignment === 'left' ? 'active' : ''}`}
                                        onClick={() =>
                                            updateField(selectedFieldId, {
                                                metadata: {
                                                    ...selectedField.metadata,
                                                    imageAlignment: 'left',
                                                },
                                            })
                                        }
                                    >
                                        Left
                                    </button>
                                    <button
                                        type="button"
                                        className={`alignment-btn ${selectedField.metadata?.imageAlignment === 'center' ? 'active' : ''}`}
                                        onClick={() =>
                                            updateField(selectedFieldId, {
                                                metadata: {
                                                    ...selectedField.metadata,
                                                    imageAlignment: 'center',
                                                },
                                            })
                                        }
                                    >
                                        Center
                                    </button>
                                    <button
                                        type="button"
                                        className={`alignment-btn ${selectedField.metadata?.imageAlignment === 'right' ? 'active' : ''}`}
                                        onClick={() =>
                                            updateField(selectedFieldId, {
                                                metadata: {
                                                    ...selectedField.metadata,
                                                    imageAlignment: 'right',
                                                },
                                            })
                                        }
                                    >
                                        Right
                                    </button>
                                </div>
                            </label>
                        </div>

                        <div className="config-divider" />
                    </>
                )}}

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

    // Render file-specific configuration
    if (selectedField.type === FIELD_TYPES.FILE) {
        const fileAlignment = selectedField.metadata?.fileAlignment || 'center';
        const maxFileSize = selectedField.metadata?.maxFileSize || 5;
        const maxFileSizeUnit = selectedField.metadata?.maxFileSizeUnit || 'mb';
        const acceptedFileTypes = selectedField.metadata?.acceptedFileTypes || [];
        
        const availableFileTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'png', 'jpg', 'jpeg', 'gif', 'txt', 'csv'];
        
        const handleFileTypeToggle = (fileType) => {
            const newTypes = acceptedFileTypes.includes(fileType)
                ? acceptedFileTypes.filter(t => t !== fileType)
                : [...acceptedFileTypes, fileType];
            
            updateField(selectedFieldId, {
                metadata: {
                    ...selectedField.metadata,
                    acceptedFileTypes: newTypes,
                },
            });
        };

        return (
            <div className="field-configurator">
                <h3>File Upload Configuration</h3>

                {/* Field Label */}
                <div className="config-section">
                    <label>
                        <span>Field Label</span>
                        <input
                            type="text"
                            value={selectedField.label}
                            onChange={handleLabelChange}
                            placeholder="File Upload"
                        />
                    </label>
                </div>

                <div className="config-divider" />

                {/* Max File Size */}
                <div className="config-section">
                    <label>
                        <span>Maximum File Size</span>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input
                                type="number"
                                value={maxFileSize}
                                onChange={(e) =>
                                    updateField(selectedFieldId, {
                                        metadata: {
                                            ...selectedField.metadata,
                                            maxFileSize: parseInt(e.target.value) || 0,
                                        },
                                    })
                                }
                                placeholder="5"
                                className="file-size-input"
                            />
                            <select
                                value={maxFileSizeUnit}
                                onChange={(e) =>
                                    updateField(selectedFieldId, {
                                        metadata: {
                                            ...selectedField.metadata,
                                            maxFileSizeUnit: e.target.value,
                                        },
                                    })
                                }
                                className="file-size-unit"
                            >
                                <option value="kb">KB</option>
                                <option value="mb">MB</option>
                            </select>
                        </div>
                    </label>
                </div>

                <div className="config-divider" />

                {/* Accepted File Types */}
                <div className="config-section">
                    <label>
                        <span>Accepted File Types</span>
                    </label>
                    <div className="file-types-checklist">
                        {availableFileTypes.map(fileType => (
                            <div key={fileType} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <input
                                    type="checkbox"
                                    id={`file-type-${fileType}`}
                                    checked={acceptedFileTypes.includes(fileType)}
                                    onChange={() => handleFileTypeToggle(fileType)}
                                    style={{ cursor: 'pointer' }}
                                />
                                <label htmlFor={`file-type-${fileType}`} style={{ cursor: 'pointer', flex: 1, margin: 0, color: '#333', fontSize: '13px' }}>
                                    {fileType.toUpperCase()}
                                </label>
                            </div>
                        ))}
                    </div>
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
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
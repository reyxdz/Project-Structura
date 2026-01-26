// Render the form for preview/testing
// Phase 3.6.1: Added conditional visibility to field rendering:

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useFormStore } from '../../stores/formStore';
import { FIELD_TYPES } from '../../types/formTypes';
import { shouldFieldBeVisible, shouldFieldBeEnabled } from '../../utils/conditionalRules';
import FormField from './FormField';
import './FormPreview.css';

export default function FormPreview() {
    const { form, previewData, setPreviewData, clearPreviewData } = useFormStore();
    const { handleSubmit } = useForm({
        mode: 'onChange',
    });

    const onSubmit = (data) => {
        setPreviewData(data);
        alert('Form submitted! Check console for data.');
        console.log('Form Data: ', data);
    };

    const onClear = () => {
        clearPreviewData();
    }

    return (
        <div className = "form-preview">
            <div className = "form-preview-header">
                <h2>{form.name}</h2>
                {form.description && <p className = "form-description">{form.description}</p>}
            </div>

            <form onSubmit = {handleSubmit(onSubmit)} className = "form-preview-body">
                {form.fields.length === 0 ? (
                    <div className = "form-empty-state">
                        <p>No fields in this form yet</p>
                    </div>
                ) : (
                    <div className = "form-fields">
                        {form.fields.map((field) => {
                            // Check if field should be visible based on conditionals
                            const isVisible = shouldFieldBeVisible(field, previewData, form.fields);
                            const isEnabled = shouldFieldBeEnabled(field, previewData, form.fields);

                            if (!isVisible) {
                                return null; // Don't render hiddedn fields
                            }

                            return (
                                <FormField
                                    key = {field.id}
                                    field = {field}
                                    value = {previewData[field.id] || ''}
                                    onChange = {(value) => setPreviewData({ ...previewData, [field.id]: value })}
                                    disabled = {!isEnabled}
                                />
                            );
                        })}
                    </div>
                )}

                <div className = "form-actions">
                    <button type = "submit" className = "btn btn-primary">
                        Submit
                    </button>
                    <button
                        type = "button"
                        className = "btn btn-secondary"
                        onClick = {onClear}
                    >
                        Clear
                    </button>
                </div>
            </form>
        </div>
    );
}
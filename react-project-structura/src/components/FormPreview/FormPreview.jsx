// Render the form for preview/testing
// Phase 3.6.1: Added conditional visibility to field rendering:

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useFormStore } from '../../stores/formStore';
import { FIELD_TYPES } from '../../types/formTypes';
import { shouldFieldBeVisible } from '../../utils/conditionalRules';
import FormField from './FormField';
import './FormPreview.css';

export default function FormPreview() {
    const { form, previewData, setPreviewData, clearPreviewData } = useFormStore();
    const { handleSubmit, control } = useForm({
        mode: 'onChange',
    });
    const [selectedDevice, setSelectedDevice] = React.useState('desktop');

    const onSubmit = (data) => {
        setPreviewData(data);
        alert('Form submitted! Check console for data.');
        console.log('Form Data: ', data);
    };

    const onClear = () => {
        clearPreviewData();
    }

    const renderFormContent = () => (
        <>
            {form.fields.length === 0 ? (
                <div className = "form-empty-state">
                    <p>No fields in this form yet</p>
                </div>
            ) : (
                <div className = "form-fields">
                    {form.fields.map((field) => {
                        // Check if field should be visible based on conditionals
                        const isVisible = shouldFieldBeVisible(field, previewData, form.fields);

                        if (!isVisible) {
                            return null; // Don't render hiddedn fields
                        }

                        return (
                            <FormField
                                key = {field.id}
                                field = {field}
                                control = {control}
                                error = {null}
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
        </>
    );

    return (
        <div className = "form-preview">
            <div className="form-preview-header">
                <div className="device-selector">
                    <button 
                        className={`device-btn ${selectedDevice === 'mobile' ? 'active' : ''}`}
                        onClick={() => setSelectedDevice('mobile')}
                        title="Mobile Preview"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                            <line x1="12" y1="18" x2="12.01" y2="18"></line>
                        </svg>
                        <span>Phone</span>
                    </button>
                    <button 
                        className={`device-btn ${selectedDevice === 'tablet' ? 'active' : ''}`}
                        onClick={() => setSelectedDevice('tablet')}
                        title="Tablet Preview"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                        <span>Tablet</span>
                    </button>
                    <button 
                        className={`device-btn ${selectedDevice === 'desktop' ? 'active' : ''}`}
                        onClick={() => setSelectedDevice('desktop')}
                        title="Desktop Preview"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                            <line x1="2" y1="20" x2="22" y2="20"></line>
                        </svg>
                        <span>Desktop</span>
                    </button>
                </div>
            </div>

            <div className={`form-preview-container ${selectedDevice}-view`}>
                <form onSubmit = {handleSubmit(onSubmit)} className = "form-preview-body">
                    {renderFormContent()}
                </form>
            </div>
        </div>
    );
}
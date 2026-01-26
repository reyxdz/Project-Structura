// Render the form for preview/testing

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useFormStore } from '../../stores/formStore';
import { FIELD_TYPES } from '../../types/formTypes';
import FormField from './FormField';
import './FormPreview.css';

export default function FormPreview() {
    const { form, setPreviewData, clearPreviewData } = useFormStore();
    const { control, handleSubmit, formState: { errors } } = useForm({
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
                        {form.fields.map((field) => (
                            <FormField
                                key = {field.id}
                                field = {field}
                                control = {control}
                                error = {errors[field.id]}
                            />
                        ))}
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
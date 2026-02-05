import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPublicForm, submitFormResponse } from '../../utils/formApi';
import FormField from '../FormPreview/FormField';
import LoadingScreen from '../LoadingScreen';

// Import all template CSS files
import '../../styles/templates/default.css';
import '../../styles/templates/deep-executive.css';
import '../../styles/templates/nordic-minimalist.css';
import '../../styles/templates/cyber-punch.css';
import '../../styles/templates/botanical.css';
import '../../styles/templates/glassmorphism.css';
import '../../styles/templates/retro-paper.css';

import './PublicFormViewer.css';

/**
 * PublicFormViewer Component
 * Displays a published form for public participants to fill and submit responses
 * Route: /form/:publicToken
 */
export default function PublicFormViewer() {
    const { publicToken } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formValues, setFormValues] = useState({});
    const [validationErrors, setValidationErrors] = useState({});

    // Load form on mount
    useEffect(() => {
        const loadForm = async () => {
            try {
                setLoading(true);
                setError(null);
                const { form: formData } = await getPublicForm(publicToken);
                setForm(formData);
                
                // Initialize form values
                const initialValues = {};
                formData.fields?.forEach(field => {
                    initialValues[field.id] = '';
                });
                setFormValues(initialValues);
            } catch (err) {
                console.error('Load form error:', err);
                if (err.message.includes('404')) {
                    setError('Form not found or is no longer available.');
                } else {
                    setError(err.message || 'Failed to load form. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        };

        if (publicToken) {
            loadForm();
        }
    }, [publicToken]);

    const handleFieldChange = (fieldId, value) => {
        setFormValues(prev => ({
            ...prev,
            [fieldId]: value,
        }));
        // Clear validation error for this field
        if (validationErrors[fieldId]) {
            setValidationErrors(prev => ({
                ...prev,
                [fieldId]: null,
            }));
        }
    };

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        form.fields?.forEach(field => {
            const value = formValues[field.id];

            // Check required fields
            if (field.required) {
                if (!value || (typeof value === 'string' && value.trim() === '')) {
                    errors[field.id] = `${field.label} is required`;
                    isValid = false;
                }
            }

            // Validate email fields
            if (field.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errors[field.id] = 'Please enter a valid email address';
                    isValid = false;
                }
            }

            // Validate phone fields
            if (field.type === 'phone' && value) {
                const phoneRegex = /^[0-9+\-\s()]+$/;
                if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
                    errors[field.id] = 'Please enter a valid phone number';
                    isValid = false;
                }
            }

            // Validate number fields
            if (field.type === 'number' && value) {
                if (isNaN(value)) {
                    errors[field.id] = 'Please enter a valid number';
                    isValid = false;
                }
            }
        });

        setValidationErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);

        try {
            // Build responses array
            const responses = form.fields?.map(field => ({
                fieldId: field.id,
                fieldLabel: field.label,
                fieldType: field.type,
                value: formValues[field.id],
            })) || [];

            await submitFormResponse(publicToken, responses);
            
            setSubmitted(true);
            
            // Auto-redirect after 3 seconds
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (err) {
            console.error('Submit error:', err);
            setError(err.message || 'Failed to submit form. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // Loading state
    if (loading) {
        return <LoadingScreen />;
    }

    // Error state
    if (error && !form) {
        return (
            <div className="public-form-error">
                <div className="error-container">
                    <h1>❌ Form Not Found</h1>
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    // Success state
    if (submitted) {
        return (
            <div className={`public-form-page form-template-${form?.template || 'default'}`}>
                <div className="public-form-success">
                    <div className="success-container">
                        <div className="success-icon">✓</div>
                        <h1>Thank You!</h1>
                        <p>Your response has been submitted successfully.</p>
                        <p className="redirect-message">Redirecting you home in 3 seconds...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Form state
    return (
        <div className={`public-form-page form-template-${form?.template || 'default'}`}>
            <div className="public-form-container">
                {/* Header */}
                <div className="public-form-header">
                    <h1>{form?.title}</h1>
                    {form?.description && (
                        <p className="form-description">{form.description}</p>
                    )}
                </div>

                {/* Error message */}
                {error && (
                    <div className="form-error-message">
                        <span>{error}</span>
                        <button onClick={() => setError(null)} className="close-message">✕</button>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="public-form">
                    {form?.fields && form.fields.length > 0 ? (
                        <div className="form-fields">
                            {form.fields.map(field => (
                                <div key={field.id} className="field-wrapper">
                                    <FormField
                                        field={field}
                                        value={formValues[field.id]}
                                        onChange={(value) => handleFieldChange(field.id, value)}
                                        error={validationErrors[field.id]}
                                        isPublic={true}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-fields">No fields in this form</p>
                    )}

                    {/* Submit Button */}
                    <div className="form-footer">
                        <button
                            type="submit"
                            className="btn btn-primary submit-btn"
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>

                {/* Footer */}
                <div className="public-form-footer">
                    <p>Powered by <span className="brand">Project Structura</span></p>
                </div>
            </div>
        </div>
    );
}

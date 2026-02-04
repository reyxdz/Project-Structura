// Main container component

import React, { useState, useEffect } from 'react';
import { useFormStore } from '../../stores/formStore';
import { useTemplate } from '../../context/TemplateContext';
import Canvas from './Canvas';
import FieldPalette from './FieldPalette';
import FieldConfigurator from './FieldConfigurator';
import FormPreview from '../FormPreview/FormPreview';
import TemplateSelector from '../../components/Common/TemplateSelector';
import psLogo from '../../images/logo_v3.png';
import './FormBuilder.css';

export default function FormBuilder({ onBackToDashboard }) {
    const form = useFormStore((state) => state.form);
    const selectedFieldId = useFormStore((state) => state.selectedFieldId);
    const loadForm = useFormStore((state) => state.loadForm);
    const { setSelectedTemplate } = useTemplate();
    const [showPreview, setShowPreview] = useState(false);
    const [showFieldsPalette, setShowFieldsPalette] = useState(false);
    const [showConfigurator, setShowConfigurator] = useState(false);

    // Load form from localStorage when entering builder
    useEffect(() => {
        const currentFormId = localStorage.getItem('currentFormId');
        const savedFormState = localStorage.getItem(`formState_${currentFormId}`);
        
        // Load the template for this form
        const formTemplate = localStorage.getItem(`formTemplate_${currentFormId}`);
        if (formTemplate) {
            setSelectedTemplate(formTemplate);
        }
        
        if (savedFormState) {
            try {
                const formState = JSON.parse(savedFormState);
                loadForm(formState);
            } catch (e) {
                console.error('Failed to load saved form state:', e);
            }
        }
    }, [loadForm, setSelectedTemplate]);

    // Save form state to localStorage whenever it changes
    useEffect(() => {
        const currentFormId = localStorage.getItem('currentFormId');
        if (currentFormId && form) {
            localStorage.setItem(`formState_${currentFormId}`, JSON.stringify(form));
        }
    }, [form]);

    // Save form state before navigating back
    function handleGoBack() {
        const currentFormId = localStorage.getItem('currentFormId');
        if (currentFormId && form) {
            localStorage.setItem(`formState_${currentFormId}`, JSON.stringify(form));
        }
        if (onBackToDashboard) {
            onBackToDashboard();
        }
    }

    return (
        <div className="form-builder">
            <header className="form-builder-header">
                <div className="header-left">
                    <button 
                        className="btn-back"
                        onClick={handleGoBack}
                        title="Back to Dashboard"
                    >
                        ← Back
                    </button>
                    <img src={psLogo} alt="Logo" className="header-logo" />
                </div>
                <div className="header-actions">
                    <button 
                        className="btn btn-primary" 
                        onClick={() => setShowPreview(!showPreview)}
                    >
                        {showPreview ? 'Edit' : 'Preview'}
                    </button>
                </div>
            </header>

            <div className="form-builder-body">
                {!showPreview && (
                    <>
                        <aside className="form-builder-sidebar left-sidebar">
                            <FieldPalette />
                        </aside>

                        {/* Floating button for fields palette on mobile */}
                        <button 
                            className="floating-sidebar-btn left-floating-btn"
                            onClick={() => setShowFieldsPalette(!showFieldsPalette)}
                            title="Toggle Fields"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>

                        {/* Overlay sidebar for fields on mobile */}
                        {showFieldsPalette && (
                            <div className="sidebar-overlay" onClick={() => setShowFieldsPalette(false)} />
                        )}
                        <aside className={`form-builder-sidebar left-sidebar mobile-overlay ${showFieldsPalette ? 'show' : ''}`}>
                            <div className="mobile-sidebar-header">
                                <h3>Fields</h3>
                                <button 
                                    className="mobile-sidebar-close"
                                    onClick={() => setShowFieldsPalette(false)}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                            <FieldPalette />
                        </aside>
                    </>
                )}

                <main className="form-builder-main">
                    {showPreview ? (
                        <FormPreview isEditMode={false} />
                    ) : (
                        <Canvas />
                    )}
                </main>

                {showPreview && (
                    <aside className="form-builder-sidebar right-sidebar">
                        <TemplateSelector />
                    </aside>
                )}

                {!showPreview && (
                    <>
                        <aside className="form-builder-sidebar right-sidebar">
                            {selectedFieldId ? (
                                <FieldConfigurator />
                            ) : (
                                <div className="no-field-selected">
                                    <p>Select a field to configure it</p>
                                </div>
                            )}
                        </aside>

                        {/* Floating button for configurator on mobile */}
                        <button 
                            className="floating-sidebar-btn right-floating-btn"
                            onClick={() => setShowConfigurator(!showConfigurator)}
                            title="Toggle Configuration"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>

                        {/* Overlay sidebar for configurator on mobile */}
                        {showConfigurator && (
                            <div className="sidebar-overlay" onClick={() => setShowConfigurator(false)} />
                        )}
                        <aside className={`form-builder-sidebar right-sidebar mobile-overlay ${showConfigurator ? 'show' : ''}`}>
                            <div className="mobile-sidebar-header">
                                <h3>Configure</h3>
                                <button 
                                    className="mobile-sidebar-close"
                                    onClick={() => setShowConfigurator(false)}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                            {selectedFieldId ? (
                                <FieldConfigurator />
                            ) : (
                                <div className="no-field-selected">
                                    <p>Select a field to configure it</p>
                                </div>
                            )}
                        </aside>
                    </>
                )}
            </div>
        </div>
    );
}
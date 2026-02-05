// Main container component

// Import all template CSS files
import '../../styles/templates/default.css';
import '../../styles/templates/deep-executive.css';
import '../../styles/templates/nordic-minimalist.css';
import '../../styles/templates/cyber-punch.css';
import '../../styles/templates/botanical.css';
import '../../styles/templates/glassmorphism.css';
import '../../styles/templates/retro-paper.css';

import React, { useState, useEffect } from 'react';
import { useFormStore } from '../../stores/formStore';
import { useTemplate } from '../../context/useTemplate';
import Canvas from './Canvas';
import FieldPalette from './FieldPalette';
import FieldConfigurator from './FieldConfigurator';
import FormPreview from '../FormPreview/FormPreview';
import psLogo from '../../images/logo_v3.png';
import './FormBuilder.css';

export default function FormBuilder({ onBackToDashboard }) {
    const form = useFormStore((state) => state.form);
    const selectedFieldId = useFormStore((state) => state.selectedFieldId);
    const loadForm = useFormStore((state) => state.loadForm);
    const setFormTemplate = useFormStore((state) => state.setFormTemplate);
    const { setSelectedTemplate } = useTemplate();
    const [showPreview, setShowPreview] = useState(false);
    const [showFieldsPalette, setShowFieldsPalette] = useState(false);
    const [showConfigurator, setShowConfigurator] = useState(false);

    // Load form from API when entering builder
    useEffect(() => {
        const currentFormId = localStorage.getItem('currentFormId');
        if (!currentFormId) return;

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        const token = localStorage.getItem('token');

        fetch(`${API_URL}/api/forms/${currentFormId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.form) {
                    console.log('FormBuilder loaded form from API:', { formId: data.form._id, template: data.form.template });
                    loadForm(data.form);
                    // Set the template in both store and context
                    if (data.form.template) {
                        setFormTemplate(data.form.template);
                        setSelectedTemplate(data.form.template);
                        console.log('FormBuilder set template to:', data.form.template);
                    }
                }
            })
            .catch(err => console.error('Failed to load form:', err));
    }, [loadForm, setFormTemplate, setSelectedTemplate]);

    // Save form state to API whenever it changes
    useEffect(() => {
        const currentFormId = localStorage.getItem('currentFormId');
        if (!currentFormId || !form) return;

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        const token = localStorage.getItem('token');

        // Debounce the save to avoid too many API calls
        const saveTimer = setTimeout(() => {
            fetch(`${API_URL}/api/forms/${currentFormId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: form.name,
                    description: form.description,
                    fields: form.fields,
                    template: form.template,
                }),
            })
                .catch(err => console.error('Failed to save form:', err));
        }, 1000);

        return () => clearTimeout(saveTimer);
    }, [form]);

    // Navigate back to dashboard
    function handleGoBack() {
        if (onBackToDashboard) {
            onBackToDashboard();
        }
    }

    return (
        <div className={`form-builder form-template-${form.template || 'default'}`}>
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
                    <select 
                        className="template-selector"
                        value={form.template || 'default'}
                        onChange={(e) => {
                            const newTemplate = e.target.value;
                            setFormTemplate(newTemplate);
                            setSelectedTemplate(newTemplate);
                        }}
                        title="Select form template"
                    >
                        <option value="default">Default</option>
                        <option value="deep-executive">Deep Executive</option>
                        <option value="nordic-minimalist">Nordic Minimalist</option>
                        <option value="cyber-punch">Cyber Punch</option>
                        <option value="botanical">Botanical</option>
                        <option value="glassmorphism">Glassmorphism</option>
                        <option value="retro-paper">Retro Paper</option>
                    </select>
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
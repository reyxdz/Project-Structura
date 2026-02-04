import React, { useState } from 'react';
import './TemplateShowcase.css';

const TEMPLATES_WITH_PREVIEWS = [
    {
        id: 'default',
        name: 'Default',
        description: 'Standard form appearance',
        color: '#6366F1',
        accentColor: '#4F46E5',
        preview: {
            bgColor: '#ffffff',
            inputBg: '#f1f5f9',
            inputBorder: '#e2e8f0',
            textColor: '#1e293b',
            buttonBg: '#6366F1'
        }
    },
    {
        id: 'deep-executive',
        name: 'Deep Executive',
        description: 'Dark, premium & sophisticated',
        color: '#0F172A',
        accentColor: '#6366F1',
        preview: {
            bgColor: '#0F172A',
            inputBg: '#1E293B',
            inputBorder: '#475569',
            textColor: '#F8FAFC',
            buttonBg: '#6366F1'
        }
    },
    {
        id: 'nordic-minimalist',
        name: 'Nordic Minimalist',
        description: 'Clean & minimal design',
        color: '#FFFFFF',
        accentColor: '#065F46',
        preview: {
            bgColor: '#FFFFFF',
            inputBg: '#F3F4F6',
            inputBorder: '#D1D5DB',
            textColor: '#111827',
            buttonBg: '#065F46'
        }
    },
    {
        id: 'cyber-punch',
        name: 'Cyber-Punch',
        description: 'High-energy neon theme',
        color: '#000000',
        accentColor: '#BEF264',
        preview: {
            bgColor: '#000000',
            inputBg: 'rgba(0,0,0,0.5)',
            inputBorder: '#BEF264',
            textColor: '#BEF264',
            buttonBg: '#F472B6'
        }
    },
    {
        id: 'botanical',
        name: 'Earthy Botanical',
        description: 'Organic, calming vibes',
        color: '#FDFBF7',
        accentColor: '#9D4B39',
        preview: {
            bgColor: '#FDFBF7',
            inputBg: '#F5F3F0',
            inputBorder: '#E8DFD6',
            textColor: '#363E33',
            buttonBg: '#9D4B39'
        }
    },
    {
        id: 'glassmorphism',
        name: 'Glassmorphism',
        description: 'Frosted glass effect',
        color: '#E8EAED',
        accentColor: '#4A90E2',
        preview: {
            bgColor: '#1a1a2e',
            inputBg: 'rgba(255,255,255,0.1)',
            inputBorder: 'rgba(255,255,255,0.2)',
            textColor: '#FFFFFF',
            buttonBg: '#FFFFFF',
            buttonText: '#1a1a2e'
        }
    },
    {
        id: 'retro-paper',
        name: 'Retro Paper',
        description: 'Nostalgic vintage style',
        color: '#F4F1EA',
        accentColor: '#2563EB',
        preview: {
            bgColor: '#F4F1EA',
            inputBg: '#FAF9F6',
            inputBorder: '#D4C9BD',
            textColor: '#2D2D2D',
            buttonBg: '#2563EB'
        }
    }
];

export default function TemplateShowcase({ onSelectTemplate, isCreating, onCreateForm }) {
    const [hoveredTemplate, setHoveredTemplate] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState('default');
    const [newFormName, setNewFormName] = useState('');
    const [newFormDesc, setNewFormDesc] = useState('');
    const [error, setError] = useState('');

    const handleTemplateSelect = (templateId) => {
        setSelectedTemplate(templateId);
        setShowCreateForm(true);
    };

    const handleCreateForm = () => {
        if (!newFormName.trim()) {
            setError('Form name is required');
            return;
        }

        // Pass to parent component to handle creation
        onCreateForm({
            name: newFormName,
            description: newFormDesc,
            template: selectedTemplate
        });

        // Reset form
        setNewFormName('');
        setNewFormDesc('');
        setShowCreateForm(false);
        setError('');
    };

    return (
        <div className="template-showcase">
            {/* Template Grid */}
            <div className="template-showcase-container">
                <div className="showcase-header">
                    <h3>Choose a Theme</h3>
                    <p>Pick a template to get started with your new form</p>
                </div>

                <div className="templates-grid-showcase">
                    {TEMPLATES_WITH_PREVIEWS.map((template) => (
                        <div
                            key={template.id}
                            className="template-showcase-card"
                            onMouseEnter={() => setHoveredTemplate(template.id)}
                            onMouseLeave={() => setHoveredTemplate(null)}
                        >
                            {/* Preview Container */}
                            <div className="template-preview-container">
                                <div 
                                    className="template-preview-bg"
                                    style={{ backgroundColor: template.preview.bgColor }}
                                >
                                    {/* Sample form preview inside */}
                                    <div className="preview-form">
                                        {/* Sample field 1 */}
                                        <div className="preview-field">
                                            <div 
                                                className="preview-label"
                                                style={{ color: template.preview.textColor }}
                                            >
                                                Full Name
                                            </div>
                                            <input
                                                type="text"
                                                className="preview-input"
                                                placeholder="John Doe"
                                                style={{
                                                    backgroundColor: template.preview.inputBg,
                                                    borderColor: template.preview.inputBorder,
                                                    color: template.preview.textColor
                                                }}
                                                disabled
                                            />
                                        </div>

                                        {/* Sample field 2 */}
                                        <div className="preview-field">
                                            <div 
                                                className="preview-label"
                                                style={{ color: template.preview.textColor }}
                                            >
                                                Email
                                            </div>
                                            <input
                                                type="text"
                                                className="preview-input"
                                                placeholder="john@example.com"
                                                style={{
                                                    backgroundColor: template.preview.inputBg,
                                                    borderColor: template.preview.inputBorder,
                                                    color: template.preview.textColor
                                                }}
                                                disabled
                                            />
                                        </div>

                                        {/* Sample button */}
                                        <button
                                            className="preview-button"
                                            style={{
                                                backgroundColor: template.preview.buttonBg,
                                                color: template.preview.buttonText || '#ffffff'
                                            }}
                                            disabled
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Card Info */}
                            <div className="template-card-content">
                                <h4>{template.name}</h4>
                                <p>{template.description}</p>
                                <button
                                    className={`btn-use-template ${hoveredTemplate === template.id ? 'visible' : ''}`}
                                    onClick={() => handleTemplateSelect(template.id)}
                                >
                                    Use Template
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create Form Modal */}
            {showCreateForm && (
                <>
                    <div className="modal-overlay" onClick={() => setShowCreateForm(false)} />
                    <div className="create-form-modal-showcase">
                        <div className="modal-header">
                            <h3>Create New Form with {TEMPLATES_WITH_PREVIEWS.find(t => t.id === selectedTemplate)?.name} Theme</h3>
                            <button
                                className="modal-close"
                                onClick={() => setShowCreateForm(false)}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>

                        {error && (
                            <div className="modal-error">
                                <span>{error}</span>
                                <button onClick={() => setError('')}>×</button>
                            </div>
                        )}

                        <div className="modal-body">
                            <div className="form-group">
                                <label>Form Name *</label>
                                <input
                                    type="text"
                                    placeholder="Enter form name"
                                    value={newFormName}
                                    onChange={(e) => setNewFormName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    placeholder="Enter form description (optional)"
                                    value={newFormDesc}
                                    onChange={(e) => setNewFormDesc(e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn-cancel-modal"
                                onClick={() => {
                                    setShowCreateForm(false);
                                    setNewFormName('');
                                    setNewFormDesc('');
                                    setError('');
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-create-modal"
                                onClick={handleCreateForm}
                                disabled={isCreating}
                            >
                                {isCreating ? 'Creating...' : 'Create Form'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

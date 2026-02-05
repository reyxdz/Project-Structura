import React from 'react';
import { useTemplate } from '../../context/useTemplate';
import './TemplateSelector.css';

const TEMPLATES = [
    {
        id: 'default',
        name: 'Default',
        description: 'Standard form appearance',
        color: '#6366F1'
    },
    {
        id: 'deep-executive',
        name: 'Deep Executive',
        description: 'Dark, premium look',
        color: '#0F172A'
    },
    {
        id: 'nordic-minimalist',
        name: 'Nordic Minimalist',
        description: 'Clean & minimal design',
        color: '#FFFFFF'
    },
    {
        id: 'cyber-punch',
        name: 'Cyber-Punch',
        description: 'High-energy neon theme',
        color: '#000000'
    },
    {
        id: 'botanical',
        name: 'Earthy Botanical',
        description: 'Organic, calming vibes',
        color: '#FDFBF7'
    },
    {
        id: 'glassmorphism',
        name: 'Glassmorphism',
        description: 'Frosted glass effect',
        color: '#E8EAED'
    },
    {
        id: 'retro-paper',
        name: 'Retro Paper',
        description: 'Nostalgic vintage style',
        color: '#F4F1EA'
    }
];

export default function TemplateSelector() {
    const { selectedTemplate, setSelectedTemplate } = useTemplate();

    return (
        <div className="template-selector-container">
            <div className="template-selector-header">
                <h3>Form Templates</h3>
                <p className="template-selector-info">Select a template to apply a theme to your form</p>
            </div>

            <div className="template-grid">
                {TEMPLATES.map((template) => (
                    <button
                        key={template.id}
                        className={`template-card ${selectedTemplate === template.id ? 'active' : ''}`}
                        onClick={() => setSelectedTemplate(template.id)}
                        title={template.description}
                    >
                        <div 
                            className="template-preview" 
                            style={{ backgroundColor: template.color }}
                        />
                        <div className="template-info">
                            <h4>{template.name}</h4>
                            <p>{template.description}</p>
                        </div>
                        {selectedTemplate === template.id && (
                            <div className="template-checkmark">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

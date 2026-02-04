import React from 'react';
import { useTemplate } from '../context/TemplateContext';
import './TemplateSelector.css';

export default function TemplateSelector() {
    const { selectedTemplate, setSelectedTemplate } = useTemplate();

    const templates = [
        {
            id: 'default',
            name: 'Project Structura',
            description: 'Original theme'
        },
        {
            id: 'deep-executive',
            name: 'Deep Executive',
            description: 'Dark, premium, sophisticated'
        },
        {
            id: 'nordic',
            name: 'Nordic Minimalist',
            description: 'Clean, professional, minimal'
        },
        {
            id: 'cyber-punch',
            name: 'Cyber-Punch',
            description: 'High-energy, edgy, neon'
        },
        {
            id: 'botanical',
            name: 'Earthy Botanical',
            description: 'Organic, calming, trustworthy'
        },
        {
            id: 'glassmorphism',
            name: 'Glassmorphism',
            description: 'Frosted, futuristic, elegant'
        },
        {
            id: 'retro-paper',
            name: 'Retro Paper',
            description: 'Nostalgic, tactile, intellectual'
        }
    ];

    return (
        <div className="template-selector">
            <div className="template-selector-header">
                <h3>Form Templates</h3>
                <p>Choose a template for your form</p>
            </div>
            <div className="template-grid">
                {templates.map(template => (
                    <button
                        key={template.id}
                        className={`template-card ${selectedTemplate === template.id ? 'active' : ''}`}
                        onClick={() => setSelectedTemplate(template.id)}
                        title={template.description}
                    >
                        <div className="template-preview" data-template={template.id}></div>
                        <div className="template-info">
                            <h4>{template.name}</h4>
                            <p>{template.description}</p>
                        </div>
                        {selectedTemplate === template.id && (
                            <div className="template-check">✓</div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

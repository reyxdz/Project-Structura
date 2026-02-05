// Reusable confirmation modal component

import React, { useState, useEffect } from 'react';
import { useTemplate } from '../../context/useTemplate';
import { useFormStore } from '../../stores/formStore';
import './ConfirmModal.css';

export default function ConfirmModal({ 
    isOpen, 
    title, 
    message, 
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm, 
    onCancel,
    isDangerous = false
}) {
    const form = useFormStore((state) => state.form);
    const { selectedTemplate } = useTemplate();
    const [forceUpdate, setForceUpdate] = useState(0);
    
    // Force re-render when modal opens to get fresh context value
    useEffect(() => {
        if (isOpen) {
            setForceUpdate(v => v + 1);
        }
    }, [isOpen]);
    
    // Use UI theme selector (selectedTemplate) as primary source
    // Fall back to form template, then default
    const template = selectedTemplate || form?.template || 'default';
    
    // Map themes to their modal header colors
    const themeColors = {
        'default': '#f9f9f9',
        'deep-executive': '#1E293B',
        'nordic-minimalist': '#F3F4F6',
        'cyber-punch': '#1a1a1a',
        'botanical': '#F5F3F0',
        'glassmorphism': 'rgba(30, 41, 59, 0.9)',
        'retro-paper': '#F5DEB3'
    };
    
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div 
                className={`modal-container form-template-${template}`}
                style={{ backgroundColor: themeColors[template] }}
            >
                <div 
                    className="modal-header"
                    style={{ backgroundColor: themeColors[template] }}
                >
                    <h2>{title}</h2>
                </div>
                
                <div 
                    className="modal-body"
                    style={{ backgroundColor: themeColors[template] }}
                >
                    <p>{message}</p>
                </div>

                <div 
                    className="modal-footer"
                    style={{ backgroundColor: themeColors[template] }}
                >
                    <button 
                        className = "btn btn-secondary"
                        onClick = {onCancel}
                    >
                        {cancelText}
                    </button>
                    <button 
                        className = {isDangerous ? 'btn btn-danger' : 'btn btn-primary'}
                        onClick = {onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

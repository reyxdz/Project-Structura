// Reusable confirmation modal component

import React from 'react';
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
    if (!isOpen) return null;

    return (
        <div className = "modal-overlay">
            <div className = "modal-container">
                <div className = "modal-header">
                    <h2>{title}</h2>
                </div>
                
                <div className = "modal-body">
                    <p>{message}</p>
                </div>

                <div className = "modal-footer">
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

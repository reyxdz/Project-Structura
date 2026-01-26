// Main container component

import React, { useState } from 'react';
import { useFormStore } from '../../stores/formStore';
import Canvas from './Canvas';
import FieldPalette from './FieldPalette';
import FieldConfigurator from './FieldConfigurator';
import FormPreview from '../FormPreview/FormPreview';
import psLogo from '../../images/ps_logo.png';
import './FormBuilder.css';

export default function FormBuilder() {
    const selectedFieldId = useFormStore((state) => state.selectedFieldId);
    const [showPreview, setShowPreview] = useState(false);

    return (
        <div className="form-builder">
            <header className="form-builder-header">
                <div className="header-left">
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
                    <aside className="form-builder-sidebar left-sidebar">
                        <FieldPalette />
                    </aside>
                )}

                <main className="form-builder-main">
                    {showPreview ? (
                        <FormPreview />
                    ) : (
                        <Canvas />
                    )}
                </main>

                {!showPreview && (
                    <aside className = "form-builder-sidebar right-sidebar">
                        {selectedFieldId ? (
                            <FieldConfigurator />
                        ) : (
                            <div className = "no-field-selected">
                                <p>Select a field to configure it</p>
                            </div>
                        )}
                    </aside>
                )}
            </div>
        </div>
    );
}
import React, { useState, useEffect } from 'react';
import { TemplateContext } from './TemplateContextProvider';

export function TemplateProvider({ children }) {
    const [selectedTemplate, setSelectedTemplate] = useState(() => {
        const saved = localStorage.getItem('selectedTemplate');
        return saved || 'default';
    });

    useEffect(() => {
        localStorage.setItem('selectedTemplate', selectedTemplate);
    }, [selectedTemplate]);

    return (
        <TemplateContext.Provider value={{ selectedTemplate, setSelectedTemplate }}>
            {children}
        </TemplateContext.Provider>
    );
}

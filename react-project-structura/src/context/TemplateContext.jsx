import React, { createContext, useContext, useState, useEffect } from 'react';

const TemplateContext = createContext();

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

export function useTemplate() {
    const context = useContext(TemplateContext);
    if (!context) {
        throw new Error('useTemplate must be used within TemplateProvider');
    }
    return context;
}

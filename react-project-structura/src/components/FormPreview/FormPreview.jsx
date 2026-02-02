// Render the form for preview/testing
// Phase 3.6.1: Added conditional visibility to field rendering:

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useFormStore } from '../../stores/formStore';
import { FIELD_TYPES } from '../../types/formTypes';
import { shouldFieldBeVisible } from '../../utils/conditionalRules';
import FormField from './FormField';
import './FormPreview.css';

// Memoize FormField to prevent unnecessary remounts
const MemoizedFormField = React.memo(FormField);

function FormPreview({ isEditMode = false }) {
    const form = useFormStore((state) => state.form);
    const previewData = useFormStore((state) => state.previewData);
    const setPreviewData = useFormStore((state) => state.setPreviewData);
    // Log preview/store updates to help trace what triggers re-renders/remounts
    React.useEffect(() => {
        try {
            console.log('FormPreview store update', { previewData, fieldsCount: form.fields?.length });
        } catch (e) {
            // ignore
        }
    }, [previewData, form.fields]);
    const { handleSubmit, control, watch } = useForm({
        mode: 'onBlur', // Changed from 'onChange' to 'onBlur' to reduce re-renders
    });
    const [selectedDevice, setSelectedDevice] = React.useState('desktop');
    const [currentDeviceSize, setCurrentDeviceSize] = React.useState('desktop');

    // Detect current device size
    React.useEffect(() => {
        const detectDeviceSize = () => {
            const width = window.innerWidth;
            if (width <= 768) {
                setCurrentDeviceSize('mobile');
            } else if (width <= 1024) {
                setCurrentDeviceSize('tablet');
            } else {
                setCurrentDeviceSize('desktop');
            }
        };

        detectDeviceSize();
        window.addEventListener('resize', detectDeviceSize);
        return () => window.removeEventListener('resize', detectDeviceSize);
    }, []);

    // Device capability mapping - what devices can be previewed from current device
    const getAvailableDevices = () => {
        const deviceHierarchy = { mobile: 0, tablet: 1, desktop: 2 };
        const currentLevel = deviceHierarchy[currentDeviceSize];
        const availableDevices = { mobile: true, tablet: false, desktop: false };

        // Can always preview mobile
        availableDevices.mobile = true;
        // Can preview tablet if on tablet or desktop
        if (currentLevel >= 1) availableDevices.tablet = true;
        // Can preview desktop only if on desktop
        if (currentLevel >= 2) availableDevices.desktop = true;

        return availableDevices;
    };

    const availableDevices = getAvailableDevices();

    // Set initial selected device to current device if not available
    React.useEffect(() => {
        if (selectedDevice !== currentDeviceSize && !availableDevices[selectedDevice]) {
            setSelectedDevice(currentDeviceSize);
        }
    }, [currentDeviceSize, selectedDevice, availableDevices]);

    const onSubmit = (data) => {
        try {
            console.log('FormPreview onSubmit - setPreviewData', data);
        } catch (e) {}
        setPreviewData(data);
        alert('Form submitted!');
    };

    // Use useMemo to prevent renderFormContent from recreating on every render
    const renderedFields = React.useMemo(() => {
        return form.fields.map((field) => {
            // Check if field should be visible based on conditionals
            const isVisible = shouldFieldBeVisible(field, previewData, form.fields);

            if (!isVisible) {
                return null; // Don't render hidden fields
            }

            return (
                <MemoizedFormField
                    key={field.id}
                    field={field}
                    error={null}
                    isEditMode={isEditMode}
                />
            );
        });
    }, [form.fields, previewData, isEditMode]);

    const renderFormContent = () => (
        <>
            {form.fields.length === 0 ? (
                <div className="form-empty-state">
                    <p>No fields in this form yet</p>
                </div>
            ) : (
                <div className="form-fields">
                    {renderedFields}
                </div>
            )}
        </>
    );

    return (
        <div className="form-preview">
            <div className="form-preview-header">
                <div className="device-selector">
                    <button 
                        className={`device-btn ${selectedDevice === 'mobile' ? 'active' : ''} ${!availableDevices.mobile ? 'disabled' : ''}`}
                        onClick={() => availableDevices.mobile && setSelectedDevice('mobile')}
                        disabled={!availableDevices.mobile}
                        title="Mobile Preview"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                            <line x1="12" y1="18" x2="12.01" y2="18"></line>
                        </svg>
                        <span>Phone</span>
                    </button>
                    <button 
                        className={`device-btn ${selectedDevice === 'tablet' ? 'active' : ''} ${!availableDevices.tablet ? 'disabled' : ''}`}
                        onClick={() => availableDevices.tablet && setSelectedDevice('tablet')}
                        disabled={!availableDevices.tablet}
                        title="Tablet Preview"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                        <span>Tablet</span>
                    </button>
                    <button 
                        className={`device-btn ${selectedDevice === 'desktop' ? 'active' : ''} ${!availableDevices.desktop ? 'disabled' : ''}`}
                        onClick={() => availableDevices.desktop && setSelectedDevice('desktop')}
                        disabled={!availableDevices.desktop}
                        title="Desktop Preview"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                            <line x1="2" y1="20" x2="22" y2="20"></line>
                        </svg>
                        <span>Desktop</span>
                    </button>
                </div>
            </div>

            <div className={`form-preview-container ${selectedDevice}-view`}>
                <form onSubmit={handleSubmit(onSubmit)} className="form-preview-body">
                    {renderFormContent()}
                </form>
            </div>
        </div>
    );
}

export default React.memo(FormPreview);
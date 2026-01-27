import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FIELD_TYPES } from '../../types/formTypes';
import './FieldItem.css';

export default function SortableFieldItem({
    field,
    isSelected,
    onSelect,
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isSortableDragging,
    } = useSortable({ id: field.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isSortableDragging ? 0.5 : 1,
    };

    const handleClick = () => {
        // Only select if not dragging
        if (!isSortableDragging) {
            onSelect();
        }
    };

    return (
        <div
            ref = {setNodeRef}
            style = {style}
            className = {`field-item ${isSelected ? 'selected' : ''} ${
                isSortableDragging ? 'dragging' : ''
            }`}
            onClick = {handleClick}
            {...attributes}
            {...(isSelected && listeners)}
        >
            {field.type === FIELD_TYPES.HEADING ? (
                <div className="heading-field-builder">
                    <div className={`heading-builder-content heading-${field.metadata?.headingSize || 'default'} heading-${field.metadata?.textAlignment || 'left'}`}>
                        <h2 className="heading-builder-title">{field.label || 'Heading'}</h2>
                        <p className="heading-builder-subtitle">{field.placeholder || 'Type a subheader'}</p>
                    </div>
                </div>
            ) : field.type === FIELD_TYPES.FULL_NAME ? (
                <div className="full-name-field-builder">
                    <div className="field-item-header">
                        <span className="field-label">{field.label || 'Name'}</span>
                    </div>
                    <div className="full-name-inputs-preview">
                        <div className="full-name-preview-group">
                            <input type="text" disabled />
                            <label>{field.metadata?.firstNameLabel || 'First Name'}</label>
                        </div>
                        <div className="full-name-preview-group">
                            <input type="text" disabled />
                            <label>{field.metadata?.lastNameLabel || 'Last Name'}</label>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className = "field-item-header">
                        <span className = "field-label">{field.label}</span>
                    </div>
                    {field.required && <span className = "field-required">*Required</span>}
                </>
            )}
        </div>
    );
}
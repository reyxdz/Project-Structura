// Field item shown during drag overlay

import React from 'react';
import './FieldItem.css';

export default function DraggableFieldItem({ field, isDragging }) {
    return (
        <div className = { `field-item ${isDragging ? 'dragging overlay' : ''}`}>
            <div className = "field-item-drag-handle">
                <span className = "drag-icon">⋮⋮</span>
            </div>
            <div className = "field-item-header">
                <span className = "field-label">{field.label}</span>
                <span className = "field-type">{field.type}</span>
            </div>
            {field.required && <span className = "field-required">*Required</span>}
        </div>
    );
}
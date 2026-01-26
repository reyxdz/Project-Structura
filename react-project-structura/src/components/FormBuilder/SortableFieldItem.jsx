import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
        >
            <div className = "field-item-drag-handle" {...listeners}>
                <span className = "drag-icon">⋮</span>
            </div>
            <div className = "field-item-header">
                <span className = "field-label">{field.label}</span>
                <span className = "field-type">{field.type}</span>
            </div>
            {field.required && <span className = "field-required">*Required</span>}
        </div>
    );
}
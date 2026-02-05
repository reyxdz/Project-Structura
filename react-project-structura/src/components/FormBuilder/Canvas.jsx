// Full drag-and-drop implementation

import React, { useState, useRef } from 'react';
import { DndContext,closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useFormStore } from '../../stores/formStore';
import DraggableFieldItem from './DraggableFieldItem';
import SortableFieldItem from './SortableFieldItem';
import DropZone from './DropZone';
import './Canvas.css';

export default function Canvas() {
    const form = useFormStore((state) => state.form);
    const selectedFieldId = useFormStore((state) => state.selectedFieldId);
    const selectField = useFormStore((state) => state.selectField);
    const reorderField = useFormStore((state) => state.reorderField);
    const addField = useFormStore((state) => state.addField);
    const [activeId, setActiveId] = useState(null);
    const [newFieldDragData, setNewFieldDragData] = useState(null);
    const fieldsListRef = useRef(null);
    const canvasRef = useRef(null);

    // Configure sensors for drag detection
    const sensors = useSensors(
        useSensor(PointerSensor, {
            distance: 8,
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (over && active.id !== over.id) {
            const oldIndex = form.fields.findIndex((f) => f.id === active.id);
            const newIndex = form.fields.findIndex((f) => f.id === over.id);

            if (oldIndex !== -1 && over.id) {
                reorderField(oldIndex, newIndex);
            }
        }
    };

    const handleCanvasDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        
        // Always try to calculate position when dragging over
        if (!fieldsListRef.current || form.fields.length === 0) {
            if (form.fields.length === 0) {
                setNewFieldDragData({ fieldType: 'pending', insertPosition: 0 });
            }
            return;
        }
        
        const fieldElements = Array.from(fieldsListRef.current.querySelectorAll('.field-item'));
        
        if (fieldElements.length === 0) {
            setNewFieldDragData({ fieldType: 'pending', insertPosition: form.fields.length });
            return;
        }
        
        const rect = fieldsListRef.current.getBoundingClientRect();
        const relativeY = e.clientY - rect.top;
        
        let closestIndex = form.fields.length;
        let minDistance = Infinity;
        
        fieldElements.forEach((element, idx) => {
            const fieldRect = element.getBoundingClientRect();
            const fieldTop = fieldRect.top - rect.top;
            const fieldBottom = fieldRect.bottom - rect.top;
            const fieldCenter = (fieldTop + fieldBottom) / 2;
            
            const distance = Math.abs(relativeY - fieldCenter);
            
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = relativeY < fieldCenter ? idx : idx + 1;
            }
        });
        
        closestIndex = Math.min(closestIndex, form.fields.length);
        closestIndex = Math.max(closestIndex, 0);
        
        setNewFieldDragData({ fieldType: 'pending', insertPosition: closestIndex });
    };

    const handleCanvasDrop = (e) => {
        e.preventDefault();
        const fieldType = e.dataTransfer.getData('fieldType');
        
        if (fieldType && newFieldDragData) {
            // Use calculated position from drag tracking
            addField(fieldType, newFieldDragData.insertPosition);
        } else if (fieldType) {
            // Fallback: append at end if no drag data
            addField(fieldType, form.fields.length);
        }
        setNewFieldDragData(null);
    };
    
    const handleCanvasDragLeave = (e) => {
        // Only clear if leaving the canvas entirely
        if (e.target === e.currentTarget) {
            setNewFieldDragData(null);
        }
    };

    const handleCanvasClick = (e) => {
        // Only deselect if clicking on the canvas background, not on a field
        if (e.target === e.currentTarget) {
            selectField(null);
        }
    };
    
    return (
        <DndContext
            sensors = {sensors}
            collisionDetection = {closestCenter}
            onDragStart = {handleDragStart}
            onDragEnd = {handleDragEnd}
        >
            <div className = {`canvas form-template-${form.template || 'default'}`} onDragOver = {handleCanvasDragOver} onDrop = {handleCanvasDrop} onDragLeave = {handleCanvasDragLeave} onClick = {handleCanvasClick} ref = {canvasRef}>
                <div className = "canvas-content">
                    {form.fields.length === 0 ? (
                        <div className = "canvas-empty-state">
                            <p>Drag fields here to build your form</p>
                        </div>
                    ) : (
                        <SortableContext
                            items = {form.fields.map((f) => f.id)}
                            strategy = {verticalListSortingStrategy}
                        >
                            <div className = "fields-list" ref = {fieldsListRef}>
                                {form.fields.map((field, index) => {
                                    const displayFields = [];
                                    
                                    // Show placeholder before this field if drag position matches
                                    if (newFieldDragData && newFieldDragData.insertPosition === index) {
                                        displayFields.push(
                                            <div key={`placeholder-${index}`} className="field-item-placeholder">
                                                <div className="placeholder-content">Drop field here</div>
                                            </div>
                                        );
                                    }
                                    
                                    displayFields.push(
                                        <SortableFieldItem 
                                            key={field.id}
                                            field = {field}
                                            isSelected = {selectedFieldId === field.id}
                                            onSelect = {() => selectField(field.id)}
                                            isDragging = {activeId === field.id}
                                        />
                                    );
                                    
                                    return displayFields;
                                }).flat()}
                                
                                {/* Show placeholder at the end if drag position matches */}
                                {newFieldDragData && newFieldDragData.insertPosition === form.fields.length && (
                                    <div key="placeholder-end" className="field-item-placeholder">
                                        <div className="placeholder-content">Drop field here</div>
                                    </div>
                                )}
                            </div>
                        </SortableContext>
                    )}
                </div>
            </div>
            
            <DragOverlay>
                {activeId && (
                    <DraggableFieldItem
                        field = {form.fields.find((f) => f.id === activeId)}
                        isDragging = {true} 
                    />
                )}
            </DragOverlay>
        </DndContext>
    );
}
// Available fields to drag onto canvas 

import React from 'react';
import { FIELD_TYPES } from '../../types/formTypes';
import { getFieldTypeLabel } from '../../utils/fieldHelpers';
import { useFormStore } from '../../stores/formStore';
import './FieldPalette.css';

const fieldGroups = [
    {
        name: 'Basic Fields',
        fields: [FIELD_TYPES.TEXT, FIELD_TYPES.EMAIL, FIELD_TYPES.NUMBER],
    },
    {
        name: 'Choice Fields',
        fields: [FIELD_TYPES.CHECKBOX, FIELD_TYPES.RADIO, FIELD_TYPES.SELECT],
    },
    {
        name: 'Advanced Fields',
        fields: [FIELD_TYPES.TEXTAREA, FIELD_TYPES.DATE, FIELD_TYPES.FILE, FIELD_TYPES.PHONE, FIELD_TYPES.URL],
    },
];

export default function FieldPalette() {
    const addField = useFormStore((state) => state.addField);

    const handleAddField = (fieldType) => {
        addField(fieldType);
    }

    const handleDragStart = (e, fieldType) => {
        e.dataTransfer.effectAllowed = 'copy';
        e.dataTransfer.setData('fieldType', fieldType);
    };

    return (
        <div className = "field-palette">
            <h3>Add Fields</h3>
            {fieldGroups.map((group) => (
                <div key = {group.name} className = "field-group">
                    <h4>{group.name}</h4>
                    <div className = "field-buttons">
                        {group.fields.map((fieldType) => (
                            <button
                                key = {fieldType}
                                className = "field-button"
                                onClick = {() => handleAddField(fieldType)}
                                draggable
                                onDragStart = {(e) => handleDragStart(e, fieldType)}
                                title = {`Add ${getFieldTypeLabel(fieldType)}`}
                            >
                                + {getFieldTypeLabel(fieldType)}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
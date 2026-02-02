// Available fields to drag onto canvas 

import React from 'react';
import { FIELD_TYPES } from '../../types/formTypes';
import { getFieldTypeLabel } from '../../utils/fieldHelpers';
import { useFormStore } from '../../stores/formStore';
import './FieldPalette.css';

// Import icons for available fields
import headingIcon from '../../icons/heading.png';
import fullNameIcon from '../../icons/full_name.png';
import emailIcon from '../../icons/email (2).png';
import addressIcon from '../../icons/address.png';
import phoneIcon from '../../icons/phone.png';
import datePickerIcon from '../../icons/date_picker.png';
import appointmentIcon from '../../icons/appointment.png';
import signatureIcon from '../../icons/signature.png';
import shortTextIcon from '../../icons/short_text.png';
import longTextIcon from '../../icons/long_text.png';
import dropdownIcon from '../../icons/dropdown.png';
import singleChoiceIcon from '../../icons/single_choice.png';
import multipleChoiceIcon from '../../icons/multiple_choice.png';
import numberIcon from '../../icons/number.png';
import imageIcon from '../../icons/image.png';
import fileUploadIcon from '../../icons/file_upload.png';
import submitIcon from '../../icons/submit.png';
import dividerIcon from '../../icons/divider.png';

const fieldSections = [
    {
        name: null,
        fields: [
            FIELD_TYPES.HEADING,
            FIELD_TYPES.FULL_NAME,
            FIELD_TYPES.EMAIL,
            FIELD_TYPES.ADDRESS,
            FIELD_TYPES.PHONE,
            FIELD_TYPES.DATE,
            FIELD_TYPES.APPOINTMENT,
            FIELD_TYPES.SIGNATURE,
        ],
    },
    {
        name: 'BASIC ELEMENTS',
        fields: [
            FIELD_TYPES.SHORT_TEXT,
            FIELD_TYPES.LONG_TEXT,
            FIELD_TYPES.DROPDOWN,
            FIELD_TYPES.SINGLE_CHOICE,
            FIELD_TYPES.MULTIPLE_CHOICE,
            FIELD_TYPES.NUMBER,
            FIELD_TYPES.IMAGE,
            FIELD_TYPES.FILE,
            FIELD_TYPES.SUBMIT,
            FIELD_TYPES.DIVIDER,
        ],
    },
    {
        name: 'SPECIAL FIELDS',
        fields: [
            FIELD_TYPES.MULTI_FIELDS,
            FIELD_TYPES.TABLE,
        ]
    }
];

const fieldIcons = {
    [FIELD_TYPES.HEADING]: headingIcon,
    [FIELD_TYPES.FULL_NAME]: fullNameIcon,
    [FIELD_TYPES.EMAIL]: emailIcon,
    [FIELD_TYPES.ADDRESS]: addressIcon,
    [FIELD_TYPES.PHONE]: phoneIcon,
    [FIELD_TYPES.DATE]: datePickerIcon,
    [FIELD_TYPES.APPOINTMENT]: appointmentIcon,
    [FIELD_TYPES.SIGNATURE]: signatureIcon,
    [FIELD_TYPES.SHORT_TEXT]: shortTextIcon,
    [FIELD_TYPES.LONG_TEXT]: longTextIcon,
    [FIELD_TYPES.DROPDOWN]: dropdownIcon,
    [FIELD_TYPES.SINGLE_CHOICE]: singleChoiceIcon,
    [FIELD_TYPES.MULTIPLE_CHOICE]: multipleChoiceIcon,
    [FIELD_TYPES.NUMBER]: numberIcon,
    [FIELD_TYPES.IMAGE]: imageIcon,
    [FIELD_TYPES.FILE]: fileUploadIcon,
    [FIELD_TYPES.SUBMIT]: submitIcon,
    [FIELD_TYPES.DIVIDER]: dividerIcon,
};

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
        <div className="field-palette">
            <h3>Add Fields</h3>
            {fieldSections.map((section, index) => (
                <div key={index}>
                    {section.name && (
                        <div className="field-divider">
                            <span>{section.name}</span>
                        </div>
                    )}
                    <div className="field-group">
                        <div className="field-buttons">
                            {section.fields.map((fieldType) => (
                                <button
                                    key={fieldType}
                                    className={`field-button`}
                                    onClick={() => handleAddField(fieldType)}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, fieldType)}
                                    title={`Add ${getFieldTypeLabel(fieldType)}`}
                                >
                                    {fieldIcons[fieldType] && (
                                        <img src={fieldIcons[fieldType]} alt="" className="field-icon" />
                                    )}
                                    {getFieldTypeLabel(fieldType)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
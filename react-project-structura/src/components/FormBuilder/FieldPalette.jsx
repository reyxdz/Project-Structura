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
import captchaIcon from '../../icons/captcha.png';
import submitIcon from '../../icons/submit.png';
import inputTableIcon from '../../icons/input_table.png';
import starRatingIcon from '../../icons/star_rating.png';
import scaleRatingIcon from '../../icons/scale_rating.png';
import dividerIcon from '../../icons/divider.png';
import sectionCollapseIcon from '../../icons/section_collapse.png';
import pageBreakIcon from '../../icons/page_break.png';

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
            FIELD_TYPES.CAPTCHA,
            FIELD_TYPES.SUBMIT,
        ],
    },
    {
        name: 'SURVEY ELEMENTS',
        fields: [
            FIELD_TYPES.INPUT_TABLE,
            FIELD_TYPES.STAR_RATING,
            FIELD_TYPES.SCALE_RATING,
        ],
    },
    {
        name: 'PAGE ELEMENTS',
        fields: [
            FIELD_TYPES.DIVIDER,
            FIELD_TYPES.SECTION_COLLAPSE,
            FIELD_TYPES.PAGE_BREAK,
        ],
    },
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
    [FIELD_TYPES.CAPTCHA]: captchaIcon,
    [FIELD_TYPES.SUBMIT]: submitIcon,
    [FIELD_TYPES.INPUT_TABLE]: inputTableIcon,
    [FIELD_TYPES.STAR_RATING]: starRatingIcon,
    [FIELD_TYPES.SCALE_RATING]: scaleRatingIcon,
    [FIELD_TYPES.DIVIDER]: dividerIcon,
    [FIELD_TYPES.SECTION_COLLAPSE]: sectionCollapseIcon,
    [FIELD_TYPES.PAGE_BREAK]: pageBreakIcon,
};

export default function FieldPalette() {
    const addField = useFormStore((state) => state.addField);

    // Fields that are disabled (not yet implemented)
    const disabledFields = [
        FIELD_TYPES.INPUT_TABLE,
        FIELD_TYPES.STAR_RATING,
        FIELD_TYPES.SCALE_RATING,
        FIELD_TYPES.DIVIDER,
        FIELD_TYPES.SECTION_COLLAPSE,
        FIELD_TYPES.PAGE_BREAK,
    ];

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
                                    className={`field-button ${disabledFields.includes(fieldType) ? 'disabled' : ''}`}
                                    onClick={() => !disabledFields.includes(fieldType) && handleAddField(fieldType)}
                                    draggable={!disabledFields.includes(fieldType)}
                                    onDragStart={(e) => !disabledFields.includes(fieldType) && handleDragStart(e, fieldType)}
                                    title={`Add ${getFieldTypeLabel(fieldType)}`}
                                    disabled={disabledFields.includes(fieldType)}
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
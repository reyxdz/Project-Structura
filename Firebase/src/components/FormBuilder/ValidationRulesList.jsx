// Component to manage validation rules
import { VALIDATION_TYPES } from '../../types/formTypes';
import './ValidationRulesList.css';

const availableValidations = [
    { type: VALIDATION_TYPES.REQUIRED, label: 'Required' },
    { type: VALIDATION_TYPES.MIN_LENGTH, label: 'Minimum Length' },
    { type: VALIDATION_TYPES.MAX_LENGTH, label: 'Maximum Length' },
    { type: VALIDATION_TYPES.PATTERN, label: 'Pattern (Regex)' },
    { type: VALIDATION_TYPES.EMAIL, label: 'Email Format' },
    { type: VALIDATION_TYPES.PHONE, label: 'Phone Format' },
    { type: VALIDATION_TYPES.URL, label: 'URL Format'},
    { type: VALIDATION_TYPES.CUSTOM, label: 'Custom Rule'},
];

export default function ValidationRulesList ({
    field,
    onAddValidation,
    onUpdateValidation,
    onRemoveValidation,
}) {
    const getValidationLabel = (type) => {
        return availableValidations.find((v) => v.type === type)?.label || type;
    };

    const getValidationPlaceholder = (type) => {
        switch (type) {
            case VALIDATION_TYPES.MIN_LENGTH:
                return 'e.g., 3';
            case VALIDATION_TYPES.MAX_LENGTH:
                return 'e.g., 50';
            case VALIDATION_TYPES.PATTERN:
                return 'e.g., ^[0-9]+$';
            default:
                return 'Value';
        }
    };

    return (
        <div className = "validation-rules-panel">
            <div className = "validation-rules-header">
                <h4>Validation Rules</h4>
            </div>

            <div className = "add-validation">
                <label>
                    <span>Add Rule:</span>
                    <select
                        onChange = {(e) => {
                            if (e.target.value) {
                                onAddValidation(e.target.value);
                                e.target.value = '';
                            }
                        }}
                        defaultValue = ""
                    >
                        <option value = "">Select a rule...</option>
                        {availableValidations.map((v) => (
                            <option key = {v.type} value = {v.type}>
                                {v.label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {field.validation.length > 0 && (
                <div className = "validation-list">
                    {field.validation.map((rule, index) => (
                        <div key = {index} className = "validation-rule">
                            <div className = "rule-header">
                                <span className = "rule-label">
                                    {getValidationLabel(rule.type)}
                                </span>
                                <button
                                    className = "btn-remove-rule"
                                    onClick = {() => onRemoveValidation(index)}
                                    title = "Remove rule"
                                >
                                    ×
                                </button>
                            </div>

                            {rule.type !== VALIDATION_TYPES.REQUIRED &&
                             rule.type !== VALIDATION_TYPES.EMAIL &&
                             rule.type !== VALIDATION_TYPES.PHONE &&
                             rule.type !== VALIDATION_TYPES.URL && (
                                <input 
                                    type = "text"
                                    placeholder = {getValidationPlaceholder(rule.type)}
                                    value = {rule.value}
                                    onChange = {(e) =>
                                        onUpdateValidation(index, { value: e.target.value })
                                    }
                                    className = "rule-input"
                                />
                             )}

                            <input
                                type = "text"
                                placeholder = "Custom error message..." 
                                value = {rule.message}
                                onChange = {(e) =>
                                    onUpdateValidation(index, { message: e.target.value })
                                }
                                className = "rule-message"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
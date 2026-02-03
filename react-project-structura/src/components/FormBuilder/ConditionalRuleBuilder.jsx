// UI component for building conditional rules

import React from 'react';
import { useFormStore } from '../../stores/formStore';
import { CONDITIONAL_OPERATORS, CONDITIONAL_ACTIONS, CONDITIONAL_LOGIC_TYPES } from '../../types/formTypes';
import { createConditionalRule, createConditionalLogicGroup, getOperatorLabel, getActionLabel, detectCircularDependencies } from '../../utils/conditionalRules';
import './ConditionalRuleBuilder.css';

export default function ConditionalRuleBuilder({ fieldId }) {
    const form = useFormStore((state) => state.form);
    const selectedField = form.fields.find((f) => f.id === fieldId);
    const {
        addConditional,
        updateConditional,
        removeConditionalRule,
        removeAllConditionals,
        setConditionalLogicType,
    } = useFormStore();

    if (!selectedField) return null;

    const conditionals = selectedField.conditionals || [];
    const otherFields = form.fields.filter((f) => f.id !== fieldId);

    const handleAddConditional = () => {
        const newRule = createConditionalRule('', CONDITIONAL_OPERATORS.EQUALS, '', CONDITIONAL_ACTIONS.SHOW);
        const newLogicGroup = createConditionalLogicGroup([newRule], CONDITIONAL_LOGIC_TYPES.AND);
        addConditional(fieldId, newLogicGroup);
    };

    const handleAddRule = (conditionalIndex) => {
        const conditional = conditionals[conditionalIndex];
        const newRule = createConditionalRule('', CONDITIONAL_OPERATORS.EQUALS, '', CONDITIONAL_ACTIONS.SHOW);
        const newRules = [...conditional.rules, newRule];

        updateConditional(fieldId, conditionalIndex, { ...conditional, rules: newRules });
    }

    const handleRuleChange = (conditionalIndex, ruleIndex, field, value) => {
        const conditional = conditionals[conditionalIndex];
        const rule = { ...conditional.rules[ruleIndex], [field]: value };

        // Validate circular dependency if trigger field changed
        if (field === 'triggerFieldId') {
            const testField = {
                ...selectedField,
                conditionals: [
                    ...conditionals.slice(0, conditionalIndex),
                    {
                        ...conditional,
                        rules: [
                            ...conditional.rules.slice(0,ruleIndex),
                            rule,
                            ...conditional.rules.slice(ruleIndex + 1),
                        ],
                    },
                    ...conditionals.slice(conditionalIndex + 1),
                ],
            };

            const circularDeps = detectCircularDependencies(testField, form.fields);
            if (circularDeps.length > 0) {
                alert(
                    'This would create a circular dependeny. The field you selected depends on this field.'
                );
                return;
            }
        }

        updateConditional(fieldId, conditionalIndex, rule, ruleIndex);
    };

    const handleRemoveRule = (conditionalIndex, ruleIndex) => {
        removeConditionalRule(fieldId, conditionalIndex, ruleIndex);
    };

    const handleRemoveAllConditionals = () => {
        if(confirm('Remove all conditional rules from this field?')) {
            removeAllConditionals(fieldId);
        }
    };

    const handleLogicTypeChange = (conditionalIndex, logicType) => {
        setConditionalLogicType(fieldId, conditionalIndex, logicType);
    };

    return (
        <div className = "conditional-rule-builder">
            <div className = "conditional-header">
                <h4>Conditional Visibility Rules</h4>
                {conditionals.length > 0 && (
                    <button
                     className = "btn-icon btn-danger-text"
                     onClick = {handleRemoveAllConditionals}
                     title = "Remove all conditionals"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        Clear All
                    </button>
                )}
            </div>

            {conditionals.length === 0 ? (
                <div className = "no-conditionals">
                    <p>No conditional rules. This field is always visible.</p>
                    <button className = "btn btn-secondary" onClick = {handleAddConditional}>
                        + Add Conditional Rule
                    </button>
                </div>
            ) : (
                <div className = "conditionals-list">
                    {conditionals.map((conditional, conditionalIndex) => (
                        <div key = {`conditional-${conditionalIndex}`} className = "conditional-group">
                            <div className = "conditional-group-header">
                                <span className = "group-label">If</span>
                                <select
                                  className = "logic-type-select"
                                  value = {conditional.logicType}
                                  onChange = {(e) => handleLogicTypeChange(conditionalIndex, e.target.value)}
                                >
                                    <option value = {CONDITIONAL_LOGIC_TYPES.AND}>ALL conditions are true</option>
                                    <option value = {CONDITIONAL_LOGIC_TYPES.OR}>ANY condition is true</option>
                                </select>
                            </div>

                            {conditional.rules.map((rule, ruleIndex) => (
                                <ConditionalRuleRow
                                    key = {`rule-${ruleIndex}`}
                                    rule = {rule}
                                    ruleIndex = {ruleIndex}
                                    conditionalIndex = {conditionalIndex}
                                    otherFields = {otherFields}
                                    onRuleChange = {handleRuleChange}
                                    onRemoveRule = {handleRemoveRule}
                                    isFirstRule = {ruleIndex === 0}
                                    logicType = {conditional.logicType}
                                />
                            ))}

                            <button
                                className = "btn-text btn-secondary"
                                onClick = {() => handleAddRule(conditionalIndex)}
                            >
                                + Add Another Condition
                            </button>
                        </div>
                    ))}

                    <button
                        className = "btn btn-secondary" onClick = {handleAddConditional}>
                            + Add Rule Group
                        </button>
                </div>
            )}
        </div>
    );
}

function ConditionalRuleRow({
    rule,
    ruleIndex,
    conditionalIndex,
    otherFields,
    onRuleChange,
    onRemoveRule,
    isFirstRule,
    logicType,
}) {

    return (
        <div className = "conditional-rule">
            {!isFirstRule && <div className = "rule-connector">{logicType}</div>}

            <div className = "rule-content">
                <select
                    className = "rule-field-select"
                    value = {rule.triggerFieldId}
                    onChange = {(e) =>
                        onRuleChange(conditionalIndex, ruleIndex, 'triggerFieldId', e.target.value)
                    }
                >
                    <option value ="">Select field...</option>
                    {otherFields.map((field) => (
                        <option key = {field.id} value = {field.id}>
                            {field.label}
                        </option>
                    ))}
                </select>

                {rule.triggerFieldId && (
                    <>
                        <select
                            className = "rule-operator-select"
                            value = {rule.operator}
                            onChange = {(e) =>
                                onRuleChange(conditionalIndex, ruleIndex, 'operator', e.target.value)
                            }
                        >
                            {Object.entries(CONDITIONAL_OPERATORS).map(([value]) => (
                                <option key = {value} value = {value}>
                                    {getOperatorLabel(value)}
                                </option>
                            ))}
                        </select>

                        {![
                            CONDITIONAL_OPERATORS.IS_EMPTY,
                            CONDITIONAL_OPERATORS.IS_NOT_EMPTY,
                        ].includes(rule.operator) && (
                            <input
                                type = "text"
                                className = "rule-value-input"
                                value = {rule.value}
                                onChange = {(e) =>
                                    onRuleChange(conditionalIndex, ruleIndex,'value', e.target.value)
                                }
                                placeholder = "Enter value..."
                            />
                        )}
                    </>
                )}

                <select
                    className = "rule-action-select"
                    value = {rule.action}
                    onChange = {(e) => onRuleChange (conditionalIndex, ruleIndex, 'action', e.target.value)}
                >
                    {Object.entries(CONDITIONAL_ACTIONS).map(([value]) => (
                        <option key = {value} value = {value}>
                            {getActionLabel(value)}
                        </option>
                    ))}
                </select>

                <button
                    className = "btn-icon btn-danger-text"
                    onClick = {() => onRemoveRule(conditionalIndex, ruleIndex)}
                    title = "Remove this condition"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        </div>
    );
}
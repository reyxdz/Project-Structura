// Visualize field dependencies

import React from 'react';
import { useFormStore } from '../../stores/formStore';
import { getTriggerFields, detectCircularDependencies } from '../../utils/conditionalRules';
import './DependencyGraph.css';

export default function DependencyGraph() {
    const form = useFormStore((state) => state.form);

    // Build dependency map
    const dependencyMap = {};
    form.fields.forEach((field) => {
        const triggers = getTriggerFields(field, form.fields);
        if (triggers.length > 0) {
            dependencyMap[field.id] = triggers;
        }
    });

    // Check for circular dependencies
    const circularDependences = [];
    form.fields.forEach((field) => {
        const circles = detectCircularDependencies(field, form.fields);
        if (circles.length > 0) {
            circularDependences.push({ field: field.label, circles });
        }
    });

    if (Object.keys(dependencyMap).length === 0) {
        return (
            <div className = "dependency-graph">
                <p>No conditional dependencies</p>
            </div>
        );
    }

    return (
        <div className = "dependency-graph">
            <h4>Field Dependencies</h4>

            {circularDependences.length > 0 && (
                <div className = "warning">
                    <strong>⚠️ Circular Dependencies Detected:</strong>
                    {circularDependences.map((item, idx) => (
                        <div key = {idx}>
                            {item.field}: {item.circles.map((c) => c.join(' → ')).join(', ')}
                        </div>
                    ))}
                </div>
            )}

            <ul className = "dependency-list">
                {Object.entries(dependencyMap).map(([fieldId, triggers]) => {
                    const field = form.fields.find((f) => f.id === fieldId);
                    return (
                        <li key = {fieldId}>
                            <strong>{field.label}</strong> depends on:
                            <ul>
                                {triggers.map((triggerId) => {
                                    const triggerField = form.fields.find((f) => f.id === triggerId);
                                    return <li key = {triggerId}>{triggerField.label}</li>;
                                })}
                            </ul>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
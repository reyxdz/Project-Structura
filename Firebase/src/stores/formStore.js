/* Central state management for the form builder. */

// Phase 3.3.3:1 -> Added conditional field actions to the store

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { createNewField, reorderFields, updateFieldInArray, removeFieldFromArray } from '../utils/fieldHelpers';
// Phase 3.3.3:1
import { detectCircularDependencies } from '../utils/conditionalRules';

const initialFormState = {
    id: uuidv4(),
    name: 'Untitled Form',
    description: '',
    fields: [],
    metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    versions: [],
};



export const useFormStore = create((set, get) => ({
    // State
    form: initialFormState,
    selectedFieldId: null,
    history: [initialFormState],
    historyIndex: 0,
    previewData: {},

    // Form actions
    setFormName: (name) =>
        set((state) => ({
            form: {
                ...state.form,
                name,
                metadata: {
                    ...state.form.metadata,
                    updatedAt: new Date().toISOString(),
                },
            },
        })),
    
    setFormDescription: (description) =>
        set((state) => ({
            form: {
                ...state.form,
                description,
                metadata: {
                    ...state.form.metadata,
                    updatedAt: new Date().toISOString(),
                },
            },
        })),


    // Field actions
    addField: (type, position) => {
        set((state) => {
            const newField = createNewField(type, position ?? state.form.fields.length);
            const updatedFields = [...state.form.fields];
            updatedFields.splice(position ?? updatedFields.length, 0, newField);

            const updatedForm = {
                ...state.form,
                fields: updatedFields.map((f, i) => ({ ...f, order: i})),
                metadata: {
                    ...state.form.metadata,
                    updatedAt: new Date().toISOString(),
                },
            };

            return {
                form: updatedForm,
                history: [...state.history.slice(0, state.historyIndex + 1), updatedForm],
                historyIndex: state.historyIndex + 1,
            };
        });
    },

    updateField: (fieldId, updates) => {
        set((state) => {
            const updatedFields = updateFieldInArray(state.form.fields, fieldId, updates);
            const updatedForm = {
                ...state.form,
                fields: updatedFields,
                metadata: {
                    ...state.form.metadata,
                    updatedAt: new Date().toISOString(),
                },
            };

            return {
                form: updatedForm,
                history: [...state.history.slice(0, state.historyIndex + 1), updatedForm],
                historyIndex: state.historyIndex + 1,
            };
        });
    },

    removeField: (fieldId) => {
        set((state) => {
            const updatedFields = removeFieldFromArray(state.form.fields, fieldId);
            const updatedForm = {
                ...state.form,
                fields: updatedFields,
                metadata: {
                    ...state.form.metadata,
                    updatedAt: new Date().toISOString(),
                },
            };

            return {
                form: updatedForm,
                selectedFieldId: state.selectedFieldId === fieldId ? null : state.selectedFieldId,
                history: [...state.history.slice(0, state.historyIndex + 1), updatedForm],
                historyIndex: state.historyIndex + 1,
            };
        });
    },

    // Phase 3.3.3:1 -> Add conditional logic to a field
    addConditional: (fieldId, conditionalLogic) => {
        set((state) => {
            const updatedFields = state.form.fields.map((field) => {
                if (field.id === fieldId) {
                    const conditionals = field.conditionals || [];

                    // Check for circular depedencies
                    const circularDeps = detectCircularDependencies({
                        ...field,
                        conditionals: [...conditionals, conditionalLogic],
                    }, state.form.fields);

                    if (circularDeps.length > 0) {
                        console.warn('Circular dependency detected: ', circularDeps);
                        return field; // Don't add if circular
                    }

                    return {
                        ...field,
                        conditionals: [...conditionals, conditionalLogic],
                        metadata: {
                            ...field.metadata,
                            updatedAt: new Date().toISOString(),
                        },
                    };
                }
                return field;
            });

            const updatedForm = {
                ...state.form,
                fields: updatedFields,
                metadata: {
                    ...state.form.metadata,
                    updatedAt: new Date().toISOString(),
                },
            };

            return {
                form: updatedForm,
                history: [...state.history.slice(0, state.historyIndex + 1), updatedForm],
                historyIndex: state.historyIndex + 1,
            };
        });
    },

    updateConditional: (fieldId, conditionalIndex, rule, ruleIndex) => {
        set((state) => {
            const updatedFields = state.form.fields.map((field) => {
                if (field.id === fieldId) {
                    const conditionals = [...field.conditionals];
                    const updatedRules = [...conditionals[conditionalIndex].rules];
                    updatedRules[ruleIndex] = rule;
                    conditionals[conditionalIndex] = {
                        ...conditionals[conditionalIndex],
                        rules: updatedRules,
                    };

                    return {
                        ...field,
                        conditionals,
                        metadata: {
                            ...field.metadata,
                            updatedAt: new Date().toISOString(),
                        },
                    };
                }
                return field;
            });

            const updatedForm = {
                ...state.form,
                fields: updatedFields,
                metadata: {
                    ...state.form.metadata,
                    updatedAt: new Date().toISOString(),
                },
            };

            return {
                form: updatedForm,
                history: [...state.history.slice(0, state.historyIndex + 1), updatedForm],
                historyIndex: state.historyIndex + 1,
            };
        });
    },

    /**
     * Remove a conditional rule
     */
    removeConditionalRule: (fieldId, conditionalIndex, ruleIndex) => {
        set((state) => {
            const updatedFields = state.form.fields.map((field) => {
                if (field.id === fieldId) {
                    const conditionals = [...field.conditionals];
                    const rules = [...conditionals[conditionalIndex].rules];
                    rules.splice(ruleIndex, 1);

                    if (rules.length === 0) {
                        conditionals.splice(conditionalIndex, 1);
                    } else {
                        conditionals[conditionalIndex] = {
                            ...conditionals[conditionalIndex],
                            rules,
                        };
                    }

                    return {
                        ...field,
                        conditionals: conditionals.length > 0 ? conditionals : null,
                        metadata: {
                            ...field.metadata,
                            updatedAt: new Date().toISOString(),
                        },
                    };
                }
                return field;
            });

            const updatedForm = {
                ...state.form,
                fields: updatedFields,
                metadata: {
                    ...state.form.metadata,
                    updatedAt: new Date().toISOString(),
                },
            };

            return {
                form: updatedForm,
                history: [...state.history.slice(0, state.historyIndex + 1), updatedForm],
                historyIndex: state.historyIndex + 1,
            };
        });
    },

    /**
     * Remove all conditionals from a field
     */
    removeAllConditionals: (fieldId) => {
        set((state) => {
            const updatedFields = state.form.fields.map((field) => {
                if (field.id === fieldId) {
                    return {
                        ...field,
                        conditionals: null,
                        metadata: {
                            ...field.metadata,
                            updatedAt: new Date().toISOString(),
                        },
                    };
                }
                return field;
            });

            const updatedForm = {
                ...state.form,
                fields: updatedFields,
                metadata: {
                    ...state.form.metadata,
                    updatedAt: new Date().toISOString(),
                },
            };

            return {
                form: updatedForm,
                history: [...state.history.slice(0, state.historyIndex + 1), updatedForm],
                historyIndex: state.historyIndex + 1,
            };
        });
    },

    /**
     * Change logic type (AND/OR) for a conditional group
     */
    setConditionalLogicType: (fieldId, conditionalIndex, logicType) => {
        set((state) => {
            const updatedFields = state.form.fields.map((field) => {
                if (field.id === fieldId) {
                    const conditionals = [...field.conditionals];
                    conditionals[conditionalIndex] = {
                        ...conditionals[conditionalIndex],
                        logicType,
                    };

                    return {
                        ...field,
                        conditionals,
                        metadata: {
                            ...field.metadata,
                            updatedAt: new Date().toISOString(),
                        },
                    };
                }
                return field;
            });

            const updatedForm = {
                ...state.form,
                fields: updatedFields,
                metadata: {
                    ...state.form.metadata,
                    updatedAt: new Date().toISOString(),
                },
            };

            return {
                form: updatedForm,
                history: [...state.history.slice(0, state.historyIndex + 1), updatedForm],
                historyIndex: state.historyIndex + 1,
            };
        });
    },

    reorderField: (fromIndex, toIndex) => {
        set((state) => {
            const updatedFields = reorderFields(state.form.fields, fromIndex, toIndex);
            const updatedForm = {
                ...state.form,
                fields: updatedFields,
                metadata: {
                    ...state.form.metadata,
                    updatedAt: new Date().toISOString(),
                },
            };

            return {
                form: updatedForm,
                history: [...state.history.slice(0, state.historyIndex + 1), updatedForm],
                historyIndex: state.historyIndex + 1,
            };
        });
    },

    // New: Move field from palette to canvas (same as addField but with position)
    addFieldAtPosition: (type, position) => {
        set((state) => {
            const newField = createNewField(type, position ?? state.form.fields.length);
            const updatedFields = [...state.form.fields];
            updatedFields.splice(position ?? updatedFields.length, 0, newField);

            const updatedForm = {
                ...state.form,
                fields: updatedFields.map((f, i) => ({ ...f, order: i })),
                metadata: {
                    ...state.form.metadata,
                    updatedAt: new Date().toISOString(),
                },
            };

            return {
                form: updatedForm,
                history: [...state.history.slice(0, state.historyIndex + 1), updatedForm],
                historyIndex: state.historyIndex + 1,
            };
        });
    },


    duplicateField: (fieldId) => {
        set((state) => {
            const fieldToDuplicate = state.form.fields.find((f) => f.id === fieldId);
            if (!fieldToDuplicate) return state;

            const cloneField = {
                ...fieldToDuplicate,
                id: uuidv4(),
            };

            const fieldIndex = state.form.fields.findIndex((f) => f.id === fieldId);
            const updatedFields = [...state.form.fields];
            updatedFields.splice(fieldIndex + 1, 0, cloneField);

            const reorderedFields = updatedFields.map((f, i) => ({ ...f, order: i }));
            const updatedForm = {
                ...state.form,
                fields: reorderedFields,
                metadata: {
                    ...state.form.metadata,
                    updatedAt: new Date().toISOString(),
                },
            };

            return {
                form: updatedForm,
                history: [...state.history.slice(0, state.historyIndex + 1), updatedForm],
                historyIndex: state.historyIndex + 1,
            };
        });
    },


    // Selection
    selectField: (fieldId) => set({ selectedFieldId: fieldId}),
    deselectField: () => set({ selectedFieldId: null}),

    // History
    undo: () => {
        set((state) => {
            if (state.historyIndex > 0) {
                return { historyIndex: state.historyIndex -1, form: state.history[state.historyIndex - 1] };
            }
            return state;
        });
    },

    redo: () => {
        set((state) => {
            if (state.historyIndex < state.history.length - 1) {
                return { historyIndex: state.historyIndex + 1, form: state.history[state.historyIndex + 1] };
            }
            return state;
        });
    },

    // Preview
    setPreviewData: (data) => set({ previewData: data }),
    clearPreviewData: () => set({ previewData: {} }),

    // Form reset
    resetForm: () => {
        const newFormState = {
            ...initialFormState,
            id: uuidv4(),
        };
        set({
            form: newFormState,
            selectedFieldId: null,
            history: [newFormState],
            historyIndex: 0,
            previewData: {},
        });
    },

    // Export/Import
    loadForm: (formData) => {
        set({
            form: formData,
            selectedFieldId: null,
            history: [formData],
            historyIndex: 0,
            previewData: {},
        });
    },

    exportForm: () => get().form,
}));
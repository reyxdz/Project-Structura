import { useState, useEffect } from 'react';
import './FormResponses.css';

export default function FormResponses({ formId, formTitle, onBack }) {
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

    useEffect(() => {
        const fetchResponses = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/api/forms/${formId}/responses`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) throw new Error('Failed to fetch responses');
                const data = await response.json();
                setResponses(data.responses || []);
                setError(null);
            } catch (err) {
                setError(err.message || 'Failed to load responses');
                console.error('Fetch responses error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchResponses();
    }, [formId, API_URL]);

    if (loading) {
        return (
            <div className="form-responses">
                <div className="responses-header">
                    <button className="btn-back" onClick={onBack}>← Back to Forms</button>
                    <h2>{formTitle}</h2>
                    <span className="responses-label">FORM RESPONSES</span>
                </div>
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading responses...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="form-responses">
            <div className="responses-header">
                <button className="btn-back" onClick={onBack}>← Back to Forms</button>
                <h2>{formTitle}</h2>
                <span className="responses-label">FORM RESPONSES</span>
            </div>

            {error && (
                <div className="error-banner">
                    <span>{error}</span>
                </div>
            )}

            <div className="responses-stats">
                <div className="stat-card">
                    <div className="stat-label">TOTAL RESPONSES</div>
                    <div className="stat-value">{responses.length}</div>
                </div>
                {responses.length > 0 && (
                    <div className="stat-card">
                        <div className="stat-label">LATEST RESPONSE</div>
                        <div className="stat-value">
                            {new Date(responses[responses.length - 1].submittedAt).toLocaleDateString()}
                        </div>
                    </div>
                )}
            </div>

            {responses.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <h3>No responses yet</h3>
                    <p>Share your form to start collecting responses</p>
                </div>
            ) : (
                <div className="responses-table">
                    <div className="table-header">
                        <div className="col-submitted">SUBMITTED AT</div>
                        <div className="col-submitted-by">SUBMITTED BY</div>
                        <div className="col-responses">RESPONSES</div>
                    </div>

                    {responses.map((response, index) => (
                        <div key={index} className="table-row">
                            <div className="col-submitted">
                                {new Date(response.submittedAt).toLocaleString()}
                            </div>
                            <div className="col-submitted-by">
                                {response.submittedBy || 'anonymous'}
                            </div>
                            <div className="col-responses">
                                <div className="responses-details">
                                    {response.responses
                                        .filter(r => r.fieldType !== 'heading') // Filter out headings only
                                        .map((field, idx) => (
                                            <div key={idx} className="response-field">
                                                <span className="field-label">{field.fieldLabel}:</span>
                                                <span className="field-value">{field.value !== null && field.value !== undefined ? String(field.value) : '(empty)'}</span>
                                            </div>
                                        ))}
                                    {response.responses.filter(r => r.fieldType !== 'heading').length === 0 && (
                                        <div className="no-data">No fields in this form</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

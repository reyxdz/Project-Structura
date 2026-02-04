import { useState, useEffect } from 'react';
import TemplateShowcase from '../components/Dashboard/TemplateShowcase';
import './Dashboard.css';

function Dashboard({ authUser, onOpenBuilder, onLogout, theme, toggleTheme }) {
    const [forms, setForms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

    // Fetch user's forms on mount
    useEffect(() => {
        fetchForms();
    }, []);

    async function fetchForms() {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/forms`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to fetch forms');
            const data = await response.json();
            setForms(data.forms || []);
            setError('');
        } catch (err) {
            setError(err.message || 'Failed to load forms');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDeleteForm(formId) {
        if (!window.confirm('Are you sure you want to delete this form?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/forms/${formId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Failed to delete form');
            setForms(forms.filter(f => f._id !== formId));
        } catch (err) {
            setError(err.message || 'Failed to delete form');
        }
    }

    function handleOpenForm(formId) {
        localStorage.setItem('currentFormId', formId);
        onOpenBuilder();
    }

    function handleLogout() {
        try {
            localStorage.removeItem('auth');
            localStorage.removeItem('token');
            localStorage.removeItem('currentFormId');
        } catch (e) {}
        onLogout();
    }

    return (
        <div className="dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-left">
                    <h1 className="logo">PROJECT STRUCTURA</h1>
                    <span className="subtitle">Form Builder</span>
                </div>
                <div className="header-right">
                    <button 
                        className="btn-theme"
                        onClick={toggleTheme}
                        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                    >
                        {theme === 'dark' ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                                <circle cx="12" cy="12" r="5"></circle>
                                <line x1="12" y1="1" x2="12" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="23"></line>
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                <line x1="1" y1="12" x2="3" y2="12"></line>
                                <line x1="21" y1="12" x2="23" y2="12"></line>
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                            </svg>
                        )}
                    </button>
                    <div className="user-menu">
                        <span className="user-email">{authUser}</span>
                        <button 
                            className="btn-logout"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="dashboard-main">
                {/* Welcome Section */}
                <section className="welcome-section">
                    <div className="welcome-content">
                        <h2>Welcome back!</h2>
                        <p>Create and manage your forms with ease</p>
                    </div>
                </section>

                {/* Error Message */}
                {error && (
                    <div className="error-banner">
                        <span>{error}</span>
                        <button 
                            className="close-error"
                            onClick={() => setError('')}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                )}

                {/* Create New Form Card - Replaced with Template Showcase */}
                <section className="create-form-section">
                    <TemplateShowcase 
                        onSelectTemplate={handleOpenBuilder}
                        isCreating={isCreating}
                    />
                </section>

                {/* Recent Forms */}
                <section className="recent-forms-section">
                    <div className="section-header">
                        <h3>Your Forms</h3>
                        {forms.length > 0 && (
                            <span className="form-count">{forms.length} form{forms.length !== 1 ? 's' : ''}</span>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="loading">
                            <div className="spinner"></div>
                            <p>Loading your forms...</p>
                        </div>
                    ) : forms.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📋</div>
                            <h4>No forms yet</h4>
                            <p>Create your first form to get started</p>
                        </div>
                    ) : (
                        <div className="forms-grid">
                            {forms.map((form) => (
                                <div 
                                    key={form._id}
                                    className="form-card"
                                >
                                    <div className="form-card-header">
                                        <div className="form-header-left">
                                            <h4 className="form-title">{form.title}</h4>
                                            {form.description && (
                                                <p className="form-description">{form.description}</p>
                                            )}
                                        </div>
                                        <div className="form-actions-menu">
                                            <button 
                                                className="btn-action-text edit"
                                                title="Edit form"
                                                onClick={() => handleOpenForm(form._id)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="btn-action-text delete"
                                                title="Delete form"
                                                onClick={() => handleDeleteForm(form._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    <div className="form-meta">
                                        <span className="form-fields">
                                            {(() => {
                                                const savedState = localStorage.getItem(`formState_${form._id}`);
                                                if (savedState) {
                                                    try {
                                                        const state = JSON.parse(savedState);
                                                        const count = state.fields?.length || 0;
                                                        return `${count} field${count !== 1 ? 's' : ''}`;
                                                    } catch (e) {
                                                        return `${form.fields?.length || 0} field${form.fields?.length !== 1 ? 's' : ''}`;
                                                    }
                                                }
                                                return `${form.fields?.length || 0} field${form.fields?.length !== 1 ? 's' : ''}`;
                                            })()}
                                        </span>
                                        <span className="form-date">
                                            {new Date(form.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <button 
                                        className="btn-open"
                                        onClick={() => handleOpenForm(form._id)}
                                    >
                                        Open Form
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default Dashboard;

import { useState, useEffect, useCallback } from 'react';
import TemplateShowcase from '../components/Dashboard/TemplateShowcase';
import FormResponses from './FormResponses';
import logo from '../images/logo_v2.png';
import './Dashboard.css';

function Dashboard({ authUser, userFirstName, onOpenBuilder, onLogout, theme, toggleTheme }) {
    const [forms, setForms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [showResponses, setShowResponses] = useState(false);
    const [selectedFormForResponses, setSelectedFormForResponses] = useState(null);
    const [firstName, setFirstName] = useState(userFirstName);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

    // Fetch user's first name from server
    useEffect(() => {
        async function fetchUserInfo() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/api/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setFirstName(data.firstName);
                }
            } catch (err) {
                console.error('Failed to fetch user info:', err);
            }
        }
        fetchUserInfo();
    }, [API_URL]);

    const fetchForms = useCallback(async () => {
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
    }, [API_URL]);

    // Fetch user's forms on mount
    useEffect(() => {
        fetchForms();
    }, [fetchForms]);

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

    async function handleCreateFormWithTemplate(formData) {
        try {
            setIsCreating(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${API_URL}/api/forms`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: formData.name,
                    description: formData.description,
                    fields: [],
                    template: formData.template,
                }),
            });

            if (!response.ok) throw new Error('Failed to create form');
            const data = await response.json();
            
            // Save currentFormId to localStorage for the builder to read
            localStorage.setItem('currentFormId', data.form._id);
            
            onOpenBuilder();
        } catch (err) {
            setError(err.message || 'Failed to create form');
        } finally {
            setIsCreating(false);
        }
    }

    function handleOpenForm(formId) {
        localStorage.setItem('currentFormId', formId);
        onOpenBuilder();
    }

    function handleOpenResponses(form) {
        setSelectedFormForResponses(form);
        setShowResponses(true);
    }

    function handleBackFromResponses() {
        setShowResponses(false);
        setSelectedFormForResponses(null);
    }

    function handleLogout() {
        try {
            localStorage.removeItem('auth');
            localStorage.removeItem('token');
            localStorage.removeItem('currentFormId');
        } catch {
            // Ignore errors when clearing localStorage
        }
        onLogout();
    }

    return (
        <div className="dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-left">
                    <img src={logo} alt="Project Structura" className="header-logo" />
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
            {showResponses && selectedFormForResponses ? (
                <FormResponses 
                    formId={selectedFormForResponses._id}
                    formTitle={selectedFormForResponses.title}
                    theme={theme}
                    toggleTheme={toggleTheme}
                    onBack={handleBackFromResponses}
                />
            ) : (
            <main className="dashboard-main">
                {/* Welcome Section */}
                <section className="welcome-section">
                    <h2 className="welcome-title">Welcome back, {firstName || 'there'}!</h2>
                    <p className="welcome-subtitle">What would you like to do today?</p>
                </section>

                {/* Statistics Section */}
                <section className="stats-section">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 11H7v6H9v-6zm0-4H7v2H9V7zm6 0h-2v6h2V7zm6 0h-2v10h2V7zM3 21h18M3 3h18"></path>
                                </svg>
                            </div>
                            <div className="stat-content">
                                <h4 className="stat-label">Active Forms</h4>
                                <p className="stat-value">{forms.filter(f => f.status === 'published').length}</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </div>
                            <div className="stat-content">
                                <h4 className="stat-label">Inactive Forms</h4>
                                <p className="stat-value">{forms.filter(f => !f.status || f.status === 'draft').length}</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                            </div>
                            <div className="stat-content">
                                <h4 className="stat-label">Total Forms</h4>
                                <p className="stat-value">{forms.length}</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                            </div>
                            <div className="stat-content">
                                <h4 className="stat-label">Total Responses</h4>
                                <p className="stat-value">{forms.reduce((sum, f) => sum + (f.responseCount || 0), 0)}</p>
                            </div>
                        </div>
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
                        onSelectTemplate={onOpenBuilder}
                        isCreating={isCreating}
                        onCreateForm={handleCreateFormWithTemplate}
                    />
                </section>

                {/* Active Forms Section */}
                <section className="recent-forms-section">
                    <div className="section-header">
                        <h3>Active Forms</h3>
                        {forms.filter(f => f.status === 'published').length > 0 && (
                            <span className="form-count">{forms.filter(f => f.status === 'published').length} form{forms.filter(f => f.status === 'published').length !== 1 ? 's' : ''}</span>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="loading">
                            <div className="spinner"></div>
                            <p>Loading your forms...</p>
                        </div>
                    ) : forms.filter(f => f.status === 'published').length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📋</div>
                            <h4>No active forms</h4>
                            <p>Publish a form to make it active</p>
                        </div>
                    ) : (
                        <div className="forms-grid">
                            {forms.filter(f => f.status === 'published').map((form) => (
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
                                                const count = form.fields?.length || 0;
                                                return `${count} field${count !== 1 ? 's' : ''}`;
                                            })()}
                                        </span>
                                        <span className="form-date">
                                            {new Date(form.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <button 
                                        className="btn-open-form"
                                        onClick={() => handleOpenResponses(form)}
                                    >
                                        Responses
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Inactive Forms Section */}
                <section className="recent-forms-section">
                    <div className="section-header">
                        <h3>Inactive Forms</h3>
                        {forms.filter(f => !f.status || f.status === 'draft').length > 0 && (
                            <span className="form-count">{forms.filter(f => !f.status || f.status === 'draft').length} form{forms.filter(f => !f.status || f.status === 'draft').length !== 1 ? 's' : ''}</span>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="loading">
                            <div className="spinner"></div>
                            <p>Loading your forms...</p>
                        </div>
                    ) : forms.filter(f => !f.status || f.status === 'draft').length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📋</div>
                            <h4>No inactive forms</h4>
                            <p>All your forms are active</p>
                        </div>
                    ) : (
                        <div className="forms-grid">
                            {forms.filter(f => !f.status || f.status === 'draft').map((form) => (
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
                                                const count = form.fields?.length || 0;
                                                return `${count} field${count !== 1 ? 's' : ''}`;
                                            })()}
                                        </span>
                                        <span className="form-date">
                                            {new Date(form.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <button 
                                        className="btn-open-form"
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
            )}
        </div>
    );
}

export default Dashboard;

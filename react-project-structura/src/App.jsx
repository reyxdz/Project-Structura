import { useState, useEffect } from 'react';
import FormBuilder from './components/FormBuilder/FormBuilder';
import LoadingScreen from './components/LoadingScreen';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import PublicFormViewer from './components/FormViewer/PublicFormViewer';
import LoginModal from './components/Common/LoginModal';
import { TemplateProvider } from './context/TemplateContext';
import './App.css';

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [authUser, setAuthUser] = useState(() => {
        try {
            return localStorage.getItem('auth') || null;
        } catch (e) { return null }
    });
    const [currentPage, setCurrentPage] = useState(() => {
        try {
            const auth = localStorage.getItem('auth');
            return auth ? 'dashboard' : 'landing';
        } catch (e) { return 'landing'; }
    });
    const [publicFormToken, setPublicFormToken] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [theme, setTheme] = useState(() => {
        try {
            const stored = localStorage.getItem('theme');
            if (stored === 'light' || stored === 'dark') return stored;
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
        } catch (e) {}
        return 'dark';
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    // Check if we're trying to access a public form from URL
    useEffect(() => {
        try {
            const pathParts = window.location.pathname.split('/');
            if (pathParts[1] === 'form' && pathParts[2]) {
                setPublicFormToken(pathParts[2]);
                setCurrentPage('public-form');
            }
        } catch (e) {
            console.error('Error parsing URL:', e);
        }
    }, []);

    useEffect(() => {
        try {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        } catch (e) {}
    }, [theme]);

    if (isLoading) return <div className="app"> <LoadingScreen /> </div>;

    function handleRequestOpen() {
        console.debug('handleRequestOpen called', { authUser, showLogin });
        setShowLogin(true);
    }

    function handleLogin({ email, token }) {
        try { 
            localStorage.setItem('auth', email);
            localStorage.setItem('token', token);
        } catch (e) {}
        setAuthUser(email);
        setShowLogin(false);
        setCurrentPage('dashboard');
    }

    function handleLogout() {
        setAuthUser(null);
        setCurrentPage('landing');
    }

    function handleOpenBuilder() {
        setCurrentPage('builder');
    }

    function handleBackToDashboard() {
        setCurrentPage('dashboard');
    }

    return (
        <TemplateProvider>
            <div className="app">
                {currentPage === 'landing' && (
                    <Landing
                        onEnter={handleRequestOpen}
                        theme={theme}
                        toggleTheme={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
                    />
                )}
                
                {currentPage === 'dashboard' && authUser && (
                    <Dashboard
                        authUser={authUser}
                        onOpenBuilder={handleOpenBuilder}
                        onLogout={handleLogout}
                        theme={theme}
                        toggleTheme={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
                    />
                )}
                
                {currentPage === 'builder' && (
                    <FormBuilder onBackToDashboard={handleBackToDashboard} />
                )}

                {currentPage === 'public-form' && publicFormToken && (
                    <PublicFormViewer key={publicFormToken} publicToken={publicFormToken} />
                )}

                <LoginModal
                    isOpen={showLogin}
                    onClose={() => setShowLogin(false)}
                    onLogin={handleLogin}
                    authUser={authUser}
                />
            </div>
        </TemplateProvider>
    );
}

export default App;
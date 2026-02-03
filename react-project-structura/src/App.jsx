import { useState, useEffect } from 'react';
import FormBuilder from './components/FormBuilder/FormBuilder';
import LoadingScreen from './components/LoadingScreen';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import LoginModal from './components/Common/LoginModal';
import './App.css';

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'dashboard', 'builder'
    const [showLogin, setShowLogin] = useState(false);
    const [authUser, setAuthUser] = useState(() => {
        try {
            return localStorage.getItem('auth') || null;
        } catch (e) { return null }
    });
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

            <LoginModal
                isOpen={showLogin}
                onClose={() => setShowLogin(false)}
                onLogin={handleLogin}
                authUser={authUser}
            />
        </div>
    );
}

export default App;
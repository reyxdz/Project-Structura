import { useState, useEffect } from 'react';
import FormBuilder from './components/FormBuilder/FormBuilder';
import LandingPage from './pages/LandingPage';
import LoadingScreen from './components/LoadingScreen';
import './App.css';

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState('landing');

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2.5);

        return () => clearTimeout(timer);
    }, []);

    const handleStartBuilding = () => {
        setCurrentPage('builder');
        window.scrollTo(0, 0);
    };

    const handleBackToLanding = () => {
        setCurrentPage('landing');
        window.scrollTo(0, 0);
    };

    return (
        <div className="app">
            {isLoading && <LoadingScreen />}
            {currentPage === 'landing' ? (
                <LandingPage onStartBuilding={handleStartBuilding} />
            ) : (
                <FormBuilder onBackClick={handleBackToLanding} />
            )}
        </div>
    );
}

export default App;
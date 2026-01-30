import { useState, useEffect } from 'react';
import FormBuilder from './components/FormBuilder/FormBuilder';
import LoadingScreen from './components/LoadingScreen';
import './App.css';

function App() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2.5);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="app">
            {isLoading && <LoadingScreen />}
            <FormBuilder />
        </div>
    );
}

export default App;
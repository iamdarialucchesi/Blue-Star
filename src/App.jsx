import React from 'react';
import AppRoutes from './routes/AppRoutes';
import './assets/styles/index.scss'; // Ensure styles are applied
import { AuthProvider} from '../src/context/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes/>
            </AuthProvider>
        </Router>
    );
};

export default App;

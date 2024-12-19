import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import './assets/styles/index.scss';

import './assets/js/custom.js';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
)

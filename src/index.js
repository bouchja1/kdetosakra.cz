// This must be the first line in src/index.js
import 'react-app-polyfill/ie9';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import './assets/fonts/Roboto-Regular.ttf';
import App from './App';

ReactDOM.render(
    <Router>
        <App />
    </Router>,
    document.getElementById('root'),
);

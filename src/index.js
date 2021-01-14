// This must be the first line in src/index.js
import './polyfills';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import './assets/fonts/Roboto-Regular.ttf';
import App from './App';
import ScrollToTop from './components/ScrollToTop';

ReactDOM.render(
    <Router>
        <ScrollToTop />
        <App />
    </Router>,
    document.getElementById('root'),
);

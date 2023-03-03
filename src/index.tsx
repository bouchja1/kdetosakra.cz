import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader

// This must be the first line in src/index.js
import './polyfills';
import './App.less';
import './assets/fonts/Roboto-Regular.ttf';

import { ConfigProvider } from 'antd';
import csCZ from 'antd/lib/locale/cs_CZ';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

import { App } from './App';
import ScrollToTop from './components/ScrollToTop';

const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(
    <Router>
        <ScrollToTop />
        <ConfigProvider locale={csCZ}>
            <App />
        </ConfigProvider>
    </Router>,
);

import React, { useState } from 'react';
import ReactGA from 'react-ga';
import { Link } from 'react-router-dom';
import useScript from './hooks/useScript';
import useMapLoader from './hooks/useMapLoader';
import awesomeLogo from './assets/images/kdetosakra.png'; // Tell Webpack this JS file uses this image
import socialIcons from './assets/images/social-icons.svg';

import RouterSwitch from './components/RouterSwitch';
import { MapyProvider } from './context/MapyContext';
import MenuComponent from './components/pageStructure/Menu';
import { Layout, Icon } from 'antd';
import HeaderContainer from './components/pageStructure/HeaderContainer';
// import Footer from './components/pageStructure/Footer';

const { Header, Content, Footer } = Layout;

function initializeReactGA() {
    ReactGA.initialize('UA-151784741-1');
    ReactGA.pageview(window.location.pathname);
}

function App() {
    // init google analytics
    initializeReactGA();
    const [loaded, error] = useScript('https://api.mapy.cz/loader.js');
    const [mapLoader] = useMapLoader(loaded);
    const [headerContainerVisible, setHeaderContainerVisible] = useState(false);

    const processHeaderContainerVisible = isVisible => {
        setHeaderContainerVisible(isVisible);
    };

    return (
        <>
            <MenuComponent />
            <HeaderContainer headerContainerVisible={headerContainerVisible} />
            <Layout className="layout">
                {loaded && !error && (
                    <MapyProvider value={mapLoader}>
                        <RouterSwitch processHeaderContainerVisible={processHeaderContainerVisible} />
                    </MapyProvider>
                )}
                <Footer style={{ textAlign: 'center' }}>
                    Web běží díky <a href="http://mapy.cz/">Mapy.cz</a> <a href="https://api.mapy.cz/">API</a>{' '}
                    <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" />
                </Footer>
            </Layout>
        </>
    );
}

export default App;

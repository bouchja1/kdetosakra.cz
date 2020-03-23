import React from 'react';
import { Link } from 'react-router-dom';
import { HomeFilled, InfoCircleFilled } from '@ant-design/icons';
import awesomeLogo from '../../../assets/images/kdetosakra.svg';
import smilingLogo from '../../../assets/images/kdetosakraSmile.svg';

const MenuComponent = () => {
    return (
        <div id="menu-container" className="section menu-container">
            <div className="menu">
                <div className="menu-item home">
                    <HomeFilled style={{ color: 'rgb(97, 95, 95)' }} />
                    <div className="home-menu-item">
                        <Link to="/">Herní módy</Link>
                    </div>
                </div>
                <div className="menu-item">
                    <img id="kdetosakra-logo" src={smilingLogo} alt="logo" className="kdetosakra-logo" />
                </div>
                <div className="menu-item info">
                    <InfoCircleFilled style={{ color: 'rgb(97, 95, 95)' }} />
                    <div className="info-menu-item">
                        <Link to="/info">O hře</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuComponent;

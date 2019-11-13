import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import awesomeLogo from '../../../assets/images/kdetosakra.svg';

const MenuComponent = () => {
    return (
        <div id="menu-container" className="section menu-container">
            <div className="menu">
                <div className="menu-item home">
                    <Icon type="home" theme="filled" style={{ color: '#000' }} />
                    <div className="home-menu-item">
                        <Link to="/">Herní módy</Link>
                    </div>
                </div>
                <div className="menu-item">
                    <img src={awesomeLogo} className="kdetosakra-logo" />
                </div>
                <div className="menu-item info">
                    <Icon type="info-circle" theme="filled" style={{ color: '#000' }} />
                    <div className="info-menu-item">
                        <Link to="/info">O hře</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuComponent;

import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';

const MenuComponent = () => {
    return (
        <div className="section menu-container">
            <div className="menu">
                <div className="menu-item">
                    <Icon type="home" />
                    <div className="home-menu-item">
                        <Link to="/">Domů</Link>
                    </div>
                </div>
                <div className="menu-item">
                    <Icon type="info-circle" />
                    <div className="info-menu-item">
                        <Link to="/info">O hře</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuComponent;

import React from 'react';
import { Link } from 'react-router-dom';

const Menu = () => {
    return (
        <div className="menu-container">
            <div className="menu">
                <div className="date">
                    <Link to="/">Domů</Link>
                </div>
                <div className="links">
                    <div className="signup">Sign Up</div>
                    <div className="login">
                        <Link to="/info">O hře</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Menu;

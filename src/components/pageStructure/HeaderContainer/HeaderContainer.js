import React from 'react';
import awesomeLogo from '../../../assets/images/kdetosakra.png';
import socialIcons from '../../../assets/images/social-icons.svg';

const HeaderContainer = () => {
    return (
        <div className="section header-container">
            <div className="header">
                <div className="logo">
                    <img alt="logo" src={awesomeLogo} />
                </div>
            </div>
        </div>
    );
};

export default HeaderContainer;

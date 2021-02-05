import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FacebookFilled, HomeOutlined, InfoCircleOutlined } from '@ant-design/icons';
import smilingLogo from '../../assets/images/kdetosakraSmile.svg';
import { TOTAL_ROUNDS_MAX } from '../../constants/game';
import routeNames from '../../constants/routes';

const isGameInfoShown = pathname => {
    return (
        pathname.includes(routeNames.battle)
        || pathname.includes(routeNames.geolokace)
        || pathname.includes(routeNames.vlastni)
        || pathname.includes(routeNames.nahodne)
        || pathname.includes(routeNames.mesto)
    );
};

const Menu = () => {
    const location = useLocation();
    const currentGameInfo = useSelector(state => state.game.currentGame);

    const { pathname } = location;

    const { mode, round, totalScore } = currentGameInfo;

    return (
        <div id="menu-container" className="section menu-container">
            <div className="main-menu">
                <Link to="/">
                    <HomeOutlined style={{ color: 'rgb(97, 95, 95)', marginRight: '10px' }} />
                    <div className="menu-item">Herní módy</div>
                </Link>
                <div className="menu-item menu-separator">|</div>
                <Link to="/info">
                    <InfoCircleOutlined style={{ color: 'rgb(97, 95, 95)', marginRight: '10px' }} />
                    <div className="menu-item">O hře</div>
                </Link>
                <div className="menu-item menu-separator">|</div>
                <a href="https://www.facebook.com/kdetosakra.cz" target="_blank" rel="noreferrer">
                    <FacebookFilled style={{ color: 'rgb(97, 95, 95)' }} />
                </a>
            </div>
            <img id="kdetosakra-logo" src={smilingLogo} alt="logo" className="kdetosakra-logo" width="85%" />
            {isGameInfoShown(pathname) && (
                <div className="menu-game-info">
                    <div className="menu-game-info-box">
                        <div className="menu-game-info-box-head">kolo</div>
                        <div className="menu-game-info-box-item">
                            {round ?? 0}
                            /
                            {TOTAL_ROUNDS_MAX}
                        </div>
                    </div>
                    <div className="menu-game-info-box">
                        <div className="menu-game-info-box-head">celkové skóre</div>
                        <div className="menu-game-info-box-item">{totalScore ?? 0}</div>
                    </div>
                    <div className="menu-game-info-box">
                        <div className="menu-game-info-box-head">mód</div>
                        <div className="menu-game-info-box-item">{mode}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Menu;

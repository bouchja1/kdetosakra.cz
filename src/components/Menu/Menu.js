import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FacebookFilled, HomeOutlined, InfoCircleOutlined } from '@ant-design/icons';
import smilingLogo from '../../assets/images/kdetosakraSmile.svg';
import routeNames from '../../constants/routes';
import useGetRandomUserToken from '../../hooks/useGetRandomUserToken';
import { findMyUserFromBattle } from '../../util';
import GameInfo from '../GameInfo';
import BattleCountDown from '../BattleCountdown';

const isGameInfoShown = (pathname, battleId) => {
    return (
        battleId
        && (pathname.includes(routeNames.battle)
            || pathname.includes(routeNames.geolokace)
            || pathname.includes(routeNames.vlastni)
            || pathname.includes(routeNames.nahodne)
            || pathname.includes(routeNames.mesto))
    );
};

const Menu = () => {
    const randomUserToken = useGetRandomUserToken();
    const { pathname } = useLocation();
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);
    const currentBattlePlayers = useSelector(state => state.battle.currentBattle.players);
    const [myPlayer, setMyPlayer] = useState();

    const isBattle = pathname.includes(routeNames.battle);

    useEffect(() => {
        setMyPlayer(findMyUserFromBattle(currentBattlePlayers, randomUserToken));
    }, [currentBattlePlayers]);

    return (
        <div id="menu-container" className="section menu-container">
            <div className={isBattle ? 'main-menu--battle' : 'main-menu'}>
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
            {isBattle && myPlayer?.userId && currentBattleInfo && (
                <BattleCountDown currentBattleInfo={currentBattleInfo} />
            )}
            {isGameInfoShown(pathname, currentBattleInfo?.battleId) && (
                <GameInfo
                    round={currentBattleInfo.round}
                    totalScore={currentBattleInfo.myTotalScore}
                    mode={currentBattleInfo.mode}
                    isBattle={isBattle}
                    myPlayer={myPlayer}
                />
            )}
        </div>
    );
};

export default Menu;

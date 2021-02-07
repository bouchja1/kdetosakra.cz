import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FacebookFilled, HomeOutlined, InfoCircleOutlined } from '@ant-design/icons';
import smilingLogo from '../../assets/images/kdetosakraSmile.svg';
import { TOTAL_ROUNDS_MAX } from '../../constants/game';
import gameModes from '../../enums/modes';
import routeNames from '../../constants/routes';
import useGetRandomUserToken from '../../hooks/useGetRandomUserToken';
import { findMyUserFromBattle, mapGameModeName } from '../../util';

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
    const location = useLocation();
    const currentGameInfo = useSelector(state => state.game.currentGame);
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);
    const currentBattlePlayers = useSelector(state => state.battle.currentBattle.players);
    const [myPlayer, setMyPlayer] = useState();

    const { pathname } = location;

    const isBattle = pathname.includes(routeNames.battle);

    useEffect(() => {
        setMyPlayer(findMyUserFromBattle(currentBattlePlayers, randomUserToken));
    }, [currentBattlePlayers]);

    const mapModeName = () => {
        const mode = isBattle ? currentBattleInfo.mode : currentGameInfo.mode;
        return mapGameModeName(mode);
    };

    const showBattleInfo = () => {
        const {
            isGameFinishedSuccessfully, isGameStarted, withCountdown, countdown,
        } = currentBattleInfo;
        return isGameStarted ? 'JO' : 'NE';
    };

    const showRoundInfo = () => {
        const round = isBattle ? currentBattleInfo.round : currentGameInfo.round;
        return `${round ?? 0} / ${TOTAL_ROUNDS_MAX}`;
    };

    const showTotalScoreInfo = () => {
        const totalScore = isBattle ? currentBattleInfo.myTotalScore : currentGameInfo.totalScore;
        return totalScore ?? 0;
    };

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
            {isBattle && currentBattleInfo?.battleId && <div className="battle-info">{showBattleInfo()}</div>}
            {isGameInfoShown(pathname, currentBattleInfo?.battleId) && (
                <div className="menu-game-info">
                    {isBattle && (
                        <div className="menu-game-info-box">
                            <div className="menu-game-info-box-head">přezdívka</div>
                            <div className="menu-game-info-box-item">{myPlayer?.name}</div>
                        </div>
                    )}
                    <div className="menu-game-info-box">
                        <div className="menu-game-info-box-head">kolo</div>
                        <div className="menu-game-info-box-item">{showRoundInfo()}</div>
                    </div>
                    <div className="menu-game-info-box">
                        <div className="menu-game-info-box-head">celkové skóre</div>
                        <div className="menu-game-info-box-item">{showTotalScoreInfo()}</div>
                    </div>
                    <div className="menu-game-info-box">
                        <div className="menu-game-info-box-head">mód</div>
                        <div className="menu-game-info-box-item">{mapModeName()}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Menu;

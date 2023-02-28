import { CoffeeOutlined, FacebookFilled, InfoCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

import smilingLogo from '../../assets/images/kdetosakraSmile.svg';
import { TOTAL_ROUNDS_MAX } from '../../constants/game';
import { routeNames } from '../../constants/routes';
import useGetRandomUserToken from '../../hooks/useGetRandomUserToken';
import { findUserFromBattleByRandomTokenId } from '../../util';
import BattleCountDown from '../BattleCountdown';
import GameInfo from '../GameInfo';

const isGameInfoShown = (pathname, isBattle) => {
    return (
        isBattle ||
        pathname.includes(routeNames.geolokace) ||
        pathname.includes(routeNames.vlastni) ||
        pathname.includes(routeNames.nahodne) ||
        pathname.includes(routeNames.nahodneKraj) ||
        pathname.includes(routeNames.mesto) ||
        pathname.includes(routeNames.heraldika)
    );
};

const Menu = ({ isInGame = false }) => {
    const randomUserToken = useGetRandomUserToken();
    const { pathname } = useLocation();
    const currentGame = useSelector(state => state.game.currentGame);
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);
    const currentBattlePlayers = useSelector(state => state.battle.currentBattle.players);
    const [myPlayer, setMyPlayer] = useState();

    const isBattle = pathname.includes(routeNames.battle) && currentBattleInfo?.battleId;

    useEffect(() => {
        if (currentBattlePlayers !== null) {
            setMyPlayer(findUserFromBattleByRandomTokenId(currentBattlePlayers, randomUserToken));
        }
    }, [currentBattlePlayers, randomUserToken]);

    const isGameFinished = () => {
        if (currentBattleInfo) {
            try {
                const { round, rounds } = currentBattleInfo;
                const currentRound = rounds[round - 1];
                const { isGuessed, isRoundActive } = currentRound;
                return isGuessed && !isRoundActive && round >= TOTAL_ROUNDS_MAX;
            } catch (err) {
                return false;
            }
        }
        return false;
    };

    return (
        <div id="menu-container" className={classNames('section menu-container', isInGame && 'menu-without-padding')}>
            <Link to="/">
                <div className="logo">
                    <img
                        id="kdetosakra-logo"
                        src={smilingLogo}
                        alt="logo"
                        className="kdetosakra-logo"
                        width="50px"
                        height="auto"
                    />
                    <h2 className="kdetosakra-logo-text">Kde to sakra?</h2>
                </div>
            </Link>
            <div className={isBattle || isInGame ? 'main-menu--battle' : 'main-menu'}>
                <Link to="/info">
                    <InfoCircleOutlined style={{ color: 'rgb(97, 95, 95)', marginRight: '10px' }} />
                    <div className="menu-item">O projektu</div>
                </Link>
                <div className="menu-item menu-separator">|</div>
                <Link to="/napoveda">
                    <QuestionCircleOutlined style={{ color: 'rgb(97, 95, 95)', marginRight: '10px' }} />
                    <div className="menu-item">Nápověda</div>
                </Link>
                {!isBattle && (
                    <>
                        <div className="menu-item menu-separator">|</div>
                        <CoffeeOutlined style={{ color: 'rgb(97, 95, 95)', marginRight: '10px' }} />
                        <a href="https://www.buymeacoffee.com/mmwbwdq" target="_blank" rel="noreferrer">
                            <div className="menu-item">Podpořte provoz a další rozvoj</div>
                        </a>
                    </>
                )}
                <div className="menu-item menu-separator">|</div>
                {/* eslint-disable-next-line react/jsx-no-target-blank */}
                <a href="https://www.facebook.com/kdetosakra.cz" target="_blank" rel="noreferrer">
                    <FacebookFilled style={{ color: 'rgb(97, 95, 95)' }} />
                </a>
            </div>
            {!isGameFinished() && isBattle && myPlayer?.userId && currentBattleInfo.round > 0 && <BattleCountDown />}
            {isGameInfoShown(pathname, isBattle) && (
                <GameInfo
                    round={isBattle ? currentBattleInfo.round : currentGame.round}
                    totalScore={isBattle ? currentBattleInfo.myTotalScore : currentGame.totalScore}
                    mode={isBattle ? currentBattleInfo.mode : currentGame.mode}
                    isBattle={isBattle}
                    myPlayer={myPlayer}
                    myNickname={currentBattleInfo?.myNickname}
                />
            )}
        </div>
    );
};

export default Menu;

import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    FacebookFilled, HomeOutlined, InfoCircleOutlined, QuestionCircleOutlined
} from '@ant-design/icons';
import smilingLogo from '../../assets/images/kdetosakraSmile.svg';
import routeNames from '../../constants/routes';
import useGetRandomUserToken from '../../hooks/useGetRandomUserToken';
import { findUserFromBattleByRandomTokenId } from '../../util';
import GameInfo from '../GameInfo';
import BattleCountDown from '../BattleCountdown';
import { TOTAL_ROUNDS_MAX } from '../../constants/game';

const isGameInfoShown = (pathname, isBattle) => {
    return (
        isBattle
        || pathname.includes(routeNames.geolokace)
        || pathname.includes(routeNames.vlastni)
        || pathname.includes(routeNames.nahodne)
        || pathname.includes(routeNames.mesto)
    );
};

const Menu = () => {
    const randomUserToken = useGetRandomUserToken();
    const { pathname } = useLocation();
    const currentGame = useSelector(state => state.game.currentGame);
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);
    const currentBattlePlayers = useSelector(state => state.battle.currentBattle.players);
    const [myPlayer, setMyPlayer] = useState();

    const isBattle = pathname.includes(routeNames.battle) && currentBattleInfo?.battleId;

    useEffect(() => {
        setMyPlayer(findUserFromBattleByRandomTokenId(currentBattlePlayers, randomUserToken));
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
        <div id="menu-container" className="section menu-container">
            <div className={isBattle ? 'main-menu--battle' : 'main-menu'}>
                <Link to="/">
                    <HomeOutlined style={{ color: 'rgb(97, 95, 95)', marginRight: '10px' }} />
                    <div className="menu-item">Herní módy</div>
                </Link>
                <div className="menu-item menu-separator">|</div>
                <Link to="/info">
                    <InfoCircleOutlined style={{ color: 'rgb(97, 95, 95)', marginRight: '10px' }} />
                    <div className="menu-item">O projektu</div>
                </Link>
                <div className="menu-item menu-separator">|</div>
                <Link to="/napoveda">
                    <QuestionCircleOutlined style={{ color: 'rgb(97, 95, 95)', marginRight: '10px' }} />
                    <div className="menu-item">Nápověda</div>
                </Link>
                <div className="menu-item menu-separator">|</div>
                {/* eslint-disable-next-line react/jsx-no-target-blank */}
                <a href="https://www.facebook.com/kdetosakra.cz" target="_blank" rel="noreferrer">
                    <FacebookFilled style={{ color: 'rgb(97, 95, 95)' }} />
                </a>
            </div>
            <img id="kdetosakra-logo" src={smilingLogo} alt="logo" className="kdetosakra-logo" width="85%" />
            {!isGameFinished() && isBattle && myPlayer?.userId && currentBattleInfo && (
                <BattleCountDown currentBattleInfo={currentBattleInfo} />
            )}
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

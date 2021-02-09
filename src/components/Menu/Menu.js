import React, { useEffect, useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Alert } from 'antd';
import { differenceInSeconds } from 'date-fns';
import { FacebookFilled, HomeOutlined, InfoCircleOutlined } from '@ant-design/icons';
import smilingLogo from '../../assets/images/kdetosakraSmile.svg';
import { TOTAL_ROUNDS_MAX } from '../../constants/game';
import routeNames from '../../constants/routes';
import useGetRandomUserToken from '../../hooks/useGetRandomUserToken';
import { findMyUserFromBattle, getDateFromUnixTimestamp, mapGameModeName } from '../../util';
import useTimeInterval from '../../hooks/useTimeInterval';

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
    const currentGameInfo = useSelector(state => state.game.currentGame);
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);
    const currentBattlePlayers = useSelector(state => state.battle.currentBattle.players);
    const [myPlayer, setMyPlayer] = useState();
    const [countdownTime, setCountdownTime] = useState(-1);
    const [countdownIsRunning, setCountdownIsRunning] = useState(false);

    const isBattle = pathname.includes(routeNames.battle);

    const handleTick = () => {
        setCountdownTime(prevTime => prevTime - 1);
    };

    const { startInterval, stopInterval } = useTimeInterval(handleTick);

    useEffect(() => {
        setMyPlayer(findMyUserFromBattle(currentBattlePlayers, randomUserToken));
    }, [currentBattlePlayers]);

    const mapModeName = () => {
        const mode = isBattle ? currentBattleInfo.mode : currentGameInfo.mode;
        return mapGameModeName(mode);
    };

    useEffect(() => {
        const {
            isGameFinishedSuccessfully,
            isGameStarted,
            withCountdown,
            countdown,
            round,
            rounds,
        } = currentBattleInfo;
        if (isGameStarted && rounds.length) {
            // check rounds because they are assigned in BattleGame later
            const currentBattleRound = rounds[round - 1];
            const { isGuessed, guessedTime, firstGuess } = currentBattleRound;
            // TODO check if it is not expired already
            if (isGuessed && withCountdown && !countdownIsRunning) {
                const { name, guessedById } = firstGuess;
                const guessedTimeDate = getDateFromUnixTimestamp(guessedTime);
                setCountdownTime(countdown - differenceInSeconds(new Date(), guessedTimeDate));
                startInterval();
                setCountdownIsRunning(true);
            }
        }
    }, [currentBattleInfo, countdownIsRunning]);

    useEffect(() => {
        if (countdownTime < 1) {
            stopInterval();
        }
    }, [countdownTime]);

    useEffect(() => {
        return () => {
            stopInterval();
        };
    }, [pathname]);

    const startCountdown = (countdown, guessedTime) => {
        const dateNow = new Date();
        const guessedTimeDate = getDateFromUnixTimestamp(guessedTime);
        setCountdownTime(countdown - differenceInSeconds(dateNow, guessedTimeDate));
        startInterval();
        setCountdownIsRunning(true);
    };

    const battleInfo = useMemo(() => {
        const {
            isGameFinishedSuccessfully,
            isGameStarted,
            withCountdown,
            countdown,
            round,
            rounds,
        } = currentBattleInfo;
        // check rounds because they are assigned in BattleGame later
        if (isGameStarted && round > 0 && rounds.length) {
            const currentBattleRound = rounds[round - 1];
            const { isGuessed, guessedTime, firstGuess } = currentBattleRound;
            // TODO check if it is not expired already
            if (isGuessed && withCountdown) {
                if (!countdownIsRunning) {
                    startCountdown(countdown, guessedTime);
                }
                const { name, guessedById } = firstGuess;
                const alertMessageOthers = (
                    <>
                        {countdownTime > 0 ? (
                            <>
                                <b>{name}</b>
                                {' '}
                                byl nejrychlejší. Na tvůj tip ti zbývá
                                <b>
                                    {' '}
                                    {countdownTime}
                                </b>
                                {' '}
                                sekund.
                            </>
                        ) : (
                            <b>Kolo skončilo.</b>
                        )}
                    </>
                );
                const alertMessageYouFastest = (
                    <>
                        {countdownTime > 0 ? (
                            <>
                                Byl jsi nejrychlejší! Do konce kola zbývá
                                <b>
                                    {' '}
                                    {countdownTime}
                                </b>
                                {' '}
                                sekund.
                            </>
                        ) : (
                            <b>Kolo skončilo.</b>
                        )}
                    </>
                );
                return countdownIsRunning ? (
                    <Alert
                        message={guessedById === randomUserToken ? alertMessageYouFastest : alertMessageOthers}
                        type="info"
                    />
                ) : (
                    'ta druha moznost'
                );
            }
        }

        const beforeStartMessage = (
            <>
                Po nejrychlejším tipu daného kola začne odpočet
                {' '}
                <b>
                    {countdown}
                    {' '}
                    sekund
                </b>
                .
            </>
        );

        return !isGameStarted ? <Alert message={beforeStartMessage} /> : null;
    }, [currentBattleInfo, countdownTime]);

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
            {isBattle && currentBattleInfo?.battleId && <div className="battle-info">{battleInfo}</div>}
            {isGameInfoShown(pathname, currentBattleInfo?.battleId) && (
                <div className={isBattle ? 'menu-game-info--battle' : 'menu-game-info'}>
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

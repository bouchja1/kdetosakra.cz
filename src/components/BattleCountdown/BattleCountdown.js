import React, { useEffect, useMemo, useState } from 'react';
import { Alert } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { differenceInSeconds } from 'date-fns';
import { useLocation, useParams } from 'react-router-dom';
import useGetRandomUserToken from '../../hooks/useGetRandomUserToken';
import { getDateFromUnixTimestamp } from '../../util';
import useTimeInterval from '../../hooks/useTimeInterval';
import useNextRoundInterval from '../../hooks/useNextRoundInterval';
import { setIsRoundActive } from '../../redux/actions/battle';
import { updateBattle } from '../../services/firebase';

const getAlertMessageFastestPlayer = (round, countdownTime) => (
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
            <b>
                {round}
                . kolo skončilo.
            </b>
        )}
    </>
);

const getAlertMessageOtherPlayers = (round, name, countdownTime) => (
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
            <b>
                {round}
                . kolo skončilo.
            </b>
        )}
    </>
);

const BattleCountDown = ({ currentBattleInfo }) => {
    const dispatch = useDispatch();
    const { battleId } = useParams();
    const randomUserToken = useGetRandomUserToken();
    const currentBattleRoundId = useSelector(state => state.battle.currentBattle.round);
    const currentBattlePlayers = useSelector(state => state.battle.currentBattle.players);
    const [countdownTime, setCountdownTime] = useState(-1);
    const [nextRoundTime, setNextRoundTime] = useState(-1);
    const [countdownIsRunning, setCountdownIsRunning] = useState(false);
    const [nextRoundCountdownIsRunning, setNextRoundCountdownIsRunning] = useState(false);
    const [currentRound, setCurrentRound] = useState();
    const { pathname } = useLocation();

    const {
        isGameStarted, countdown, round, rounds,
    } = currentBattleInfo;

    const handleBattleRoundTick = () => {
        setCountdownTime(prevTime => prevTime - 1);
    };

    const handleNextRoundTick = () => {
        setNextRoundTime(prevTime => prevTime - 1);
    };

    const { startInterval, stopInterval } = useTimeInterval(handleBattleRoundTick);
    const { startInterval: startNextRoundInterval, stopInterval: stopNextRoundInterval } = useNextRoundInterval(
        handleNextRoundTick,
    );

    useEffect(() => {
        if (round && rounds.length) {
            setCurrentRound(rounds[round - 1]);
        }
    }, [round, rounds]);

    // stop countdown when it finishes or all players make a guess
    useEffect(() => {
        const playersWithFinishedRoundGuess = currentBattlePlayers.filter(player => player[`round${round}`]);
        if (
            countdownIsRunning
            && (countdownTime < 1 || playersWithFinishedRoundGuess.length === currentBattlePlayers.length)
        ) {
            dispatch(
                setIsRoundActive({
                    roundId: currentBattleRoundId,
                    active: false,
                }),
            );
            stopInterval();
            setCountdownIsRunning(false);
            if (!nextRoundCountdownIsRunning) {
                startNextRoundCountdown(); // TODO odpocet do kola
            }
        }
    }, [countdownIsRunning, countdownTime, currentBattlePlayers, round]);

    useEffect(() => {
        console.log('LALALALALA: ', nextRoundTime);
        if (nextRoundCountdownIsRunning && nextRoundTime < 1) {
            // TODO poslat currentRoundStart unix timestamp
            updateBattle(battleId, { currentRoundStart: getDateFromUnixTimestamp(new Date()), round: round + 1 })
                .then(docRef => {
                    console.log('NOOOOOO: ', docRef);
                    stopNextRoundInterval();
                    setNextRoundCountdownIsRunning(false);
                    setNextRoundTime(0);
                })
                .catch(err => {
                    console.log('NOOOOOOO ERROR: ', err);
                });
        }
    }, [nextRoundTime]);

    // clean countdown after a pathname is changed
    useEffect(() => {
        return () => {
            stopInterval();
            stopNextRoundInterval();
            setCountdownTime(0);
            setNextRoundTime(0);
            setCountdownIsRunning(false);
            setNextRoundCountdownIsRunning(false);
        };
    }, [pathname]);

    const startCountdown = guessedTime => {
        const guessedTimeDate = getDateFromUnixTimestamp(guessedTime);
        setCountdownTime(countdown - differenceInSeconds(new Date(), guessedTimeDate));
        startInterval();
        setCountdownIsRunning(true);
    };

    const startNextRoundCountdown = guessedTime => {
        setNextRoundTime(15);
        startNextRoundInterval();
        setNextRoundCountdownIsRunning(true);
    };

    const battleInfo = useMemo(() => {
        if (currentRound) {
            const {
                isGuessed, guessedTime, firstGuess, isRoundActive,
            } = currentRound;
            if (isGuessed && !isRoundActive) {
                if (!nextRoundCountdownIsRunning) {
                    startNextRoundCountdown(); // TODO odpocet do kola
                }
                return (
                    <Alert
                        message={(
                            <b>
                                {round}
                                . kolo skončilo. Další začne automaticky za
                                <b>
                                    {' '}
                                    {nextRoundTime}
                                    {' '}
                                    s
                                </b>
                            </b>
                        )}
                        type="info"
                    />
                );
            }

            if (isGuessed && !countdownIsRunning) {
                startCountdown(guessedTime);
            }

            if (firstGuess) {
                const { name, guessedById } = firstGuess;
                return (
                    <Alert
                        message={
                            guessedById === randomUserToken
                                ? getAlertMessageFastestPlayer(round, countdownTime)
                                : getAlertMessageOtherPlayers(round, name, countdownTime)
                        }
                        type="info"
                    />
                );
            }
        }

        return null;
    }, [currentRound, countdownTime, nextRoundTime]);

    if (!isGameStarted) {
        return (
            <Alert
                message={(
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
                )}
            />
        );
    }

    return <div className="battle-info">{battleInfo}</div>;
};

export default BattleCountDown;

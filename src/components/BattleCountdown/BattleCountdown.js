import React, { useEffect, useMemo, useState } from 'react';
import { Alert } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { differenceInSeconds } from 'date-fns';
import { useLocation } from 'react-router-dom';
import useGetRandomUserToken from '../../hooks/useGetRandomUserToken';
import { getDateFromUnixTimestamp } from '../../util';
import useTimeInterval from '../../hooks/useTimeInterval';
import { setIsRoundActive } from '../../redux/actions/battle';

const BattleCountDown = () => {
    const dispatch = useDispatch();
    const randomUserToken = useGetRandomUserToken();
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);
    const currentBattleRoundId = useSelector(state => state.battle.currentBattle.round);
    const [countdownTime, setCountdownTime] = useState(-1);
    const [countdownIsRunning, setCountdownIsRunning] = useState(false);
    const { pathname } = useLocation();

    const handleTick = () => {
        setCountdownTime(prevTime => prevTime - 1);
    };

    const { startInterval, stopInterval } = useTimeInterval(handleTick);

    const startCountdown = (countdown, guessedTime) => {
        const dateNow = new Date();
        const guessedTimeDate = getDateFromUnixTimestamp(guessedTime);
        setCountdownTime(countdown - differenceInSeconds(dateNow, guessedTimeDate));
        startInterval();
        setCountdownIsRunning(true);
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
            dispatch(
                setIsRoundActive({
                    roundId: currentBattleRoundId,
                    active: false,
                }),
            );
            stopInterval();
            setCountdownTime(0);
        }
    }, [countdownTime]);

    useEffect(() => {
        return () => {
            stopInterval();
            setCountdownTime(0);
        };
    }, [pathname]);

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
                return (
                    countdownIsRunning && (
                        <Alert
                            message={guessedById === randomUserToken ? alertMessageYouFastest : alertMessageOthers}
                            type="info"
                        />
                    )
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

    return <div className="battle-info">{battleInfo}</div>;
};

export default BattleCountDown;

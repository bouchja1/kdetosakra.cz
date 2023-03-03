import { useLocalStorage } from '@rehooks/local-storage';
import { Layout } from 'antd';
import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

import { AmazingPlacesRoundResultModal } from '../../components/AmazingPlacesRoundResultModal';
import gameModes from '../../enums/modes';
import useGameMenuResize from '../../hooks/useGameMenuResize';
import { setCurrentGame, setTotalRoundCounter, setTotalRoundScore } from '../../redux/actions/game';
import { AmazingPlace, GuessedAmazingPlacePoint } from '../../types/places';
import { getRandomAmazingPlace } from '../../util';
import { AmazingPlacesMapContainer } from '../AmazingPlacesMapContainer';

const { Content } = Layout;

const AmazingPlaceContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20px;
    gap: 30px;
`;

export const AmazingPlacesGame = () => {
    const dispatch = useDispatch();
    const [smapDimensionLocalStorage] = useLocalStorage<'max' | 'min' | 'normal'>('smapDimension');
    // @ts-ignore
    const [activeTabKey, setActiveTabKey] = useState('1');
    // @ts-ignore
    const currentGame = useSelector(state => state.game.currentGame);
    const [roundScore, setRoundScore] = useState(0);
    const [roundGuessedDistance, setRoundGuessedDistance] = useState<number | null>(null);
    const [resultModalVisible, setResultModalVisible] = useState(false);
    const [guessedAmazingPlace, setGuessedAmazingPlace] = useState<AmazingPlace | null>(null);
    const [allGuessedPlaces, setAllGuessedPlaces] = useState<GuessedAmazingPlacePoint[]>([]);
    const [currentRoundGuessedPoint, setCurrentRoundGuessedPoint] = useState<GuessedAmazingPlacePoint | null>(null);
    const [mapDimension, setMapDimension] = useState<'max' | 'min' | 'normal'>(smapDimensionLocalStorage || 'normal');
    const [nextRoundButtonVisible, setNextRoundButtonVisible] = useState(false);
    useGameMenuResize();

    const { mode, round, amazingPlace, totalScore } = currentGame;

    // FIXME: to load whole map layer when the map is minimized before
    useEffect(() => {
        window.dispatchEvent(new Event('resize'));
    }, [activeTabKey]);

    useEffect(() => {
        // Do not do this for mobile - it breaks map rendering in next rounds
        if (!isMobile) {
            if (!round || round === 1) {
                setMapDimension('normal');
            } else {
                setMapDimension('min');
            }
        }
    }, [round]);

    const evaluateGuessedRound = (guessedPlacesInRound: GuessedAmazingPlacePoint) => {
        const { amazingPlace } = guessedPlacesInRound;
        setGuessedAmazingPlace(amazingPlace);
        setAllGuessedPlaces([...allGuessedPlaces, guessedPlacesInRound]);
        setCurrentRoundGuessedPoint(guessedPlacesInRound);
        setResultModalVisible(true);
    };

    const handleGuessNextRound = () => {
        const randomAmazingPlace = getRandomAmazingPlace();

        setResultModalVisible(false);
        dispatch(
            // @ts-ignore
            setCurrentGame({
                amazingPlace: randomAmazingPlace,
            }),
        );
        // @ts-ignore
        dispatch(setTotalRoundCounter(round + 1));
    };

    const changeNextRoundButtonVisibility = (visible: boolean) => {
        setNextRoundButtonVisible(visible);
    };

    const saveRoundResult = (score: number, distance: number) => {
        console.log('SCORE: ', score);
        console.log('DISTANCE: ', distance);
        setRoundScore(Math.round(score));
        // @ts-ignore
        dispatch(setTotalRoundScore(Math.round(totalScore + score)));
        setRoundGuessedDistance(distance);
    };

    if (mode === gameModes.amazingPlaces && amazingPlace) {
        return (
            <Content>
                <div>
                    <AmazingPlaceContainer>
                        <p>LALA BLABLA</p>
                    </AmazingPlaceContainer>
                    <AmazingPlacesMapContainer
                        onGuessNextRound={handleGuessNextRound}
                        mapDimension={mapDimension}
                        onSetMapDimension={dimension => setMapDimension(dimension)}
                        amazingPlace={amazingPlace}
                        evaluateGuessedRound={evaluateGuessedRound}
                        currentRoundGuessedPoint={currentRoundGuessedPoint}
                        saveRoundResult={saveRoundResult}
                        allGuessedPlaces={allGuessedPlaces}
                        nextRoundButtonVisible={nextRoundButtonVisible}
                        changeNextRoundButtonVisibility={changeNextRoundButtonVisibility}
                    />
                </div>
                {guessedAmazingPlace && (
                    <AmazingPlacesRoundResultModal
                        visible={resultModalVisible}
                        closeModal={() => setResultModalVisible(false)}
                        guessedAmazingPlace={guessedAmazingPlace}
                        roundGuessedDistance={roundGuessedDistance}
                        roundScore={roundScore}
                    />
                )}
            </Content>
        );
    }

    return (
        <Redirect
            to={{
                pathname: '/',
            }}
        />
    );
};

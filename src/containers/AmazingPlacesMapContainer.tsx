import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import GuessingMap from '../components/GuessingMap';
import GuessingMapButton from '../components/GuessingMapButton';
import { LittleMapImage } from '../components/littleMap/LittleMapImage';
import MapyCzContext from '../context/MapyCzContext';
import { AmazingPlace, GuessedAmazingPlacePoint } from '../types/places';
import { MarkLatLon, calculateDistanceForPlace, drawDistanceToTheMap } from '../util/mapContainer';

interface AmazingPlacesMapContainerProps {
    mapDimension: 'min' | 'max' | 'normal';
    onSetMapDimension: (dimension: 'min' | 'max' | 'normal') => void;
    onGuessNextRound: () => void;
    saveRoundResult: (score: number, distance: number) => void;
    amazingPlace: AmazingPlace;
    changeNextRoundButtonVisibility: (visible: boolean) => void;
    allGuessedPlaces: GuessedAmazingPlacePoint[];
    nextRoundButtonVisible: boolean;
    evaluateGuessedRound: (guessedPlaceInRoundPoints: GuessedAmazingPlacePoint) => void;
    currentRoundGuessedPoint: GuessedAmazingPlacePoint | null;
}

export const AmazingPlacesMapContainer = ({
    mapDimension,
    onSetMapDimension,
    onGuessNextRound,
    amazingPlace,
    saveRoundResult,
    changeNextRoundButtonVisibility,
    allGuessedPlaces,
    nextRoundButtonVisible,
    evaluateGuessedRound,
    currentRoundGuessedPoint,
}: AmazingPlacesMapContainerProps) => {
    const mapyContext = useContext<any>(MapyCzContext);
    const [guessButtonDisabled, setGuessButtonDisabled] = useState(true);
    // @ts-ignore
    const currentGame = useSelector(state => state.game.currentGame);
    const [roundGuessed, setRoundGuessed] = useState(false);
    const [currentMapPointCoordinates, setCurrentMapPointCoordinates] = useState({
        mapLon: 0,
        mapLat: 0,
    });

    // common vars for both multiplayer and singleplayer
    const [mode, setMode] = useState();
    const [totalScore, setTotalScore] = useState();
    const [round, setRound] = useState();

    const refLayerValue = useRef();
    const refVectorLayerSMapValue = useRef();

    useEffect(() => {
        const {
            mode: currentGameMode,
            totalScore: currentGameTotalScore,
            round: currentGameRound,
            amazingPlace,
        } = currentGame;
        setMode(currentGameMode);
        setTotalScore(currentGameTotalScore);
        setRound(currentGameRound);
    }, [currentGame]);

    const guessSingleplayerRound = () => {
        const guessedRoundPoint = calculateCoordsAndDrawGuess();
        evaluateGuessedRound(guessedRoundPoint);
    };

    const handleSaveCurrentClickedMapPointCoordinates = (coordinates: any) => {
        setCurrentMapPointCoordinates(coordinates);
        setGuessButtonDisabled(false);
    };

    const drawGuessedDistance = (
        currentPanoramaPositionPoint: any,
        selectedPointOnMap: any,
        panoramaCoordinates: MarkLatLon,
    ) => {
        const { path, markerPanorama } = drawDistanceToTheMap(
            mapyContext.SMap,
            currentPanoramaPositionPoint,
            selectedPointOnMap,
            panoramaCoordinates,
        );
        // @ts-ignore
        refVectorLayerSMapValue.current.addGeometry(path);
        // @ts-ignore
        refLayerValue.current.addMarker(markerPanorama);
    };

    const calculateCoordsAndDrawGuess = (): GuessedAmazingPlacePoint => {
        setGuessButtonDisabled(true);
        changeNextRoundButtonVisibility(true);
        setRoundGuessed(true);

        const { distance, score } = calculateDistanceForPlace(mode!, saveRoundResult, currentMapPointCoordinates, {
            lat: amazingPlace.latitude,
            lon: amazingPlace.longitude,
        });

        const guessedPanoramaPositionPoint = mapyContext.SMap.Coords.fromWGS84(
            amazingPlace.longitude,
            amazingPlace.latitude,
        );
        const selectedPointOnMap = mapyContext.SMap.Coords.fromWGS84(
            currentMapPointCoordinates.mapLon,
            currentMapPointCoordinates.mapLat,
        );
        drawGuessedDistance(guessedPanoramaPositionPoint, selectedPointOnMap, {
            lon: amazingPlace.longitude,
            lat: amazingPlace.latitude,
        });
        const guessedRoundPoint = {
            pointPanorama: guessedPanoramaPositionPoint,
            pointMap: selectedPointOnMap,
            amazingPlace,
            distance,
            score,
        };
        return guessedRoundPoint;
    };

    /**
     * Refresh map for a new guessing!
     */
    const refreshMap = () => {
        onGuessNextRound();
        // @ts-ignore
        refLayerValue.current.removeAll();
        // @ts-ignore
        refVectorLayerSMapValue.current.removeAll();
        changeNextRoundButtonVisibility(false);
        setGuessButtonDisabled(true);
        setRoundGuessed(false);
        window.scrollTo(0, 0);
    };

    return (
        <LittleMapImage
            onSetMapDimension={onSetMapDimension}
            mapDimension={mapDimension}
            visible={true}
            GuessingMap={
                <>
                    <GuessingMap
                        currentRoundGuessedPoint={currentRoundGuessedPoint}
                        refLayerValue={refLayerValue}
                        roundGuessed={roundGuessed}
                        refVectorLayerSMapValue={refVectorLayerSMapValue}
                        saveCurrentClickedMapPointCoordinates={handleSaveCurrentClickedMapPointCoordinates}
                    />
                    <GuessingMapButton
                        refreshMap={refreshMap}
                        guessSingleplayerRound={guessSingleplayerRound}
                        allGuessedPoints={allGuessedPlaces}
                        round={round}
                        totalScore={totalScore}
                        roundGuessed={roundGuessed}
                        disabled={guessButtonDisabled}
                        currentRound={currentGame.round}
                        currentGame={currentGame}
                        nextRoundButtonVisible={nextRoundButtonVisible}
                    />
                </>
            }
        />
    );
};

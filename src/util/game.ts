import { CurrentGameRound } from '../types/game';

export const wasLatLonPanoramaUsedInCurrentGame = (
    lat: number,
    lon: number,
    currentGameRounds: CurrentGameRound[] = [],
) => {
    const foundedPanoramas = currentGameRounds.filter(round => {
        const { lat: latRound, lon: lonRound } = round;
        return latRound === lat && lonRound === lon;
    });
    return foundedPanoramas.length > 0;
};

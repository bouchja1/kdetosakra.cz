import { roundToTwoDecimal } from './index';
import { TOTAL_ROUNDS_MAX } from '../constants/game';
import gameModes from '../enums/modes';
import { saveCityScore, saveRandomScore } from '../services/api';

export const storeResult = (mode, city, totalRoundScore, randomUserResultToken) => {
    const percent = roundToTwoDecimal(totalRoundScore / TOTAL_ROUNDS_MAX);
    if (randomUserResultToken) {
        if (mode === gameModes.random) {
            saveRandomScore(randomUserResultToken, percent).catch(err => {
                // we ignore this
            });
        } else if (mode === gameModes.city) {
            saveCityScore(city.name, randomUserResultToken, percent).catch(err => {
                // we ignore this
            });
        }
    }
};

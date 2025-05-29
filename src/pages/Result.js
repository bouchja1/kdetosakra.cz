import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { DonateContent } from '../components/DonateContent';
import gameModes from '../enums/modes';
import useGameMenuResize from '../hooks/useGameMenuResize';
import { BattleResult, SingleResult } from './results';
import { HeraldryResult } from './results/HeraldryResult';

export const Result = () => {
    useGameMenuResize();
    const lastResult = useSelector(state => state.result);

    const { isBattle, mode } = lastResult;

    // to load whole map layer again when the map is minimized before (otherwise breaks with JAK scrollLeft)
    useEffect(() => {
        window.dispatchEvent(new Event('resize'));
    }, []);

    if (mode === gameModes.heraldry) {
        return <HeraldryResult />;
    }

    return <>{isBattle ? <BattleResult /> : <SingleResult />}</>;
};

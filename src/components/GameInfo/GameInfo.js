import React, { useMemo } from 'react';

import { TOTAL_ROUNDS_MAX } from '../../constants/game';
import { mapGameModeName } from '../../util';

const GameInfo = ({ round, totalScore, mode, isBattle, myPlayer, myNickname }) => {
    const roundInfo = useMemo(() => {
        return `${round ?? 0} / ${TOTAL_ROUNDS_MAX}`;
    }, [round]);

    const myTotalScore = useMemo(() => {
        return totalScore ?? 0;
    }, [totalScore]);

    if (isBattle && !myPlayer?.userId) {
        return null;
    }

    return (
        <div className="menu-game-info">
            {isBattle && (
                <div className="menu-game-info-box">
                    <div className="menu-game-info-box-head">přezdívka</div>
                    <div className="menu-game-info-box-item">{myNickname}</div>
                </div>
            )}
            <div className="menu-game-info-box">
                <div className="menu-game-info-box-head">kolo</div>
                <div className="menu-game-info-box-item">{roundInfo}</div>
            </div>
            <div className="menu-game-info-box">
                <div className="menu-game-info-box-head">celkové skóre</div>
                <div className="menu-game-info-box-item">{myTotalScore}</div>
            </div>
            <div className="menu-game-info-box">
                <div className="menu-game-info-box-head">mód</div>
                <div className="menu-game-info-box-item">{mapGameModeName(mode)}</div>
            </div>
        </div>
    );
};

export default GameInfo;

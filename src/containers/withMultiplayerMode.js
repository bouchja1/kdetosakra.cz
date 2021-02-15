import React from 'react';

export const withMultiplayerMode = GameScreenComponent => props => {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <GameScreenComponent {...props} isBattle />;
};

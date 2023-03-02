import Lottie from 'lottie-react';
import React from 'react';

import confettiAnimation from '../data/lottie/confetti.json';

export const ConfettiAnimation = () => {
    return (
        <Lottie
            animationData={confettiAnimation}
            loop={false}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
            }}
        />
    );
};

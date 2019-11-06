import React from 'react';

const NextRoundButton = ({refreshMap}) => {
    return (
        <button onClick={refreshMap} type="submit">
            Další kolo!
        </button>
    );
};

export default NextRoundButton;

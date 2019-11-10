import React from 'react';
import { Button } from 'antd';

const NextRoundButton = ({ refreshMap }) => {
    return (
        <Button onClick={refreshMap} type="primary">
            Další kolo!
        </Button>
    );
};

export default NextRoundButton;

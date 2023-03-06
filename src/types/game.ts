import { Radio, Select } from 'antd';
import React, { ReactNode } from 'react';

import randomCover from '../assets/images/city/random.jpg';
import { nutsCodes } from '../enums/nutsCodes';

export interface CurrentGameRound {
    roundId: number;
    lat: number;
    bestPanoramaPlace: any; // from Mapy API
    lon: number;
}

export interface GameModes {
    coverImgAlt: string;
    coverImgSrc: string;
    title: string;
    content: ReactNode;
    isNew?: boolean;
}

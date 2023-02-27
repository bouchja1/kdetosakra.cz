import { Radio, RadioChangeEvent, Space } from 'antd';
import React from 'react';

import { guessResultMode } from '../constants/game';

interface GuessResultModeProps {
    value: string;
    onChange: (e: RadioChangeEvent) => void;
}

export const GuessResultMode = ({ value, onChange }: GuessResultModeProps) => {
    return (
        <>
            <p>Jakou polohu v mapě chceš hádat?</p>
            <Radio.Group onChange={onChange} value={value}>
                <Space direction="vertical">
                    <Radio value={guessResultMode.end}>hádat aktuální polohu v panorama</Radio>
                    <Radio value={guessResultMode.start}>hádat polohu výchozího místa</Radio>
                </Space>
            </Radio.Group>
            <div style={{ marginTop: '10px', color: '#c80707' }}>
                <p>
                    {value === guessResultMode.start
                        ? 'Jak jsi zvyklý např. ze hry GeoGuessr. Zjisti kde to sakra jsi a pak se v mapě dopátrej místa odkud jsi vyrazil. Výsledek se počítá podle pozice na začátku hry.'
                        : 'Dojedeš někam, kde už to bezpečně poznáváš. A pak se trefíš s přesností na metr. Výsledek se počítá podle této poslední polohy v panorama.'}
                </p>
            </div>
        </>
    );
};

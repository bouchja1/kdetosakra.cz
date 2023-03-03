import { Checkbox, Radio, RadioChangeEvent, Space } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import React from 'react';

import { guessResultMode } from '../constants/game';

interface GuessResultModeProps {
    value: string;
    noMoveValue?: boolean;
    onChange: (e: RadioChangeEvent) => void;
    onNoMoveChange?: (e: CheckboxChangeEvent) => void;
    withAdvancedOptions?: boolean;
}

export const GuessResultMode = ({
    value,
    noMoveValue = false,
    onChange,
    onNoMoveChange,
    withAdvancedOptions = false,
}: GuessResultModeProps) => {
    return (
        <>
            <p>Jakou polohu v mapě chceš hádat jako výsledek?</p>
            <Radio.Group onChange={onChange} value={value}>
                <Space direction="vertical">
                    <Radio value={guessResultMode.end}>aktuální polohu v panoráma</Radio>
                    <Radio value={guessResultMode.start}>polohu místa, kde začínám</Radio>
                </Space>
            </Radio.Group>
            <div style={{ marginTop: '10px', color: '#c80707' }}>
                <p>
                    {value === guessResultMode.start ? (
                        'Aneb GeoGuessr. Zjistiš, kde to sakra jsi, a pak se v mapě snažíš dohledat místo odkud se vyráželo.'
                    ) : (
                        <>
                            Dojedeš v panoráma někam, kde už to bezpečně poznáváš (<i>"A hele! Tohle je nádraží!"</i>).
                            A pak označíš místo s přesností na metr.
                        </>
                    )}
                </p>
            </div>
            {withAdvancedOptions && onNoMoveChange && (
                <Checkbox defaultChecked={noMoveValue} checked={noMoveValue} onChange={onNoMoveChange}>
                    Zakázat pohyb v panorama (pro profíky)
                </Checkbox>
            )}
        </>
    );
};

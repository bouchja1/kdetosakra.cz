import { Button, Col, InputNumber, Row, Slider, Tooltip } from 'antd';
import React, { useState } from 'react';
import useGeolocation from 'react-hook-geolocation';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { CATEGORIES } from '../../enums/gaCategories';
import gameModes from '../../enums/modes';
import { setCurrentGame } from '../../redux/actions/game';
import { RADIUS_DESCRIPTION } from '../../util';
import { SinglePlayerModal } from '../SinglePlayerModal';

export const Geolocation = () => {
    const dispatch = useDispatch();
    const geolocationData = useGeolocation();
    const [radius, setRadius] = useState(1);
    const [playGame, setPlayGame] = useState(false);
    const [singlePlayerModalVisible, setSinglePlayerModalVisible] = useState(false);

    const handleChangeRadius = value => {
        setRadius(value);
    };

    const handleSinglePlayerModalVisibility = isVisible => {
        setSinglePlayerModalVisible(isVisible);
    };

    const handleClickStartGame = (resultMode, noMove = false) => {
        dispatch(
            setCurrentGame({
                mode: gameModes.geolocation,
                round: 1,
                totalScore: 0,
                radius: Number(radius),
                city: {
                    coordinates: {
                        longitude: geolocationData.longitude,
                        latitude: geolocationData.latitude,
                    },
                },
                guessResultMode: resultMode,
                regionNutCode: null,
                noMove,
            }),
        );
        setPlayGame(true);
    };

    if (playGame) {
        return (
            <Redirect
                to={{
                    pathname: '/geolokace',
                }}
            />
        );
    }

    // browser is allowed to access user's LAT and LONG
    return geolocationData?.latitude && geolocationData?.longitude ? (
        <>
            <form>
                <label htmlFor="radius">
                    <Tooltip title={RADIUS_DESCRIPTION}>
                        <span>Radius (km): </span>
                    </Tooltip>
                </label>
                <Row>
                    <Col span={12}>
                        <Slider
                            min={1}
                            max={10}
                            onChange={handleChangeRadius}
                            value={typeof radius === 'number' ? radius : 0}
                        />
                    </Col>
                    <Col span={4}>
                        <InputNumber
                            size="large"
                            min={1}
                            max={10}
                            style={{ marginLeft: 16 }}
                            value={radius}
                            onChange={handleChangeRadius}
                        />
                    </Col>
                </Row>
                <p style={{ marginTop: '10px' }}>
                    Panoramata budou náhodně generována v okolí {radius} km od vaší aktuální polohy.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button size="large" type="primary" onClick={() => handleSinglePlayerModalVisibility(true)}>
                        Hrát
                    </Button>
                </div>
            </form>
            <SinglePlayerModal
                visible={singlePlayerModalVisible}
                onModalVisibility={handleSinglePlayerModalVisibility}
                onClickStartGame={handleClickStartGame}
            />
        </>
    ) : (
        <p>Geografickou polohu se nepodařilo načíst.</p>
    );
};

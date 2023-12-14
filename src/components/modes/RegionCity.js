import { Col, InputNumber, Row, Select, Slider, Tooltip } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { cities } from '../../data/cities';
import { CATEGORIES } from '../../enums/gaCategories';
import gameModes from '../../enums/modes';
import { setCurrentGame } from '../../redux/actions/game';
import { RADIUS_DESCRIPTION } from '../../util';
import BattleLinkModal from '../BattleLinkModal';
import { GameStartButtons } from '../GameStartButtons';
import { SinglePlayerModal } from '../SinglePlayerModal';

const { Option } = Select;

export const RegionCity = ({ multiplayerSupported }) => {
    const dispatch = useDispatch();
    const [battleModalVisible, setBattleModalVisible] = useState(false);
    const [singlePlayerModalVisible, setSinglePlayerModalVisible] = useState(false);
    const [citySelected, setCitySelected] = useState(null);
    const [maxCityRadius, setMaxCityRadius] = useState(null);
    const [playGame, setPlayGame] = useState(false);
    const [radius, setRadius] = useState(1);

    const handleChangeRadius = value => {
        setRadius(value);
    };

    const handleBattleModalVisibility = isVisible => {
        setBattleModalVisible(isVisible);
    };

    const handleSinglePlayerModalVisibility = isVisible => {
        setSinglePlayerModalVisible(isVisible);
    };

    const createCitiesOptions = () => {
        const citiesOptions = [];
        for (let i = 0; i < cities.length; i++) {
            citiesOptions.push(
                <Option key={cities[i].name} value={cities[i].name}>
                    {cities[i].fullName}
                </Option>,
            );
        }
        return citiesOptions;
    };

    const changeCity = value => {
        const selectedValue = value;
        if (selectedValue === '') {
            setCitySelected(null);
        } else {
            const selectedCity = cities.filter(city => {
                return city.name === selectedValue;
            });
            setMaxCityRadius(selectedCity[0].radiusMax);
            setCitySelected(selectedCity[0]);
        }
    };

    const handleClickStartGame = (resultMode, noMove = false) => {
        const selectedCity = cities.filter(city => {
            return city.name === citySelected.name;
        });
        dispatch(
            setCurrentGame({
                mode: gameModes.city,
                round: 1,
                totalScore: 0,
                radius: Number(radius),
                city: selectedCity[0],
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
                    pathname: '/mesto',
                }}
            />
        );
    }

    return (
        <div className="randomPlace__modes">
            <form>
                <label htmlFor="city">Město: </label>
                <Select
                    size="large"
                    showSearch
                    name="city"
                    placeholder="zvolit město"
                    onChange={value => {
                        changeCity(value);
                    }}
                >
                    {createCitiesOptions()}
                </Select>
                <div>
                    {citySelected ? (
                        <>
                            <label htmlFor="radius">
                                <Tooltip title={RADIUS_DESCRIPTION}>
                                    <span>Radius (km):</span>
                                </Tooltip>
                            </label>
                            <Row>
                                <Col span={12}>
                                    <Slider
                                        min={1}
                                        max={maxCityRadius}
                                        onChange={handleChangeRadius}
                                        value={typeof radius === 'number' ? radius : 0}
                                    />
                                </Col>
                                <Col span={4}>
                                    <InputNumber
                                        size="large"
                                        min={1}
                                        max={maxCityRadius}
                                        style={{ marginLeft: 16 }}
                                        value={radius}
                                        onChange={handleChangeRadius}
                                    />
                                </Col>
                            </Row>
                            <p style={{ marginTop: '10px' }}>
                                Panoramata budou náhodně generována v okolí {radius} km od středu krajského města.
                            </p>
                        </>
                    ) : (
                        <div style={{ marginBottom: '10px ' }} />
                    )}
                    {citySelected && (
                        <>
                            <GameStartButtons
                                isMultiplayerSupported={multiplayerSupported}
                                onSinglePlayerModalVisible={handleSinglePlayerModalVisibility}
                                onBattleModalVisible={handleBattleModalVisibility}
                            />
                        </>
                    )}
                    <SinglePlayerModal
                        visible={singlePlayerModalVisible}
                        onModalVisibility={handleSinglePlayerModalVisibility}
                        onClickStartGame={handleClickStartGame}
                    />
                    <BattleLinkModal
                        visible={battleModalVisible}
                        handleBattleModalVisibility={handleBattleModalVisibility}
                        mode={gameModes.city}
                        radius={Number(radius)}
                        selectedCity={citySelected}
                    />
                </div>
            </form>
        </div>
    );
};

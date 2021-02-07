import React, { useState } from 'react';
import ReactGA from 'react-ga';
import {
    Button, Col, InputNumber, Row, Select, Slider, Tooltip
} from 'antd';
import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { cities } from '../../data/cities';
import { CATEGORIES } from '../../enums/gaCategories';
import { RADIUS_DESCRIPTION } from '../../util';
import gameModes from '../../enums/modes';
import { setCurrentGame } from '../../redux/actions/game';
import { showMultiplayerWarningModal } from '../../util/multiplayer';
import BattleLinkModal from '../../components/BattleLinkModal';

const { Option } = Select;

export const RegionCity = ({ multiplayerSupported }) => {
    const dispatch = useDispatch();
    const [battleModalVisible, setBattleModalVisible] = useState(false);
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
        <Formik
            initialValues={{ radius: 1, city: '' }}
            onSubmit={(values, { setSubmitting }) => {
                if (multiplayerSupported) {
                    ReactGA.event({
                        category: CATEGORIES.CITY,
                        action: 'Play city game',
                    });
                    const selectedCity = cities.filter(city => {
                        return city.name === values.city;
                    });
                    dispatch(
                        setCurrentGame({
                            mode: gameModes.city,
                            round: 1,
                            totalScore: 0,
                            radius: Number(radius),
                            city: selectedCity[0],
                        }),
                    );
                    setPlayGame(true);
                } else {
                    showMultiplayerWarningModal();
                }
            }}
            validationSchema={Yup.object().shape({
                radius: Yup.number().required('Required'),
                city: Yup.string().required('Required'),
            })}
        >
            {props => {
                const {
                    values, touched, errors, isSubmitting, handleSubmit,
                } = props;
                return (
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="city">Město: </label>
                        <Select
                            showSearch
                            name="city"
                            style={{ width: 200 }}
                            placeholder="Vyber si město"
                            onChange={value => {
                                changeCity(value);
                                values.city = value;
                            }}
                        >
                            {createCitiesOptions()}
                        </Select>
                        {errors.city && touched.city && <div className="input-feedback">{errors.color}</div>}
                        {citySelected ? (
                            <div>
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
                                            min={1}
                                            max={maxCityRadius}
                                            style={{ marginLeft: 16 }}
                                            value={radius}
                                            onChange={handleChangeRadius}
                                        />
                                    </Col>
                                </Row>
                                <p style={{ marginTop: '10px' }}>
                                    Panoramata budou náhodně generována v okolí
                                    {' '}
                                    {radius}
                                    {' '}
                                    km od středu krajského města.
                                </p>
                                <Button
                                    className="button-play"
                                    type="primary"
                                    disabled={isSubmitting}
                                    onClick={handleSubmit}
                                >
                                    Hrát sám
                                </Button>
                                <Button
                                    className="button-play"
                                    type="primary"
                                    disabled={isSubmitting}
                                    onClick={() => setBattleModalVisible(true)}
                                >
                                    Hrát s přáteli
                                </Button>
                                <BattleLinkModal
                                    visible={battleModalVisible}
                                    handleBattleModalVisibility={handleBattleModalVisibility}
                                    mode={gameModes.city}
                                    radius={Number(radius)}
                                    selectedCity={citySelected}
                                />
                            </div>
                        ) : null}
                    </form>
                );
            }}
        </Formik>
    );
};

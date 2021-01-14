import React, { useState } from 'react';
import ReactGA from 'react-ga';
import {
    Button, Col, InputNumber, Row, Select, Slider, Tooltip
} from 'antd';
import { Redirect } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { cities } from '../../../data/cities';
import { CATEGORIES } from '../../../enums/gaCategories';
import { RADIUS_DESCRIPTION } from '../../../util';

const { Option } = Select;

const RegionCity = () => {
    const [citySelected, setCitySelected] = useState(null);
    const [maxCityRadius, setMaxCityRadius] = useState(null);
    const [cityFormSubmitted, setCityFormSubmitted] = useState(false);
    const [cityFormValues, setCityFormValues] = useState({});
    const [radiusCityInputValue, setRadiusCityInputValue] = useState(1);

    const handleChangeCityRadiusInput = value => {
        setRadiusCityInputValue(value);
    };

    const createFormOptions = () => {
        const options = [];
        for (let i = 0; i < cities.length; i++) {
            options.push(
                <Option key={cities[i].name} value={cities[i].name}>
                    {cities[i].fullName}
                </Option>,
            );
        }
        return options;
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
            setCitySelected(selectedCity[0].name);
        }
    };

    if (cityFormSubmitted) {
        const selectedCity = cities.filter(city => {
            return city.name === cityFormValues.city;
        });
        ReactGA.event({
            category: CATEGORIES.CITY,
            action: 'Play city game',
        });
        return (
            <Redirect
                to={{
                    pathname: '/mesto',
                    state: {
                        radius: Number(cityFormValues.radius),
                        city: selectedCity[0],
                        mode: 'city',
                    },
                }}
            />
        );
    }

    return (
        <Formik
            initialValues={{ radius: 1, city: '' }}
            onSubmit={(values, { setSubmitting }) => {
                values.radius = radiusCityInputValue;
                setCityFormValues(values);
                setCityFormSubmitted(true);
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
                            {createFormOptions()}
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
                                            onChange={handleChangeCityRadiusInput}
                                            value={typeof radiusCityInputValue === 'number' ? radiusCityInputValue : 0}
                                        />
                                    </Col>
                                    <Col span={4}>
                                        <InputNumber
                                            min={1}
                                            max={maxCityRadius}
                                            style={{ marginLeft: 16 }}
                                            value={radiusCityInputValue}
                                            onChange={handleChangeCityRadiusInput}
                                        />
                                    </Col>
                                </Row>
                                <p style={{ marginTop: '10px' }}>
                                    Panoramata budou náhodně generována v okolí
                                    {' '}
                                    {radiusCityInputValue}
                                    {' '}
                                    km od středu
                                    krajského města.
                                </p>
                                <Button type="primary" disabled={isSubmitting} onClick={handleSubmit}>
                                    Hrát
                                </Button>
                            </div>
                        ) : null}
                    </form>
                );
            }}
        </Formik>
    );
};

export default RegionCity;

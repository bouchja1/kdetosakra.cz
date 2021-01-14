import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import ReactGA from 'react-ga';
import {
    Button, Select, Card, Slider, InputNumber, Row, Col, Tooltip
} from 'antd';
import cryptoRandomString from 'crypto-random-string';
import { Redirect } from 'react-router-dom';
import useGeolocation from 'react-hook-geolocation';
import { writeStorage, useLocalStorage } from '@rehooks/local-storage';
import { cities } from '../../data/cities';
import { CATEGORIES } from '../../enums/gaCategories';
import Suggest from '../Suggest';
import pragueCover from '../../assets/images/city/prague.jpg';
import randomCover from '../../assets/images/city/random.jpg';
import suggestedCover from '../../assets/images/city/suggested.jpg';
import geolocationCover from '../../assets/images/city/geolocation.jpg';
import { generateRandomRadius, RADIUS_DESCRIPTION } from '../../util';

const { Option } = Select;

const Configuration = function() {
    const [randomUserResultToken] = useLocalStorage('randomUserResultToken'); // send the key to be tracked.
    const geolocation = useGeolocation();
    const [citySelected, setCitySelected] = useState(null);
    const [maxCityRadius, setMaxCityRadius] = useState(null);
    const [randomCityFormSubmitted, setRandomCityFormSubmitted] = useState(false);
    const [cityFormSubmitted, setCityFormSubmitted] = useState(false);
    const [geoFormSubmitted, setGeoFormSubmitted] = useState(false);
    const [cityFormValues, setCityFormValues] = useState({});
    const [geoFormValues, setGeoFormValues] = useState({});
    const [radiusGeolocationInputValue, setRadiusGeolocationInputValue] = useState(1);
    const [radiusCityInputValue, setRadiusCityInputValue] = useState(1);

    useEffect(() => {
        if (!randomUserResultToken) {
            writeStorage('randomUserResultToken', cryptoRandomString({ length: 15 }));
        }
    }, [randomUserResultToken]);

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

    const handleChangeGeolocationRadiusInput = value => {
        setRadiusGeolocationInputValue(value);
    };

    const handleChangeCityRadiusInput = value => {
        setRadiusCityInputValue(value);
    };

    const playRandomCzechPlace = () => {
        if (randomCityFormSubmitted) {
            const randomRadius = generateRandomRadius();
            ReactGA.event({
                category: CATEGORIES.RANDOM_CITY,
                action: 'Play random city game',
            });
            return (
                <Redirect
                    to={{
                        pathname: '/nahodne',
                        state: {
                            radius: randomRadius,
                            city: null,
                            mode: 'random',
                        },
                    }}
                />
            );
        }
        return (
            <Formik
                initialValues={{ radius: 1, city: '' }}
                onSubmit={(values, { setSubmitting }) => {
                    setRandomCityFormSubmitted(true);
                }}
            >
                {props => {
                    const { isSubmitting, handleSubmit } = props;
                    return (
                        <form onSubmit={handleSubmit}>
                            <Button type="primary" disabled={isSubmitting} onClick={handleSubmit}>
                                Hrát
                            </Button>
                        </form>
                    );
                }}
            </Formik>
        );
    };

    const renderMyPosition = () => {
        if (geoFormSubmitted) {
            ReactGA.event({
                category: CATEGORIES.GEOLOCATION,
                action: 'Play geolocation city game',
            });
            return (
                <Redirect
                    to={{
                        pathname: '/geolokace',
                        state: {
                            radius: Number(geoFormValues.radius),
                            city: geoFormValues.city,
                            mode: 'geolocation',
                        },
                    }}
                />
            );
        }
        return geolocation.latitude && geolocation.longitude ? (
            <Formik
                initialValues={{ radius: 1, city: '' }}
                onSubmit={(values, { setSubmitting }) => {
                    values.radius = radiusGeolocationInputValue;
                    setGeoFormValues({
                        ...values,
                        city: {
                            coordinates: {
                                longitude: geolocation.longitude,
                                latitude: geolocation.latitude,
                            },
                        },
                    });
                    setGeoFormSubmitted(true);
                }}
                validationSchema={Yup.object().shape({
                    radius: Yup.number().required('Required'),
                })}
            >
                {props => {
                    const { isSubmitting, handleSubmit } = props;
                    return (
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="radius">
                                <Tooltip title={RADIUS_DESCRIPTION}>
                                    <span>Radius (km):</span>
                                </Tooltip>
                            </label>
                            <Row>
                                <Col span={12}>
                                    <Slider
                                        min={1}
                                        max={10}
                                        onChange={handleChangeGeolocationRadiusInput}
                                        value={
                                            typeof radiusGeolocationInputValue === 'number'
                                                ? radiusGeolocationInputValue
                                                : 0
                                        }
                                    />
                                </Col>
                                <Col span={4}>
                                    <InputNumber
                                        min={1}
                                        max={10}
                                        style={{ marginLeft: 16 }}
                                        value={radiusGeolocationInputValue}
                                        onChange={handleChangeGeolocationRadiusInput}
                                    />
                                </Col>
                            </Row>
                            <p style={{ marginTop: '10px' }}>
                                Panoramata budou náhodně generována v okolí
                                {' '}
                                {radiusGeolocationInputValue}
                                {' '}
                                km od vaší
                                aktuální polohy.
                            </p>
                            <Button type="primary" disabled={isSubmitting} onClick={handleSubmit}>
                                Hrát
                            </Button>
                        </form>
                    );
                }}
            </Formik>
        ) : (
            <p>Geografickou polohu se nepodařilo načíst.</p>
        );
    };

    const renderForm = () => {
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
                                                value={
                                                    typeof radiusCityInputValue === 'number' ? radiusCityInputValue : 0
                                                }
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

    return (
        <>
            <Card cover={<img alt="Herní mód - Krajská města ČR" src={pragueCover} />}>
                <h1>Krajská města ČR</h1>
                <p>
                    Bydlíš v některém z krajských sídel a znáš ho jako své boty? No tak se ukaž. Nebo se prostě jen tak
                    projdi po místech, která zase až tak dobře neznáš. Třeba objevíš zákoutí, kam tě to potáhne i
                    naživo.
                </p>
                {renderForm()}
            </Card>
            <Card cover={<img alt="Herní mód - Náhodné místo v Česku" src={randomCover} />}>
                <h1>Náhodné místo v Česku</h1>
                <p>
                    Známá města a místa pro tebe nejsou dostatečnou výzvou? Přenes se tedy do některé z
                    {' '}
                    <a href="https://github.com/33bcdd/souradnice-mest">6259 obcí ČR</a>
                    {' '}
                    a jejího bezprostředního okolí.
                    V každém kole na tebe čeká úplně jiné náhodné místo v naší republice. Tahle výzva je (nejen) pro
                    experty, co mají ČR projetou křížem krážem.
                </p>
                {playRandomCzechPlace()}
            </Card>
            <Card cover={<img alt="Herní mód - Podle mojí geolokace" src={geolocationCover} />}>
                <h1>Podle mojí geolokace</h1>
                <p>Zaměř svou polohu a ukaž, kdo je tady pánem a znalcem svého bezprostředního okolí!</p>
                {renderMyPosition()}
            </Card>
            <Card cover={<img alt="Herní mód - Zadat vlastní místo" src={suggestedCover} />}>
                <h1>Zadat vlastní místo</h1>
                <p>
                    Chceš si zahrát a nebydlíš přitom v krajském městě? Nevadí, přesně tohle je výzva pro tebe. Svou
                    obec či jiné zajímavé místo, které chceš více poznat, vyhledej ve formuláři níže. Šťastnou cestu!
                </p>
                <Suggest />
            </Card>
        </>
    );
};

export default Configuration;

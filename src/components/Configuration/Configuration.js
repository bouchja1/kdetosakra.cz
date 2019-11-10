import React, { useEffect, useState } from 'react';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import ReactGA from 'react-ga';
import { Input, Button } from 'antd';
import cryptoRandomString from 'crypto-random-string';
import { Redirect } from 'react-router-dom';
import useGeolocation from 'react-hook-geolocation';
import { writeStorage, useLocalStorage } from '@rehooks/local-storage';
import { cities } from '../../data/cities';
import { CATEGORIES } from '../../enums/gaCategories';
import Suggest from '../Suggest';
import HeaderContainer from '../pageStructure/HeaderContainer';

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

    useEffect(() => {
        if (!randomUserResultToken) {
            writeStorage('randomUserResultToken', cryptoRandomString({ length: 15 }));
        }
    }, [randomUserResultToken]);

    const createFormOptions = () => {
        let options = [];
        options.push(
            <option value="" key="empty">
                -- Vyber si město --
            </option>,
        );
        for (let i = 0; i < cities.length; i++) {
            options.push(
                <option key={cities[i].name} value={cities[i].name}>
                    {cities[i].fullName}
                </option>,
            );
        }
        return options;
    };

    const handleOnChangeCity = event => {
        const selectedValue = event.target.value;
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

    const playRandomCzechPlace = () => {
        if (randomCityFormSubmitted) {
            ReactGA.event({
                category: CATEGORIES.RANDOM_CITY,
                action: 'Play random city game',
            });
            return (
                <Redirect
                    to={{
                        pathname: '/nahodne',
                        state: {
                            radius: 0.5, // set default radius
                            city: null,
                            mode: 'random',
                        },
                    }}
                />
            );
        } else {
            return (
                <Formik
                    initialValues={{ radius: 1, city: '' }}
                    onSubmit={(values, { setSubmitting }) => {
                        setRandomCityFormSubmitted(true);
                    }}
                >
                    {props => {
                        const { values, isSubmitting, handleSubmit } = props;
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
        }
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
                    const { values, touched, errors, isSubmitting, handleChange, handleBlur, handleSubmit } = props;
                    return (
                        <form onSubmit={handleSubmit}>
                            <Input
                                name="radius"
                                placeholder="Zadej radius od své pozice"
                                type="number"
                                min="1"
                                max="10"
                                value={values.radius}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={errors.radius && touched.radius ? 'text-input error' : 'text-input'}
                            />
                            {errors.radius && touched.radius && <div className="input-feedback">{errors.radius}</div>}
                            <Button type="primary" disabled={isSubmitting} onClick={handleSubmit}>
                                Potvrdit
                            </Button>
                        </form>
                    );
                }}
            </Formik>
        ) : (
            <p>Geografickou polohu se nepodařilo načíst.</p>
        );
    };

    const renderCustomPlace = () => {
        return <Suggest />;
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
        } else {
            return (
                <Formik
                    initialValues={{ radius: 1, city: '' }}
                    onSubmit={(values, { setSubmitting }) => {
                        setCityFormValues(values);
                        setCityFormSubmitted(true);
                    }}
                    validationSchema={Yup.object().shape({
                        radius: Yup.number().required('Required'),
                        city: Yup.string().required('Required'),
                    })}
                >
                    {props => {
                        const { values, touched, errors, isSubmitting, handleChange, handleBlur, handleSubmit } = props;
                        return (
                            <form onSubmit={handleSubmit}>
                                <Field
                                    as="select"
                                    name="city"
                                    onChange={event => {
                                        handleOnChangeCity(event);
                                        values.city = event.target.value;
                                    }}
                                >
                                    {createFormOptions()}
                                </Field>
                                {errors.city && touched.city && <div className="input-feedback">{errors.color}</div>}
                                {citySelected ? (
                                    <Input
                                        name="radius"
                                        placeholder="Zadej radius od centra Prahy"
                                        type="number"
                                        min="1"
                                        max={maxCityRadius}
                                        value={values.radius}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={errors.radius && touched.radius ? 'text-input error' : 'text-input'}
                                    />
                                ) : null}
                                {errors.radius && touched.radius && (
                                    <div className="input-feedback">{errors.radius}</div>
                                )}
                                <Button type="primary" disabled={isSubmitting} onClick={handleSubmit}>
                                    Potvrdit
                                </Button>
                            </form>
                        );
                    }}
                </Formik>
            );
        }
    };

    return (
        <>
            <HeaderContainer />
            <div className="game-mode-container">
                <div className="game-modes-primary">
                    <div className="game-mode-item czech-cities">
                        <h1>Česká města</h1>
                        {renderForm()}
                    </div>
                    <div className="game-mode-item random-places">
                        <h1>Náhodné místo v Čr</h1>
                        {playRandomCzechPlace()}
                    </div>
                </div>
                <div className="game-modes-secondary">
                    <div className="game-mode-item">
                        <h1>Vlastní místo</h1>
                        {renderCustomPlace()}
                    </div>
                    <div className="game-mode-item">
                        <h1>Podle mojí pozice</h1>
                        {renderMyPosition()}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Configuration;

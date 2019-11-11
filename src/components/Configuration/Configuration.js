import React, { useEffect, useState } from 'react';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import ReactGA from 'react-ga';
import { Input, Button, Select, Card, Icon, Avatar, Layout } from 'antd';
import cryptoRandomString from 'crypto-random-string';
import { Redirect } from 'react-router-dom';
import useGeolocation from 'react-hook-geolocation';
import { writeStorage, useLocalStorage } from '@rehooks/local-storage';
import { cities } from '../../data/cities';
import { CATEGORIES } from '../../enums/gaCategories';
import Suggest from '../Suggest';
import { generateRandomRadius } from '../../util/Util';
import HeaderContainer from '../pageStructure/HeaderContainer';

const { Option } = Select;
const { Meta } = Card;
const { Content } = Layout;

const Configuration = function({ processHeaderContainerVisible }) {
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
        processHeaderContainerVisible(true);
    }, []);

    useEffect(() => {
        if (!randomUserResultToken) {
            writeStorage('randomUserResultToken', cryptoRandomString({ length: 15 }));
        }
    }, [randomUserResultToken]);

    const createFormOptions = () => {
        let options = [];
        for (let i = 0; i < cities.length; i++) {
            options.push(
                <Option key={cities[i].name} value={cities[i].name}>
                    {cities[i].fullName}
                </Option>,
            );
        }
        return options;
    };

    const handleOnChangeCity = value => {
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
                            <label htmlFor="radius">Radius: </label>
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
                                <label htmlFor="city">Město: </label>
                                <Select
                                    showSearch
                                    name="city"
                                    style={{ width: 200 }}
                                    placeholder="Vyber si město"
                                    onChange={value => {
                                        handleOnChangeCity(value);
                                        values.city = value;
                                    }}
                                >
                                    {createFormOptions()}
                                </Select>
                                {errors.city && touched.city && <div className="input-feedback">{errors.color}</div>}
                                {citySelected ? (
                                    <>
                                        <label htmlFor="radius">Radius: </label>
                                        <Input
                                            name="radius"
                                            placeholder="Zadej radius od centra Prahy"
                                            type="number"
                                            min="1"
                                            max={maxCityRadius}
                                            value={values.radius}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={
                                                errors.radius && touched.radius ? 'text-input error' : 'text-input'
                                            }
                                        />
                                    </>
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
            <Card
                cover={
                    <img
                        alt="Herní mód - Krajská města ČR"
                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    />
                }
            >
                <h1>Krajská města ČR</h1>
                <p>
                    Bydlíš v některém z krajských sídel a znáš ho jako své boty? Tak to prokaž! Nebo se prostě jen tak
                    projdi v místech, kde to zase až tak dobře neznáš.
                </p>
                {renderForm()}
            </Card>
            <Card
                cover={
                    <img
                        alt="Herní mód - Náhodné místo v Česku"
                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    />
                }
            >
                <h1>Náhodné místo v Česku</h1>
                <p>
                    Známá města a místa pro tebe nejsou dostatečnou výzvou? Přenes se tedy do některých z{' '}
                    <a href="https://github.com/33bcdd/souradnice-mest">6259 obcí ČR</a> a jejich bezprostředního okolí.
                    Tahle výzva je pro experty, co mají naši zemi o rozloze 78 864 km čtverečních projetou křížem
                    krážem.
                </p>
                {playRandomCzechPlace()}
            </Card>
            <Card
                cover={
                    <img
                        alt="Herní mód - Zadat vlastní místo"
                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    />
                }
            >
                <h1>Zadat vlastní místo</h1>
                <p>
                    Chceš si zahrát KdeToSakra a nebydlíš přitom v krajském městě? Nevadí, přesně tohle je výzva pro
                    tebe. Svou obec či jiné zajímavé místo vyhledáš níže a pak už jen lovíš body na mapě.
                </p>
                {renderCustomPlace()}
            </Card>
            <Card
                cover={
                    <img
                        alt="Herní mód - Podle mojí geolokace"
                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    />
                }
            >
                <h1>Podle mojí geolokace</h1>
                <p>
                    Nech se zaměřit dle své geolokace a ukaž, kdo je tady pánem a znalcem svého bezprostředního okolí!
                </p>
                {renderMyPosition()}
            </Card>
        </>
    );
};

export default Configuration;

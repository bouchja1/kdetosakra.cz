import React, {useState} from 'react';
import {Formik, Field} from 'formik';
import * as Yup from 'yup';
import {Redirect} from 'react-router-dom';
import useGeolocation from 'react-hook-geolocation'
import {cities} from '../../data/cities';
import {DisplayFormikState} from '../../util/helper';

const Configuration = function () {
    const geolocation = useGeolocation()
    const [citySelected, setCitySelected] = useState(null);
    const [maxCityRadius, setMaxCityRadius] = useState(null);
    const [randomCityFormSubmitted, setRandomCityFormSubmitted] = useState(false);
    const [cityFormSubmitted, setCityFormSubmitted] = useState(false);
    const [cityFormValues, setCityFormValues] = useState({});
    const [geoFormSubmitted, setGeoFormSubmitted] = useState(false);
    const [geoFormValues, setGeoFormValues] = useState({});

    const createFormOptions = () => {
        let options = [];
        options.push(<option value="" key="empty">-- Vyber si město --</option>)
        for (let i = 0; i < cities.length; i++) {
            options.push(<option key={cities[i].name} value={cities[i].name}>{cities[i].fullName}</option>)
        }
        return options;
    };

    const handleOnChangeCity = (event) => {
        const selectedValue = event.target.value;
        if (selectedValue === '-- Vyber si město --') {
            setCitySelected(null);
        } else {
            const selectedCity = cities.filter(city => {
                return city.name === selectedValue
            });
            setMaxCityRadius(selectedCity[0].radiusMax);
            setCitySelected(selectedCity[0].name);
        }
    };

    const playRandomCzechPlace = () => {
        if (randomCityFormSubmitted) {
            return (
                <Redirect
                    to={{
                        pathname: '/random-city',
                        state: {
                            radius: 0.5, // set default radius
                            mode: 'random',
                        }
                    }}
                />
            )
        } else {
            return (
                <form className="container" onSubmit={() => setRandomCityFormSubmitted(true)}>
                    <button type="submit">
                        Hrát
                    </button>
                </form>
            );
        }
    };

    const renderMyPosition = () => {
        if (geoFormSubmitted) {
            return (
                <Redirect
                    to={{
                        pathname: '/geolocation',
                        state: {
                            radius: Number(geoFormValues.radius),
                            city: geoFormValues.city,
                            mode: 'geolocation',
                        }
                    }}
                />
            );
        } else return (geolocation.latitude && geolocation.longitude)
            ? (
                <Formik
                    initialValues={{ radius: 1, city: '' }}
                    onSubmit={(values, { setSubmitting }) => {
                        setGeoFormValues({
                            ...values,
                            city: {
                                coordinates: {
                                    longitude: geolocation.longitude,
                                    latitude: geolocation.latitude,
                                }
                            }
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
                                <input
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
                                {errors.radius && touched.radius &&
                                <div className="input-feedback">{errors.radius}</div>}
                                <button type="submit" disabled={isSubmitting}>
                                    Potvrdit
                                </button>
                                <DisplayFormikState {...props} />
                            </form>
                        );
                    }}
                </Formik>
            )
            : (
                <p>No geolocation, sorry.</p>
            )
    };

    const renderForm = () => {
        if (cityFormSubmitted) {
            const selectedCity = cities.filter(city => {
                return city.name === cityFormValues.city;
            });
            return (
                <Redirect
                    to={{
                        pathname: '/city',
                        state: {
                            radius: Number(cityFormValues.radius),
                            city: selectedCity[0],
                            mode: 'city',
                        },
                    }}
                />
            );
        } else {
            return (<Formik
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
                            <Field as="select"
                                   name="city"
                                   onChange={(event) => {
                                       handleOnChangeCity(event)
                                       values.city = event.target.value
                                   }}>
                                {createFormOptions()}
                            </Field>
                            {errors.city &&
                            touched.city &&
                            <div className="input-feedback">
                                {errors.color}
                            </div>}
                            {
                                (citySelected) ?
                                    <input
                                        name="radius"
                                        placeholder="Zadej radius od centra Prahy"
                                        type="number"
                                        min="1"
                                        max={maxCityRadius}
                                        value={values.radius}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={errors.radius && touched.radius ? 'text-input error' : 'text-input'}
                                    /> : null
                            }
                            {errors.radius && touched.radius && <div className="input-feedback">{errors.radius}</div>}
                            <button type="submit" disabled={isSubmitting}>
                                Potvrdit
                            </button>
                            <DisplayFormikState {...props} />
                        </form>
                    );
                }}
            </Formik>);
        }
    };

    return (
        <div>
            <h1>Náhodné místo v Čr</h1>
            {playRandomCzechPlace()}
            <h1>Česká města</h1>
            {renderForm()}
            <h1>Podle mojí pozice</h1>
            {renderMyPosition()}
        </div>
    );
};

export default Configuration;

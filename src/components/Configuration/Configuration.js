import React, {useContext, useState} from 'react';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { Redirect } from 'react-router-dom';
import { cities } from '../../data/cities';
import { DisplayFormikState } from '../../util/helper';

const Configuration = function() {
    const [citySelected, setCitySelected] = useState(null);
    const [maxCityRadius, setMaxCityRadius] = useState(null);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formValues, setFormValues] = useState({});

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

    const renderForm = () => {
        if (formSubmitted) {
            const selectedCity = cities.filter(city => {
                return city.name === formValues.city;
            });
            return (
                <Redirect
                    to={{
                        pathname: '/panorama',
                        state: {
                            radius: Number(formValues.radius),
                            city: selectedCity[0],
                        },
                    }}
                />
            );
        } else {
            return (<Formik
                initialValues={{ radius: 1, city: '' }}
                onSubmit={(values, { setSubmitting }) => {
                    setFormValues(values);
                    setFormSubmitted(true);
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

    return <div>{renderForm()}</div>;
};

export default Configuration;

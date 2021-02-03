import React, { useState } from 'react';
import ReactGA from 'react-ga';
import { Redirect } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import useGeolocation from 'react-hook-geolocation';
import {
    Button, Col, InputNumber, Row, Slider, Tooltip
} from 'antd';

import { CATEGORIES } from '../../enums/gaCategories';
import { RADIUS_DESCRIPTION } from '../../util';

export const Geolocation = () => {
    const geolocation = useGeolocation();
    const [geoFormSubmitted, setGeoFormSubmitted] = useState(false);
    const [geoFormValues, setGeoFormValues] = useState({});
    const [radiusGeolocationInputValue, setRadiusGeolocationInputValue] = useState(1);

    const handleChangeGeolocationRadiusInput = value => {
        setRadiusGeolocationInputValue(value);
    };

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

    // browser is allowed to access user's LAT and LONG
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

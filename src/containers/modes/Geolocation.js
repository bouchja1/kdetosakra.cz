import React, { useState } from 'react';
import ReactGA from 'react-ga';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import useGeolocation from 'react-hook-geolocation';
import {
    Button, Col, InputNumber, Row, Slider, Tooltip
} from 'antd';

import { CATEGORIES } from '../../enums/gaCategories';
import { RADIUS_DESCRIPTION } from '../../util';
import gameModes from '../../enums/modes';

export const Geolocation = () => {
    const geolocationData = useGeolocation();
    const [radius, setRadius] = useState(1);

    const handleChangeRadius = value => {
        setRadius(value);
    };

    // browser is allowed to access user's LAT and LONG
    return geolocationData?.latitude && geolocationData?.longitude ? (
        <Formik
            initialValues={{ radius: 1 }}
            onSubmit={(values, { setSubmitting }) => {
                ReactGA.event({
                    category: CATEGORIES.GEOLOCATION,
                    action: 'Play geolocation city game',
                });
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
                                    onChange={handleChangeRadius}
                                    value={typeof radius === 'number' ? radius : 0}
                                />
                            </Col>
                            <Col span={4}>
                                <InputNumber
                                    min={1}
                                    max={10}
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
                            km od vaší aktuální polohy.
                        </p>
                        <Button type="primary" disabled={isSubmitting} onClick={handleSubmit}>
                            <Link
                                to={{
                                    pathname: '/geolokace',
                                    state: {
                                        radius: Number(radius),
                                        city: {
                                            coordinates: {
                                                longitude: geolocationData.longitude,
                                                latitude: geolocationData.latitude,
                                            },
                                        },
                                        mode: gameModes.geolocation,
                                    },
                                }}
                            >
                                Hrát
                            </Link>
                        </Button>
                    </form>
                );
            }}
        </Formik>
    ) : (
        <p>Geografickou polohu se nepodařilo načíst.</p>
    );
};

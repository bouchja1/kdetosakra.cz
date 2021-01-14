import React, { useState } from 'react';
import ReactGA from 'react-ga';
import { Redirect } from 'react-router-dom';
import { Formik } from 'formik';
import { Button } from 'antd';
import { CATEGORIES } from '../../../enums/gaCategories';
import { generateRandomRadius } from '../../../util';

const RandomCity = () => {
    const [randomCityFormSubmitted, setRandomCityFormSubmitted] = useState(false);

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

export default RandomCity;

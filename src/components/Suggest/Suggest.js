import React, { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Formik } from 'formik';
import ReactGA from 'react-ga';
import * as Yup from 'yup';
import MapyContext from '../../context/MapyContext';
import { CATEGORIES } from '../../enums/gaCategories';

const Suggest = () => {
    const [suggestInput] = useState(React.createRef());
    const mapyContext = useContext(MapyContext);
    const [mapyContextApiLoaded, setMapyContextApiLoaded] = useState(false);
    const [submittedSuggestedData, setSubmittedSuggestedData] = useState(null);
    const [playSuggested, setPlaySuggested] = useState(false);

    const useInitSuggest = () => {
        if (mapyContextApiLoaded) {
            const suggest = new mapyContext.SMap.Suggest(suggestInput.current);
            suggest.urlParams({
                // omezeni pro celou CR
                bounds: '48.5370786,12.0921668|51.0746358,18.8927040',
            });
            suggest
                .addListener('suggest', function(suggestedData) {
                    setSubmittedSuggestedData(suggestedData);
                })
                .addListener('close', function() {});
        }
    };

    useInitSuggest();

    useEffect(() => {
        setMapyContextApiLoaded(mapyContext.loadedMapApi);
    }, [mapyContext.loadedMapApi]);

    if (playSuggested) {
        ReactGA.event({
            category: CATEGORIES.SUGGESTED,
            action: 'Play suggested city game',
        });
        return (
            <Redirect
                to={{
                    pathname: '/vlastni',
                    state: {
                        radius: 1,
                        city: {
                            coordinates: {
                                latitude: submittedSuggestedData.data.latitude,
                                longitude: submittedSuggestedData.data.longitude,
                            },
                            place: submittedSuggestedData.data.title,
                            info: submittedSuggestedData.data.secondRow,
                        },
                    },
                }}
            />
        );
    } else {
        return (
            <>
                <Formik
                    initialValues={{ radius: 1, city: '' }}
                    onSubmit={(values, { setSubmitting }) => {
                        setPlaySuggested(true);
                    }}
                    validationSchema={Yup.object().shape({
                        radius: Yup.number().required('Required'),
                    })}
                >
                    {props => {
                        const { values, touched, errors, handleChange, handleBlur, handleSubmit } = props;
                        return (
                            <form onSubmit={handleSubmit}>
                                <input type="text" placeholder="hledaná fráze" ref={suggestInput} />
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
                                {errors.radius && touched.radius && (
                                    <div className="input-feedback">{errors.radius}</div>
                                )}
                                <button disabled={!submittedSuggestedData} type="submit">
                                    Hrát
                                </button>
                            </form>
                        );
                    }}
                </Formik>
            </>
        );
    }
};

export default Suggest;

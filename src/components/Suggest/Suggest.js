import React, { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Formik } from 'formik';
import ReactGA from 'react-ga';
import { Input, Button, Row, Col, Slider, InputNumber, Tooltip } from 'antd';
import * as Yup from 'yup';
import MapyContext from '../../context/MapyContext';
import { CATEGORIES } from '../../enums/gaCategories';
import { RADIUS_DESCRIPTION } from '../../util/Util';

const Suggest = () => {
    const [suggestInput] = useState(React.createRef());
    const mapyContext = useContext(MapyContext);
    const [mapyContextApiLoaded, setMapyContextApiLoaded] = useState(false);
    const [submittedSuggestedData, setSubmittedSuggestedData] = useState(null);
    const [playSuggested, setPlaySuggested] = useState(false);
    const [radiusCustomInputValue, setRadiusCustomInputValue] = useState(1);

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

    const onChangeGeolocationRadiusInput = value => {
        setRadiusCustomInputValue(value);
    };

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
                        mode: 'suggested',
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
                        values.radius = radiusCustomInputValue;
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
                                <label htmlFor="place">Místo, které chceš zkoumat: </label>
                                <input
                                    name="place"
                                    type="text"
                                    className="ant-input text-input"
                                    placeholder="hledaná fráze"
                                    ref={suggestInput}
                                />
                                <label htmlFor="radius">
                                    <Tooltip title={RADIUS_DESCRIPTION}>
                                        <span>Radius:</span>
                                    </Tooltip>
                                </label>
                                <Row>
                                    <Col span={12}>
                                        <Slider
                                            min={1}
                                            max={10}
                                            onChange={onChangeGeolocationRadiusInput}
                                            value={
                                                typeof radiusCustomInputValue === 'number' ? radiusCustomInputValue : 0
                                            }
                                        />
                                    </Col>
                                    <Col span={4}>
                                        <InputNumber
                                            min={1}
                                            max={10}
                                            style={{ marginLeft: 16 }}
                                            value={radiusCustomInputValue}
                                            onChange={onChangeGeolocationRadiusInput}
                                        />
                                    </Col>
                                </Row>
                                <Button disabled={!submittedSuggestedData} type="primary" onClick={handleSubmit}>
                                    Hrát
                                </Button>
                            </form>
                        );
                    }}
                </Formik>
            </>
        );
    }
};

export default Suggest;

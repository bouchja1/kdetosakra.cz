import React, {
    useContext, useEffect, useRef, useState
} from 'react';
import { Redirect } from 'react-router-dom';
import ReactGA from 'react-ga';
import {
    Button, Row, Col, Slider, InputNumber, Tooltip
} from 'antd';
import KdetosakraContext from '../../context/KdetosakraContext';
import { CATEGORIES } from '../../enums/gaCategories';
import { RADIUS_DESCRIPTION } from '../../util';

export const CustomPlace = () => {
    const mapyContext = useContext(KdetosakraContext);
    const suggestInput = useRef();
    const [selectedPlaceData, setSelectedPlaceData] = useState(null);
    const [playGame, setPlayGame] = useState(false);
    const [radius, setRadius] = useState(1);

    useEffect(() => {
        if (mapyContext.loadedMapApi) {
            const suggest = new mapyContext.SMap.Suggest(suggestInput.current);
            suggest.urlParams({
                // omezeni pro celou CR
                bounds: '48.5370786,12.0921668|51.0746358,18.8927040',
            });
            suggest
                .addListener('suggest', suggestedData => {
                    setSelectedPlaceData(suggestedData);
                })
                .addListener('close', () => {});
        }
    }, [mapyContext]);

    const handleChangeRadius = value => {
        setRadius(value);
    };

    if (playGame) {
        ReactGA.event({
            category: CATEGORIES.SUGGESTED,
            action: 'Play suggested city game',
        });
        return (
            <Redirect
                to={{
                    pathname: '/vlastni',
                    state: {
                        radius: Number(radius),
                        city: {
                            coordinates: {
                                latitude: selectedPlaceData.data.latitude,
                                longitude: selectedPlaceData.data.longitude,
                            },
                            place: selectedPlaceData.data.title,
                            info: selectedPlaceData.data.secondRow,
                        },
                        mode: 'suggested',
                    },
                }}
            />
        );
    }

    return (
        <form>
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
                km od vámi vybraného místa.
            </p>
            <Button disabled={!selectedPlaceData} type="primary" onClick={() => setPlayGame(true)}>
                Hrát
            </Button>
        </form>
    );
};

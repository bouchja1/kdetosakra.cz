import React, { useContext, useRef } from 'react';

import { DEFAUL_MARKER_ICON } from '../../constants/icons';
import MapyCzContext from '../../context/MapyCzContext';
import { ResultSMapWrapper } from '../SMap/ResultSMapWrapper';
import { RoundSMapWrapper } from '../SMap/RoundSMapWrapper';

const GuessingMap = ({
    currentRoundGuessedPoint,
    isBattle = false,
    refLayerValue,
    roundGuessed,
    refVectorLayerSMapValue,
    saveCurrentClickedMapPointCoordinates,
}) => {
    const mapyContext = useContext(MapyCzContext);
    const refLayeredMapValue = useRef();

    const clickMapPoint = (e, elm) => {
        // Došlo ke kliknutí, spočítáme kde
        const options = {
            url: DEFAUL_MARKER_ICON,
            anchor: { left: 10, bottom: 1 } /* Ukotvení značky za bod uprostřed dole */,
        };
        // FYI state is not working in event handling
        refLayerValue.current.removeAll();
        const coords = mapyContext.SMap.Coords.fromEvent(e.data.event, refLayeredMapValue.current);
        const marker = new mapyContext.SMap.Marker(
            mapyContext.SMap.Coords.fromWGS84(coords.x, coords.y),
            'Můj odhad',
            options,
        );
        refLayerValue.current.addMarker(marker);
        saveCurrentClickedMapPointCoordinates({
            mapLat: coords.y,
            mapLon: coords.x,
        });
    };

    return (
        <>
            {!roundGuessed ? (
                <RoundSMapWrapper
                    onMapClick={clickMapPoint}
                    refLayeredMapValue={refLayeredMapValue}
                    refLayerValue={refLayerValue}
                    refVectorLayerSMapValue={refVectorLayerSMapValue}
                    isBattle={isBattle}
                    currentRoundGuessedPoint={currentRoundGuessedPoint}
                />
            ) : (
                <>
                    {currentRoundGuessedPoint ? (
                        <ResultSMapWrapper currentRoundGuessedPoint={currentRoundGuessedPoint} isBattle={isBattle} />
                    ) : null}
                </>
            )}
        </>
    );
};

export default GuessingMap;

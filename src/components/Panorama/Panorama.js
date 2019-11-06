import React, {useState, useEffect, useContext} from 'react';
import MapyContext from '../../context/MapyContext'
import GuessingMap from "../GuessingMap";

const Panorama = function({loadedMapApi}) {

    const [panorama] = useState(React.createRef());
    const [panoramaScene, setPanoramaScene] = useState(null);
    const mapyContext = useContext(MapyContext);

    const loadPanoramaMap = () => {
        const options = {
            nav: true,
            blend: 300,
            pitchRange: [0, 0], // zakazeme vertikalni rozhled
        };
        const SMap = mapyContext.SMap;

        if (SMap) {
            const SMap = mapyContext.SMap;
            const panoramaSceneSMap = new SMap.Pano.Scene(panorama.current, options);
            // kolem teto pozice chceme nejblizsi panorama
            var position = SMap.Coords.fromWGS84(14.4297652, 50.0753929);
            // hledame s toleranci 50m
            SMap.Pano.getBest(position, 50).then(
                function (place) {
                    panoramaSceneSMap.show(place);
                    setPanoramaScene(panoramaSceneSMap);
                },
                function () {
                    alert('GuessingMap se nepodařilo zobrazit!');
                },
            );
        }
    }

    const calculateDistance = (mapCoordinates) => {
        const panoramaCoordinates = panoramaScene._place._data.mark;
        let distance;
        if ((panoramaCoordinates.lat === mapCoordinates.mapLat) && (panoramaCoordinates.lon === mapCoordinates.mapLon)) {
            distance = 0;
        }
        else {
            const radlat1 = Math.PI * panoramaCoordinates.lat / 180;
            const radlat2 = Math.PI * mapCoordinates.mapLat / 180;
            const theta = panoramaCoordinates.lon - mapCoordinates.mapLon;
            const radtheta = Math.PI * theta / 180;
            let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515;
            dist = dist * 1.609344; // convert to kilometers
            distance = dist;
        }
        return {
            distance,
            panoramaCoordinates,
        }
    };

    const renderGuessingMap = () => {
        if (panoramaScene) {
            return <GuessingMap calculateDistance={calculateDistance}/>
        }
        return <p>Načítám panorama...</p>
    }

    useEffect(() => {
        if (loadedMapApi) {
            loadPanoramaMap();
        }
    }, [loadedMapApi]);

    return (
        <div>
            <div ref={panorama}></div>
            {renderGuessingMap()}
        </div>
    );
};

export default Panorama;

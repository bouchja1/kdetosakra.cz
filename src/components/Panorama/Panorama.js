import React, {useState, useEffect, useContext} from 'react';
import { Redirect, useLocation, Link } from 'react-router-dom';
import MapyContext from '../../context/MapyContext'
import GuessingMap from "../GuessingMap";
import { pointInCircle } from '../../util/Util';
import { cities } from '../../data/cities';

const Panorama = function() {
    const location = useLocation();

    const [panorama] = useState(React.createRef());
    const [panoramaScene, setPanoramaScene] = useState(null);
    const mapyContext = useContext(MapyContext);

    const generatePlaceInRadius = (radius, locationCity) => {
        radius = radius * 1000; // to kilometres
        const generatedPlace = pointInCircle({
            longitude: locationCity.coordinates.longitude,
            latitude: locationCity.coordinates.latitude,
        }, radius)
        return generatedPlace;
    };

    const loadPanoramaMap = (radius, locationCity, rerender = false) => {
        if (rerender) {
            while (panorama.current.firstChild) {
                panorama.current.firstChild.remove();
            }
        }
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
            const generatedPanoramaPlace = generatePlaceInRadius(radius, locationCity);
            const position = SMap.Coords.fromWGS84(generatedPanoramaPlace.longitude, generatedPanoramaPlace.latitude);
            // hledame s toleranci 50m
            SMap.Pano.getBest(position, 2000).then(
                function (place) {
                    panoramaSceneSMap.show(place);
                    setPanoramaScene(panoramaSceneSMap);
                },
                function () {
                    alert('GuessingMap se nepodařilo zobrazit!');
                },
            );
        }
    };

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
            return <GuessingMap calculateDistance={calculateDistance} loadPanoramaMap={loadPanoramaMap}/>
        }
        return <p>Načítám mapu...</p>
    };

    useEffect(() => {
        if (location && location.state && location.state.radius && location.state.city) {
            const locationRadius = location.state.radius;
            const locationCity = location.state.city;
            if (mapyContext.loadedMapApi) {
                loadPanoramaMap(locationRadius, locationCity);
            }
        }
    }, [mapyContext.loadedMapApi]);

    if (location && location.state && location.state.radius && location.state.city) {
        return (
            <div>
                <h2>Herní mód</h2>
                <h3>Místo: {location.state.city.fullName}</h3>
                <h3>Maximální vzdálenost od centra: {location.state.radius} km</h3>
                <Link to="/">Zpět do výběru herního módu</Link>
                <div ref={panorama}></div>
                {renderGuessingMap()}
            </div>
        );
    } else {
        return <Redirect
            to={{
                pathname: '/',
            }}
        />
    }
};

export default Panorama;

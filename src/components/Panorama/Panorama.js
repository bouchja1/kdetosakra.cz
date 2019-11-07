import React, {useState, useEffect, useContext} from 'react';
import MapyContext from '../../context/MapyContext'
import GuessingMap from "../GuessingMap";
import {pointInCircle} from '../../util/Util';
import {crCities} from "../../data/cr";

const Panorama = function ({location}) {
    const [panorama] = useState(React.createRef());
    const [panoramaScene, setPanoramaScene] = useState(null);
    const [currentCity, setCurrentCity] = useState(null);
    const mapyContext = useContext(MapyContext);

    const generateRandomCzechPlace = () => {
        let randomCity = crCities[Math.floor(Math.random() * crCities.length)];
        randomCity = {
            ...randomCity,
            coordinates: {
                latitude: randomCity.latitude,
                longitude: randomCity.longitude,
            }
        };
        setCurrentCity(randomCity);
        return randomCity;
    };

    const generatePlaceInRadius = (radius, locationCity) => {
        radius = radius * 1000; // to kilometres
        const generatedPlace = pointInCircle({
            longitude: locationCity.coordinates.longitude,
            latitude: locationCity.coordinates.latitude,
        }, radius)
        return generatedPlace;
    };

    const loadPanoramaMap = (radius, locationCity, rerender = false) => {
        console.log("NNNNNNNN")
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
            SMap.Pano.getBest(position, 50).then(
                function (place) {
                    panoramaSceneSMap.show(place);
                    setPanoramaScene(panoramaSceneSMap);
                },
                function () {
                    // alert('GuessingMap se nepodařilo zobrazit!');
                    loadPanoramaMap(radius, locationCity, true)
                },
            );
        }
    };

    const calculateDistance = (mapCoordinates) => {
        const locationObject = location.state;
        let city = location.state.city;
        if (!city) {
            city = currentCity;
        }
        const panoramaCoordinates = panoramaScene._place._data.mark;
        let distance;
        if ((panoramaCoordinates.lat === mapCoordinates.mapLat) && (panoramaCoordinates.lon === mapCoordinates.mapLon)) {
            distance = 0;
        } else {
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

        let objectToReturn = {
            distance,
            panoramaCoordinates,
        };
        if (locationObject.mode === 'random') {
            objectToReturn = {
                ...objectToReturn,
                randomCity: city,
            }
        }
        return objectToReturn;
    };

    const renderGuessingMap = () => {
        if (panoramaScene) {
            return <GuessingMap calculateDistance={calculateDistance} loadPanoramaMap={loadPanoramaMap} generateRandomCzechPlace={generateRandomCzechPlace}/>
        }
        return <p>Načítám mapu...</p>
    };

    useEffect(() => {
        if (location) {
            let { radius, city, mode } = location.state;
            if (mode === 'random') {
                city = generateRandomCzechPlace();
            }
            if (mapyContext.loadedMapApi) {
                loadPanoramaMap(radius, city);
            }
        }
        // TODO add some cleanup maybe
    }, [mapyContext.loadedMapApi]);

    return (
        <div>
            <div ref={panorama}></div>
            {renderGuessingMap()}
        </div>
    );
};

export default Panorama;

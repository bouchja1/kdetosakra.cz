import React, {useState, useEffect, useContext} from 'react';
import MapyContext from '../../context/MapyContext'
import GuessingMap from "../GuessingMap";

const Panorama = function({loadedMapApi}) {

    const [panorama] = useState(React.createRef());
    const [panoramaScene, setPanoramaScene] = useState(null);
    const mapyContext = useContext(MapyContext);

    const panoramaSceneFce = () => {
        if (panoramaScene && panoramaScene._place) {
            console.log("PANORAMA GPS: ", panoramaScene._place._data.mark)
        }
    }

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
                    console.log("PLAAAACE LAT: ", panoramaSceneSMap.getPlace()._data.mark.lat);
                    console.log("PLAAAACE LON: ", panoramaSceneSMap.getPlace()._data.mark.lon);
                    // TODO tohle se mi nepohybuje
                    setCoordinates({
                        panoramaLat: panoramaSceneSMap.getPlace()._data.mark.lat,
                        panoramaLon: panoramaSceneSMap.getPlace()._data.mark.lon,
                    })
                    setPanoramaScene(panoramaSceneSMap);
                },
                function () {
                    alert('GuessingMap se nepodařilo zobrazit!');
                },
            );
        }
    }

    const [coordinates, setCoordinates] = useState({
        panoramaLon: 0,
        panoramaLat: 0,
    });

    const renderGuessingMap = () => {
        if (panoramaScene) {
            return <GuessingMap panoramaCoordinates={coordinates}/>
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
            <p>{console.log(panoramaSceneFce())}</p>
            {renderGuessingMap()}
        </div>
    );
};

export default Panorama;

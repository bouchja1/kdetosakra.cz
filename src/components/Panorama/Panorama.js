import React, {useState, useEffect, useContext} from 'react';
import MapyContext from '../../context/MapyContext'
import GuessingMap from "../GuessingMap";

const Panorama = () => {
    const [panorama, setPanorama] = useState(React.createRef());
    const mapyContext = useContext(MapyContext)
    const [loadedPanorama, setLoadedPanorama] = useState(false);

    const [coordinates, setCoordinates] = useState({
        panoramaLon: 0,
        panoramaLat: 0,
    });

    useEffect(() => {
        if (mapyContext && !loadedPanorama) {
            const options = {
                nav: true,
                blend: 300,
                pitchRange: [0, 0], // zakazeme vertikalni rozhled
            };

            const SMap = window.SMap;
            const panoramaScene = new SMap.Pano.Scene(panorama.current, options);
            // kolem teto pozice chceme nejblizsi panorama
            var position = SMap.Coords.fromWGS84(14.4297652, 50.0753929);
            // hledame s toleranci 50m
            SMap.Pano.getBest(position, 50).then(
                function (place) {
                    setLoadedPanorama(true);
                    panoramaScene.show(place);
                    console.log("PLAAAACE LAT: ", panoramaScene.getPlace()._data.mark.lat);
                    console.log("PLAAAACE LON: ", panoramaScene.getPlace()._data.mark.lon);
                    // TODO tohle se mi nepohybuje
                    setCoordinates({
                        panoramaLat: panoramaScene.getPlace()._data.mark.lat,
                        panoramaLon: panoramaScene.getPlace()._data.mark.lon,
                    })
                },
                function () {
                    alert('GuessingMap se nepodařilo zobrazit!');
                },
            );
        }
    }, [mapyContext, coordinates, loadedPanorama, panorama]);

    return (
        <div>
            <div ref={panorama}></div>
            <GuessingMap panoramaCoordinates={coordinates}/>
        </div>
    );
};

export default Panorama;

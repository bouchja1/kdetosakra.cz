import React, {useState, useEffect, useContext} from 'react';
import MapyContext from '../../context/MapyContext'

const Panorama = () => {
    const [panorama, setPanorama] = useState(React.createRef());
    const mapyContext = useContext(MapyContext)
    const [loadedPanorama, setLoadedPanorama] = useState(false);

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
                },
                function () {
                    alert('GuessingMap se nepodařilo zobrazit!');
                },
            );
        }
    }, [mapyContext, loadedPanorama, panorama]);

    return (
        <div>
            <div ref={panorama}></div>
        </div>
    );
};

export default Panorama;

import React, {useState, useEffect} from 'react';

const Panorama = () => {
    // const [loaded, error, SMap] = useLoader();
    const [panorama, setPanorama] = useState(React.createRef());
    const [loadedMapApi, setLoadedMapApi] = useState(false);
    const [loadedPanorama, setLoadedPanorama] = useState(false);

    useEffect(() => {
        window.Loader.async = true;
        window.Loader.load(null, { pano: true }, () => {
            setLoadedMapApi(true);
        });
    }, [loadedMapApi]);

    useEffect(() => {
        if (loadedMapApi && !loadedPanorama) {
            const options = {
                nav: false, // skryjeme navigaci
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
                    alert('Panorama se nepodařilo zobrazit!');
                },
            );
        }
    }, [loadedMapApi, loadedPanorama, panorama]);

    return (
        <div>
            <div ref={panorama}></div>
        </div>
    );
};

export default Panorama;

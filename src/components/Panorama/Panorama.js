import React, {useState, useEffect} from 'react';

const Panorama = (props) => {

    console.log("******: ", props)

    const [panorama, setPanorama] = useState(React.createRef());

    useEffect(() => {
        console.log("AAAAAAAAAA")
        // loadPanorama()
    });

    /*
    const loadPanorama = () => {
        const options = {
            nav: false, // skryjeme navigaci
            pitchRange: [0, 0], // zakazeme vertikalni rozhled
        };

        const panoramaScene = new SMap.Pano.Scene(panorama.current, options);
        // kolem teto pozice chceme nejblizsi panorama
        var position = SMap.Coords.fromWGS84(14.4297652, 50.0753929);

        // hledame s toleranci 50m
        SMap.Pano.getBest(position, 50).then(
            function(place) {
                panoramaScene.show(place);
            },
            function() {
                alert('Panorama se nepodařilo zobrazit!');
            },
        );
    };
     */

    return (
        <div>
            <h1>NADPIS</h1>
            <div className="panorama" ref={panorama}></div>
        </div>
    )
};

export default Panorama;

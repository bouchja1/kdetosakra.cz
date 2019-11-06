import { useState, useEffect } from 'react';

const useMapLoader = function(loaded) {
    const [mapLoader, setMapLoader] = useState({
        loadedMapApi: false,
        SMap: null,
        JAK: null,
    });

    useEffect(() => {
        if (loaded) {
            window.Loader.async = true;
            window.Loader.load(null, { pano: true }, () => {
                setMapLoader({
                    loadedMapApi: true,
                    SMap: window.SMap,
                    JAK: window.JAK,
                });
            });
        }
    }, [loaded]);

    return [mapLoader];
};

export default useMapLoader;

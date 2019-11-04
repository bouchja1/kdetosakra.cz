import { useState, useEffect } from 'react';

const useMapLoader = (loaded) => {
    const [loadedMapApi, setLoadedMapApi] = useState(false);

    console.log("LOOOADED: ", loaded)

    useEffect(() => {
        if (loaded) {
            console.log("NOOOO: fsdkjskjkj")
            window.Loader.async = true;
            window.Loader.load(null, { pano: true }, () => {
                setLoadedMapApi(true);
            });
        }
    }, [loaded, loadedMapApi]);

    return [loadedMapApi];
};

export default useMapLoader;

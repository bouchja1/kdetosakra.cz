import { useState, useEffect } from 'react';

export default function useSMapResize() {
    const [height, setHeight] = useState(window.innerHeight);
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        setHeight(window.innerHeight);
        setWidth(window.innerWidth);
    }, [window.innerHeight, window.innerWidth]);

    return {
        height,
        width,
    };
}

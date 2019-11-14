import { useState, useEffect } from 'react';

export default function useWindowHeight() {
    const [height] = useState(window.innerHeight);
    const [width] = useState(window.innerWidth);

    useEffect(() => {
        /*
        const menuContainerElement = window.document.getElementById('smap-container');
        const smapElement = window.document.getElementById('smap');
        menuContainerElement.style.width = `${width / 3}px`;
        smapElement.style.height = `${height / 2}px`;
        return () => {};
         */
    }, []);

    return {
        height,
        width,
    };
}

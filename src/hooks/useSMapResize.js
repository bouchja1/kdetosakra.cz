import { useState, useEffect } from 'react';

export default function useWindowHeight() {
    const [height, setHeight] = useState(window.innerHeight);
    const [width, setWidth] = useState(window.innerWidth);

    return {
        height,
        width,
    };
}

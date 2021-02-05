import { useState, useEffect } from 'react';

export default function useWindowHeight() {
    const [height, setHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => setHeight(window.innerHeight);
        window.addEventListener('resize', handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return height;
}

import { useRef } from 'react';

const useTimeInterval = onTick => {
    const intervalRef = useRef();

    const startInterval = () => {
        if (!intervalRef.current) {
            intervalRef.current = setInterval(() => {
                onTick();
            }, 1000);
        }
    };

    const stopInterval = () => {
        if (intervalRef && intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    return {
        startInterval,
        stopInterval,
    };
};

export default useTimeInterval;

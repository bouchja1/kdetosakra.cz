import { useEffect } from 'react';
import { useLocalStorage, writeStorage } from '@rehooks/local-storage';
import cryptoRandomString from 'crypto-random-string';

const useGetRandomUserToken = () => {
    const [randomUserResultToken] = useLocalStorage('randomUserResultToken'); // send the key to be tracked

    useEffect(() => {
        if (!randomUserResultToken) {
            writeStorage('randomUserResultToken', cryptoRandomString({ length: 15 }));
        }
    }, [randomUserResultToken]);

    return randomUserResultToken;
};

export default useGetRandomUserToken;

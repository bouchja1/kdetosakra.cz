import React, { useState, useEffect } from 'react';
import moment from 'moment';

import packageJson from '../package.json';

const buildDateGreaterThan = (latestDate, currentDate) => {
    const momLatestDateTime = moment(latestDate);
    const momCurrentDateTime = moment(currentDate);

    if (momLatestDateTime.isAfter(momCurrentDateTime)) {
        return true;
    }
    return false;
};

function withClearCache(Component) {
    function ClearCacheComponent(props) {
        const [isLatestBuildDate, setIsLatestBuildDate] = useState(false);

        useEffect(() => {
            fetch('/meta.json')
                .then(response => response.json())
                .then(meta => {
                    const latestVersionDate = meta.buildDate;
                    const currentVersionDate = packageJson.buildDate;

                    const shouldForceRefresh = buildDateGreaterThan(latestVersionDate, currentVersionDate);
                    if (!shouldForceRefresh) {
                        setIsLatestBuildDate(true);
                        return false;
                    }
                    setIsLatestBuildDate(false);

                    return refreshCacheAndReload();
                })
                .then(res => {
                    if (res) {
                        console.log('cache cleaned...');
                    }
                });
        }, []);

        const refreshCacheAndReload = async () => {
            const cacheStorage = caches || window.caches;
            if (caches || window.caches) {
                // Service worker cache should be cleared with caches.delete()
                const cacheKeys = await cacheStorage.keys();
                await Promise.all(
                    cacheKeys.map(key => {
                        window.caches.delete(key);
                    }),
                );
            }
            // clear browser cache and reload page
            window.location.replace(window.location.href);
            return true;
        };

        // eslint-disable-next-line react/jsx-props-no-spreading
        return <>{isLatestBuildDate ? <Component {...props} /> : null}</>;
    }

    return ClearCacheComponent;
}

export default withClearCache;

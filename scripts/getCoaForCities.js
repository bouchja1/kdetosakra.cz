import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import wiki from 'wikijs';

import czechCities from '../src/data/cr.mjs';
import { findCoa } from '../src/services/wikipedia.mjs';

const WIKIPEDIA_API_URL = 'https://cs.wikipedia.org/w/api.php';
const TIMEOUT = 250;

const __dirname = dirname(fileURLToPath(import.meta.url));

const findCoatOfArms = async (obec, okres) => {
    return wiki({ apiUrl: WIKIPEDIA_API_URL })
        .page(`${obec}_(okres_${okres})`)
        .then(async page => {
            const pageInfo = await page.info();
            let coa;
            try {
                const images = await page.images();
                coa = findCoa(images, pageInfo?.znak);
            } catch (err) {
                console.log('Cannot load images or history: ', err);
                return null;
            }
            return coa;
        })
        .catch(err => {
            console.error('Cannot find wikipedia information', err);
            return null;
        });
};

(async () => {
    try {
        let timeout = TIMEOUT;
        for await (let city of czechCities) {
            const { obec, okres } = city;
            setTimeout(async () => {
                const coatOfArmsImage = await findCoatOfArms(obec, okres);
                try {
                    await fs.appendFileSync(
                        path.join(__dirname, 'czechCitiesEnhancedWithCoa.json'),
                        `${JSON.stringify({
                            ...city,
                            ...(coatOfArmsImage && {
                                coatOfArms: coatOfArmsImage,
                            }),
                        })},`,
                    );
                } catch (err) {
                    console.log(err);
                }
                console.log('waiting & result: ', coatOfArmsImage);
            }, timeout);
            timeout += TIMEOUT;
        }
    } catch (err) {
        console.error('Error while running coat of arms enhancement. ', err);
        process.exit(1);
    }
})();

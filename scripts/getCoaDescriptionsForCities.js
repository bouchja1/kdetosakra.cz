import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import axios from 'axios';
import cheerio from 'cheerio';

import czechCities from '../src/data/cr.mjs';

const RUIAN_BASE_URL = 'https://vdp.cuzk.cz/vdp/ruian/obce';

const __dirname = dirname(fileURLToPath(import.meta.url));

const TIMEOUT = 750;

async function scrapeCoaDescription(kod) {
    try {
        // Fetch HTML of the page we want to scrape
        const { data } = await axios.get(`${RUIAN_BASE_URL}/${kod}`);
        // Load HTML we fetched in the previous line
        const $ = cheerio.load(data);
        // flag and coat of arms (coat of arms is the second)
        const items = $('#vlajkaText');

        const [flagItem, coaItem] = items;

        const flagText = $(flagItem).text();
        const coaText = $(coaItem).text();

        return {
            flag: flagText,
            coa: coaText,
        };
    } catch (err) {
        console.error(err);
    }
}

(async () => {
    try {
        let timeout = TIMEOUT;
        for await (let city of czechCities) {
            const { kod } = city;
            setTimeout(async () => {
                const coatOfArmsItems = await scrapeCoaDescription(kod);

                const { flag, coa } = coatOfArmsItems;
                try {
                    await fs.appendFileSync(
                        path.join(__dirname, 'czechCitiesEnhancedWithCoaDescription.json'),
                        `${JSON.stringify({
                            ...city,
                            ...(flag && {
                                coatOfArmsFlagDescription: flag,
                            }),
                            ...(coa && {
                                coatOfArmsDescription: coa,
                            }),
                        })},`,
                    );
                } catch (err) {
                    console.log(err);
                }
                console.log('waiting & result: ', coatOfArmsItems);
            }, timeout);
            timeout += TIMEOUT;
        }
    } catch (err) {
        console.error('Error while running coat of arms enhancement. ', err);
        process.exit(1);
    }
})();

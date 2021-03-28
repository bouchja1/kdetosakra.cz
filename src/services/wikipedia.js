import wiki from 'wikijs';

const WIKIPEDIA_API_URL = 'https://cs.wikipedia.org/w/api.php';

const findCoaByText = imagesArray => {
    const foundedImages = imagesArray.filter(image => {
        if (image.includes('CoA')) {
            return true;
        }
        if (image.toLowerCase().includes('znak')) {
            return true;
        }
        return false;
    });
    return foundedImages.length ? foundedImages[0] : null;
};

const findCoa = (imagesArray, coaName) => {
    if (imagesArray && imagesArray.length) {
        if (coaName) {
            coaName = coaName.replace(/ /g, '_');
            const encodedName = encodeURIComponent(coaName);
            const foundedImage = imagesArray.filter(image => image.includes(encodedName));
            if (foundedImage.length) {
                return foundedImage[0];
            }
            // try to find image not replaced by _
            return findCoaByText(imagesArray);
        }
        return findCoaByText(imagesArray);
    }
    return null;
};

export const findMunicipalityMetadata = async (obec, okres) => {
    return wiki({ apiUrl: WIKIPEDIA_API_URL })
        .page(`${obec}_(okres_${okres})`)
        .then(async page => {
            const pageInfo = await page.info();
            let history;
            let pickedImage;
            try {
                const pageContent = await page.content();
                const historySection = pageContent.filter(section => section.title === 'Historie');
                history = historySection.length ? historySection[0].content : null;
                const images = await page.images();
                pickedImage = findCoa(images, pageInfo?.znak);
            } catch (err) {
                console.log('Cannot load images or history: ', err);
            }
            const wikipediaUrl = page.raw.fullurl;
            const summary = await page.summary();
            return {
                summary,
                wikipediaUrl,
                emblem: pickedImage,
                history,
            };
        })
        .catch(err => {
            console.error('Cannot find wikipedia information', err);
            return null;
        });
};

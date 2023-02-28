import { CzechCity } from '../types/places';

export const getHeraldryDescriptionForCity = (city: CzechCity) => {
    const { coatOfArmsDescription, coatOfArmsFlagDescription } = city;

    if (coatOfArmsDescription) {
        return coatOfArmsDescription;
    }

    if (coatOfArmsFlagDescription) {
        return coatOfArmsFlagDescription;
    }

    return null;
};

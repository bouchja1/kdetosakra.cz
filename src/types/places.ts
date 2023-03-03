export interface CzechCity {
    obec: string;
    kod: number;
    okres: string;
    kod_okres: string;
    kraj: string;
    kod_kraj: string;
    psc: number;
    latitude: number;
    longitude: number;
    coatOfArms?: string;
    coatOfArmsFlagDescription?: string;
    coatOfArmsDescription?: string;
}

export interface AmazingPlace {
    id: string;
    name: string;
    category: string;
    latitude: number;
    longitude: number;
    images: string[];
}

export interface GuessedAmazingPlacePoint {
    pointPanorama: any;
    pointMap: any;
    amazingPlace: AmazingPlace;
    distance: number;
    score: number;
}

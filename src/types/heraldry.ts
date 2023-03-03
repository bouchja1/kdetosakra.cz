import { AmazingPlace, CzechCity } from './places';

export interface HeraldryResultT {
    guessed: boolean;
    city: CzechCity;
    cityWhichWasGuessed: CzechCity;
}

export interface AmazingPlaceResultT {
    guessed: boolean;
    amazingPlace: AmazingPlace;
}

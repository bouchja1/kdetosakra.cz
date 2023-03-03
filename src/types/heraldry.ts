import { AmazingPlace, CzechCity } from './places';

export interface HeraldryResultT {
    guessed: boolean;
    city: CzechCity;
    cityWhichWasGuessed: CzechCity;
}

import { FlavorType, MethodType, TeaType } from "./enums";

export type TeaFormData = {
    name: string;
    type: TeaType | null;
    origin: string;
    price: string | number;
    shop: string;
    description: string;
    flavors: FlavorType[];
};

export const emptyTeaFormData = {
    name:"",
    type:null,
    origin:"",
    price:"",
    shop:"",
    description:"",
    flavors: []
} as TeaFormData;

export type BrewingMethodFormData = {
    teaId: number | null;
    method: MethodType | null;
    temperature: string | number;
    amountPerHundred: string | number;
    brewingTimes: number[];
    gongfuBrewingTimeIncrement: string | number;
};

export const emptyBrewingMethodFormData = {
    teaId: null,
    method: null,
    temperature: "",
    amountPerHundred: "",
    brewingTimes: [],
    gongfuBrewingTimeIncrement: ""
} as BrewingMethodFormData;

export type ReviewFormData = {
    teaId: number;
    userId: number;
    review: string;
    rating: number | null;
};

export const emptyReviewFormData = {
    teaId: 0,
    userId: 0,
    review: "",
    rating: 0
} as ReviewFormData;

export type UserFormData = {
    //TODO later
};
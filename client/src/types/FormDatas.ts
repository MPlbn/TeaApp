import { MethodType, TeaType } from "./enums";

export type TeaFormData = {
    name: string;
    type: TeaType | null;
    origin: string;
    price: string | number;
    shop: string;
    description: string
};

export const emptyTeaFormData = {
    name:"",
    type:null,
    origin:"",
    price:"",
    shop:"",
    description:""
} as TeaFormData;

export type BrewingMethodFormData = {
    teaId: number | null;
    method: MethodType | null;
    temperature: string | number;
    brewingTimes: number[];
    gongfuBrewingTimeIncrement: string | number;
};

export const emptyBrewingMethodFormData = {
    teaId: null,
    method: null,
    temperature: "",
    brewingTimes: [],
    gongfuBrewingTimeIncrement: ""
} as BrewingMethodFormData;

export type ReviewFormData = {
    teaId: number;
    userID: number;
    review: string;
    rating: number;
};

export const emptyReviewFormData = {
    teaId: 0,
    userID: 0,
    review: "",
    rating: 0
} as ReviewFormData;

export type UserFormData = {
    //TODO later
};
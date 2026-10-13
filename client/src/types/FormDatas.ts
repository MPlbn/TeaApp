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
};

export type BrewingMethodFormData = {
    teaID: number | null;
    method: MethodType | null;
    temperature: string | number;
    brewingTimes: number[];
    gongfuBrewingTimeIncrement: string | number;
};

export const emptyBrewingMethodFormData = {
    teaID: null,
    method: null,
    temperature: "",
    brewingTimes: [],
    gongfuBrewingTimeIncrement: ""
};

export type ReviewFormData = {
    teaID: number;
    userID: number;
    review: string;
    rating: number;
};

export const emptyReviewFormData = {
    teaID: 0,
    userID: 0,
    review: "",
    rating: 0
};

export type UserFormData = {
    
};
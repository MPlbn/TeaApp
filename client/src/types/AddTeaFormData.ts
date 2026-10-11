import { TeaType } from "./enums";

export type AddTeaFormData = {
    name: string;
    teaType: TeaType | null;
    origin: string;
    price: number | string;
    shop: string;
    description: string;
};
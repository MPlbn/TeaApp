import { TeaType } from "./enums";

export type TeaFormData = {
    name: string,
    type: TeaType | null,
    origin: string,
    price: string | number,
    shop: string,
    description: string
};
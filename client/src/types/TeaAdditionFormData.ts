import { TeaType } from "./enums";

export type TeaAdditionFormData = {
    name: string;
    teaType: TeaType | null;
    origin: string;
    price: number | string;
    shop: string;
    description: string;
};
import { TeaType } from "./enums";

export type Tea = {
    id: number;
    name: string;
    type: TeaType;
    price: number | null;
    origin: string;
    shop: string;
    description: string;
};
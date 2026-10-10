import { TeaType } from "./enums";

export type Tea = {
    ID: number;
    name: string;
    teaType: TeaType;
    origin: string;
    price: number | null;
    description: string;
};
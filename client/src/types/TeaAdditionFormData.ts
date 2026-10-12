import { TeaType } from "./enums";

export type TeaAdditionFormData = {
        name: string,
        type: TeaType | null,
        origin: string,
        price: string | number,
        shop: string,
        description: string
};
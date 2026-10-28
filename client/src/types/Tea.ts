import { FlavorType, TeaType } from "./enums";

export type Tea = {
    id: number;
    name: string;
    type: TeaType;
    price: number | null;
    origin: string;
    shop: string;
    description: string;
    flavors: FlavorType[];
};

export type ShortTea = { // Naming to change probs. used for fetching data to fill TeaList components
    id: number;
    name: string;
    type: TeaType;
    origin: string;
}
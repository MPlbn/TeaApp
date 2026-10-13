import { MethodType } from "./enums";

export type BrewingMethod = {
    id: number;
    teaID: number;
    method: MethodType;
    temperature: number;
    brewingTimes: number[];
    gongfuBrewingTimeIncrement: number | null;
};
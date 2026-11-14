import { MethodType } from "./enums";

export type BrewingMethod = {
    id: number;
    teaId: number;
    method: MethodType;
    temperature: number;
    amountPerHundred: number;
    brewingTimes: number[];
    gongfuBrewingTimeIncrement: number | null;
};

export type BrewingTime = {
    minutes: number;
    seconds: number;
}
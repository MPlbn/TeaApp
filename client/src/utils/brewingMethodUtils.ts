import { BrewingTime } from "../types/BrewingMethod";

export function getSecondsStringVersion(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const minutesStringPart = minutes > 0 ? `${minutes}min` : ""
    const secondsStringPart = remainingSeconds > 0 ? `${remainingSeconds}s` : ""

    return `${minutesStringPart} ${secondsStringPart}`;
}

export const convertSecondsToTime = (seconds: number): BrewingTime => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return {
        minutes: minutes,
        seconds: remainingSeconds
    } as BrewingTime;
};
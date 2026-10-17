import { BrewingMethod } from "../types/BrewingMethod";
import { MethodType, ViewType } from "../types/enums";
import { TeaType } from "../types/enums";
import { BrewingMethodFormData, TeaFormData } from "../types/FormDatas";
import { Tea } from "../types/Tea";
import { NewBrewingMethod } from "../services/teaApi";

export function getTeaDetailsPath(teaID: number | string): string {
    return `${ViewType.TeaListView}/${teaID}`;
}

export function getTeaTypeStringVersion(teaType: TeaType): string {
    switch(teaType){
        case TeaType.White: return 'Biała';
        case TeaType.Green: return 'Zielona';
        case TeaType.Yellow: return 'Żółta';
        case TeaType.Oolong: return 'Oolong';
        case TeaType.Black: return 'Czarna';
        case TeaType.Heicha: return 'Heicha';
        default: return 'Nieznany typ';
    }
}

export function convertTeaToTeaFormData(tea: Tea): TeaFormData {
    return {
        name: tea.name,
        type: tea.type,
        origin: tea.origin,
        price: tea.price ?? "",
        shop: tea.shop,
        description: tea.description
    }
}

export function getMethodTypeStringVersion(methodType: MethodType): string {
    switch(methodType){
        case MethodType.Gongfu: return "Gongfu";
        case MethodType.Western: return "Klasyczne";
        case MethodType.Alternative: return "Alternatywne";
        default: return "Nieznany typ parzenia";
    }
}

export function convertBrewingMethodFormDataToNewBrewingMethod(brewingMethodFormData: BrewingMethodFormData, teaID: number): NewBrewingMethod | null {
    if (
        brewingMethodFormData.method === null ||
        brewingMethodFormData.temperature === "" ||
        !Number.isFinite(Number(brewingMethodFormData.temperature))
    ) {
        return null;
    }

    let gongfuIncrement: number | null = null;

    if (brewingMethodFormData.method === MethodType.Gongfu) {
        if (
            brewingMethodFormData.gongfuBrewingTimeIncrement === "" ||
            !Number.isFinite(Number(brewingMethodFormData.gongfuBrewingTimeIncrement)) ||
            Number(brewingMethodFormData.gongfuBrewingTimeIncrement) <= 0
        ) {
            return null;
        }

        gongfuIncrement = Number(brewingMethodFormData.gongfuBrewingTimeIncrement); //Maybe this could be null, no need to check??
    }

    if (
        brewingMethodFormData.brewingTimes.length === 0 ||
        brewingMethodFormData.brewingTimes.some(
            (time) => !Number.isFinite(time) || time <= 0
        )
    ) {
        return null;
    }

    return {
        teaId: teaID,
        method: brewingMethodFormData.method,
        temperature: Number(brewingMethodFormData.temperature),
        brewingTimes: brewingMethodFormData.brewingTimes,
        gongfuBrewingTimeIncrement: gongfuIncrement
    };
}

export function convertBrewingMethodToBrewingMethodFormData(brewingMethod: BrewingMethod) : BrewingMethodFormData {
    return {
        teaId: brewingMethod.teaId,
        method: brewingMethod.method,
        temperature: brewingMethod.temperature,
        brewingTimes: [...brewingMethod.brewingTimes],
        gongfuBrewingTimeIncrement: brewingMethod.gongfuBrewingTimeIncrement ?? ""
    };
}
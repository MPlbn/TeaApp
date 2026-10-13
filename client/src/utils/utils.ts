import { MethodType, ViewType } from "../types/enums";
import { TeaType } from "../types/enums";
import { TeaFormData } from "../types/FormDatas";
import { Tea } from "../types/Tea";

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
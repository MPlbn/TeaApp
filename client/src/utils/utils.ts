import { ViewType } from "../types/enums";
import { TeaType } from "../types/enums";

export function getTeaDetailsPath(uTeaID: number | string): string {
    return `${ViewType.TeaListView}/${uTeaID}`;
}

export function getTeaTypeStringVerison(uTeaType: TeaType): string {
    switch(uTeaType){
        case TeaType.White: return 'Biała';
        case TeaType.Green: return 'Zielona';
        case TeaType.Yellow: return 'Żółta';
        case TeaType.Oolong: return 'Oolong';
        case TeaType.Black: return 'Czarna';
        case TeaType.Heicha: return 'Heicha';
        default: return 'Nieznany typ';
    }
}
import { TeaType } from "../types/enums";
import { TeaTypeOption } from "../types/TeaTypeOption";

export const teaTypeOptions: TeaTypeOption[] = [
  { label: 'Wszystkie', value: null },
  { label: 'Biała', value: TeaType.White },
  { label: 'Zielona', value: TeaType.Green },
  { label: 'Żółta', value: TeaType.Yellow },
  { label: 'Oolong', value: TeaType.Oolong },
  { label: 'Czarna', value: TeaType.Black },
  { label: 'Heicha', value: TeaType.Heicha },
];
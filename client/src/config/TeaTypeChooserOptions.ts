import { TeaType } from "../types/enums";

type TeaTypeOption = {
    label: string;
    value: TeaType | null;
}

export const teaTypeOptions: TeaTypeOption[] = [
  { label: 'Wszystkie', value: null },
  { label: 'Biała', value: TeaType.White },
  { label: 'Zielona', value: TeaType.Green },
  { label: 'Żółta', value: TeaType.Yellow },
  { label: 'Oolong', value: TeaType.Oolong },
  { label: 'Czarna', value: TeaType.Black },
  { label: 'Heicha', value: TeaType.Heicha },
];
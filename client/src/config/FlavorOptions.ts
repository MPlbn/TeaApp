import { FlavorType } from "../types/enums";

type FlavorTypeOption = {
    label: string;
    value: FlavorType | null;
}

const flavorLabels: Record<FlavorType, string> = { //Maybe add different language versions in the future, or maybe not. Right now not needed
    [FlavorType.Foresty]: "Leśny",
    [FlavorType.Mossy]: "Mech",
    [FlavorType.Milky]: "Mleczny",
    [FlavorType.Coffeelike]: "Kawowy",
    [FlavorType.WithAdditionalElements]: "Z dodatkami",
    [FlavorType.Jasmine]: "Jaśminowy",
    [FlavorType.Fruity]: "Owocowy",
    [FlavorType.Rustical]: "Stodoła",
    [FlavorType.Haylike]: "Siano",
    [FlavorType.Socklike]: "Skarpeta",
    [FlavorType.Roasted]: "Prażony",
    [FlavorType.Waterlike]: "Nuty wodne",
    [FlavorType.Woody]: "Drewniany",
    [FlavorType.Smokey]: "Dymny",
    [FlavorType.Burnt]: "Palony",
    [FlavorType.Baked]: "Pieczony",
    [FlavorType.Cacaolike]: "Kakaowy",
    [FlavorType.Umami]: "Umami",
    [FlavorType.Citrusy]: "Cytrusowy",
    [FlavorType.Mushroomy]: "Grzybowy",
    [FlavorType.Meadowy]: "Łąkowy",
    [FlavorType.Floral]: "Kwiatowy",
    [FlavorType.Nutty]: "Orzechowy",
    [FlavorType.Honeylike]: "Miodowy",
    [FlavorType.Vegetal]: "Warzywny",
    [FlavorType.Grassy]: "Trawiasty",
    [FlavorType.Creamy]: "Kremowy",
    [FlavorType.Eearthy]: "Ziemisty",
    [FlavorType.Herbal]: "Ziołowy",
    [FlavorType.Bitter]: "Gorzki",
    [FlavorType.Sweet]: "Słodki",
    [FlavorType.Bittersweet]: "Słodko-gorzki",
    [FlavorType.Intense]: "Intensywny",
    [FlavorType.Sour]: "Kwaśny",
    [FlavorType.NO_NOTES]: "BEZ SMAKU"
};

export const flavorOptions: FlavorTypeOption[] = Object.values(FlavorType)
.filter((value): value is FlavorType => typeof value === "number")
.map((value) => ({value, label: flavorLabels[value]}));
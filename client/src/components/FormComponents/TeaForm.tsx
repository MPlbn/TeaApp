import {
    Grid,
    TextInput,
    Select,
    NumberInput,
    Textarea,
    MultiSelect,
    GridCol
} from "@mantine/core";
import { TeaType, FlavorType, UserRole } from "../../types/enums";
import { getTeaTypeStringVersion } from "../../utils/utils";
import { TeaFormData } from "../../types/FormDatas";
import { flavorOptions } from "../../config/FlavorOptions";
import { User } from "../../types/User";
import { CollectionType } from "../../types/enums";

const teaTypeOptions = Object.values(TeaType)
    .filter((value): value is TeaType => typeof value === 'number')
    .map((teaType) => ({
        value: String(teaType),
        label: getTeaTypeStringVersion(teaType)
    }));

type TeaFormProps = {
    formData: TeaFormData;
    updateField: <TKey extends keyof TeaFormData>(
        key: TKey,
        value: TeaFormData[TKey]
    ) => void;
    user: User | null;
    collectionType: CollectionType | null;
    setCollectionType: (value: CollectionType | null) => void;
};

const TeaForm = (props: TeaFormProps) => {

    const renderSelection = () => {
        if (props.user === null || !props.user.roles.includes(UserRole.Admin)) return null;

        const data = [
            { value: String(CollectionType.Public), label: "Publiczna" },
            { value: String(CollectionType.Private), label: "Prywatna" }
        ];

        return (
            <GridCol span={{ base: 12, sm: 6 }}>
                <Select
                    label="Rodzaj kolekcji"
                    placeholder="Wybierz rodzaj"
                    data={data}
                    value={props.collectionType === null ? null : String(props.collectionType)}
                    onChange={(value) => props.setCollectionType(value === null ? null : Number(value) as CollectionType)}
                    clearable
                />
            </GridCol>
        )
    }

    return (
        <Grid gap="md">
            <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                    label="Nazwa herbaty"
                    placeholder="np. Huoshan Huang Ya"
                    value={props.formData.name}
                    onChange={(event) => { props.updateField("name", event.currentTarget.value) }}
                    required
                />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
                <Select
                    label="Rodzaj herbaty"
                    placeholder="Wybierz rodzaj"
                    data={teaTypeOptions}
                    value={props.formData.type === null ? null : String(props.formData.type)}
                    onChange={
                        (value) => { props.updateField("type", value === null ? null : Number(value) as TeaType) }}
                    required
                />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                    label="Pochodzenie"
                    placeholder="np. Chiny, Yunnan"
                    value={props.formData.origin}
                    onChange={(event) => { props.updateField("origin", event.currentTarget.value) }}
                />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
                <NumberInput
                    label="Cena PLN/50g"
                    placeholder="45.45 zł"
                    value={props.formData.price}
                    onChange={(value) => { props.updateField("price", value) }}
                    min={0}
                    decimalScale={2}
                    fixedDecimalScale={false}
                    suffix=" zł"
                    required
                />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                    label="Sklep"
                    placeholder="Nazwa sklepu, np. e-herbata"
                    value={props.formData.shop}
                    onChange={(event) => { props.updateField("shop", event.currentTarget.value) }}
                />
            </Grid.Col>

            <Grid.Col span={12}>
                <MultiSelect
                    label="Nuty smakowe"
                    placeholder="Wybierz nuty smakowe"
                    data={flavorOptions.map((option) => ({
                        value: String(option.value),
                        label: option.label,
                    }))}
                    value={props.formData.flavors.map(String)}
                    onChange={(values) => {
                        props.updateField(
                            "flavors",
                            values.map((value) => Number(value) as FlavorType)
                        );
                    }}
                    searchable
                    clearable
                    hidePickedOptions
                />
            </Grid.Col>

            <Grid.Col span={12}>
                <Textarea
                    label="Opis"
                    placeholder="Krótki opis herbaty..."
                    value={props.formData.description}
                    onChange={(event) => { props.updateField('description', event.currentTarget.value) }}
                />
            </Grid.Col>

            {renderSelection()}
        </Grid>
    );
}
export default TeaForm;
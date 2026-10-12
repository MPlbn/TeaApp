import { 
    Grid,
    TextInput,
    Select,
    NumberInput,
    Textarea
 } from "@mantine/core";
import { TeaType } from "../../types/enums";
import { getTeaTypeStringVerison } from "../../utils/utils";
import { TeaAdditionFormData } from "../../types/TeaAdditionFormData";

type TeaAdditionFormProps = {
    formData: TeaAdditionFormData;
    updateField: <TKey extends keyof TeaAdditionFormData>(
        uKey: TKey,
        uValue: TeaAdditionFormData[TKey]
    ) => void;
};

const teaTypeOptions = Object.values(TeaType)
    .filter((value): value is TeaType => typeof value === 'number')
    .map((teaType) => ({
        value: String(teaType), 
        label: getTeaTypeStringVerison(teaType)}));
                                            
const TeaAdditionForm = (props: TeaAdditionFormProps) => {
    return (
        <Grid gap="md">
            <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                    label="Nazwa herbaty"
                    placeholder="np. Huoshan Huang Ya"
                    value={props.formData.name}
                    onChange={(event) => {props.updateField("name", event.currentTarget.value)}}
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
                        (value) => {props.updateField("type", value === null ? null : Number(value) as TeaType)}}
                    required
                    />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                    label="Pochodzenie"
                    placeholder="np. Chiny, Yunnan"
                    value={props.formData.origin}
                    onChange={(event) => {props.updateField("origin", event.currentTarget.value)}}
                />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
                <NumberInput
                    label="Cena PLN/50g"
                    placeholder="45.45 zł"
                    value={props.formData.price}
                    onChange={(value) => {props.updateField("price", value)}}
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
                    onChange={(event) => {props.updateField("shop", event.currentTarget.value)}}
                />
            </Grid.Col>
                    
            <Grid.Col span={12}>
                <Textarea
                    label="Opis"
                    placeholder="Krótki opis herbaty..."
                    value={props.formData.description}
                    onChange={(event) => {props.updateField('description', event.currentTarget.value)}}
                    minRows={3}
                    autosize
                />
            </Grid.Col>
        </Grid>
    );
}
export default TeaAdditionForm;
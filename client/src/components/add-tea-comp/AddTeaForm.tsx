import { 
    Grid,
    TextInput,
    Select,
    NumberInput,
    Textarea
 } from "@mantine/core";
import { TeaType } from "../../types/enums";
import { AddTeaFormData } from "../../types/AddTeaFormData";

type AddTeaFormProps = {
    formData: AddTeaFormData;
    updateField: <TKey extends keyof AddTeaFormData>(
        uKey: TKey,
        uValue: AddTeaFormData[TKey]
    ) => void;
};

export default function AddTeaForm(uProps: AddTeaFormProps) {
    return (
        <Grid gap="md">
            <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                    label="Nazwa herbaty"
                    placeholder="np. Huoshan Huang Ya"
                    value={uProps.formData.name}
                    onChange={
                        function (xEvent){
                            uProps.updateField('name', xEvent.currentTarget.value);
                        }
                    }
                    required
                    />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
                <Select
                    label="Rodzaj herbaty"
                    placeholder="Wybierz rodzaj"
                    data={[
                        { value: String(TeaType.White), label: 'Biała' },
                        { value: String(TeaType.Green), label: 'Zielona' },
                        { value: String(TeaType.Yellow), label: 'Żółta' },
                        { value: String(TeaType.Oolong), label: 'Oolong' },
                        { value: String(TeaType.Black), label: 'Czarna' },
                        { value: String(TeaType.Heicha), label: 'Heicha' }
                    ]}
                    value={uProps.formData.teaType === null ? null : String(uProps.formData.teaType)}
                    onChange={
                        function (xValue){
                            if (xValue === null){
                                uProps.updateField('teaType', null);
                            }
                            else{
                                uProps.updateField('teaType', Number(xValue) as TeaType);
                            }
                        } 
                    }
                    required
                    />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                    label='Pochodzenie'
                    placeholder='np. Chiny, Yunnan'
                    value={uProps.formData.origin}
                    onChange={
                        function (xEvent){
                            uProps.updateField('origin', xEvent.currentTarget.value);
                        }
                    }
                />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
                <NumberInput
                    label='Cena PLN/50g'
                    placeholder='45.45 zł'
                    value={uProps.formData.price}
                    onChange={
                        function (xValue){
                            uProps.updateField('price', xValue);
                        }
                    }
                    min={0}
                    decimalScale={2}
                    fixedDecimalScale={false}
                    suffix=' zł'
                    required
                />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                    label='Sklep'
                    placeholder='Nazwa sklepu, np. e-herbata'
                    value={uProps.formData.shop}
                    onChange={
                        function (xEvent){
                            uProps.updateField('shop', xEvent.currentTarget.value);
                        }
                    }
                />
            </Grid.Col>
                    
            <Grid.Col span={12}>
                <Textarea
                    label='Opis'
                    placeholder='Krótki opis herbaty...'
                    value={uProps.formData.description}
                    onChange={
                        function (xEvent){
                            uProps.updateField('description', xEvent.currentTarget.value);
                        }
                    }
                    minRows={3}
                    autosize
                />
            </Grid.Col>
        </Grid>
    );
}

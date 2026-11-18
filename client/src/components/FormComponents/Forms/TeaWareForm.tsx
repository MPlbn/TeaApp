import { Grid, NumberInput, TextInput } from "@mantine/core";
import { TeaWareFormData } from "../FormPanels/TeaWareFormPanel";
type TeaWareFormProps = {
    formData: TeaWareFormData;
    updateField: <TKey extends keyof TeaWareFormData>(key: TKey, value: TeaWareFormData[TKey]) => void;
}

const TeaWareForm = (props: TeaWareFormProps) => {


    return (


        <Grid gap="md">
            <Grid.Col span={{ base: 12, sm: 12 }}>
                <TextInput
                    label="Nazwa naczynia"
                    placeholder="Wpisz nazwę..."
                    required
                    value={props.formData.name}
                    onChange={(event) => { props.updateField("name", event.currentTarget.value) }}
                />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 12 }}>
                <NumberInput
                    label="Pojemność naczynia"
                    placeholder="...ml"
                    decimalScale={0}
                    suffix="ml"
                    min={1}
                    hideControls
                    required
                    value={props.formData.capacity}
                    onChange={(value) => { props.updateField("capacity", value) }}
                />
            </Grid.Col>
        </Grid>
    )
}

export default TeaWareForm
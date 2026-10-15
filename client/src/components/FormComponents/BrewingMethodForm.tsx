import { MethodType } from "../../types/enums";
import { BrewingMethodFormData } from "../../types/FormDatas";
import { getMethodTypeStringVersion } from "../../utils/utils";
import { Grid, NumberInput, Select, ActionIcon, Group, Badge, TextInput} from "@mantine/core";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useState } from "react";

const methodTypeOptions = Object.values(MethodType)
    .filter((value): value is MethodType => typeof value === 'number')
    .map((methodType) => ({
        value: String(methodType),
        label: getMethodTypeStringVersion(methodType)}));

type BrewingMethodFormProps = {
    formData: BrewingMethodFormData;
    updateField: <TKey extends keyof BrewingMethodFormData>(
        key: TKey,
        value: BrewingMethodFormData[TKey]
    ) => void;
};

const BrewingMethodForm = (props: BrewingMethodFormProps) => {
    const [newTime, setNewTime] = useState<number | string>("");

    const addBrewingTime = () => {
        const time = Number(newTime);
    
        if(newTime === "" || !Number.isFinite(time) || time <= 0){
            return;
        }
    
        props.updateField("brewingTimes", [...props.formData.brewingTimes, time]);
        
        setNewTime("");
    }

    const removeBrewingTime = (index: number) => {
        props.updateField("brewingTimes", 
            props.formData.brewingTimes.filter((_, currentIndex) => currentIndex !== index));
    } 

    return(
        <Grid gap="md">
            <Grid.Col span={{ base: 12, sm: 6 }}>
                <Select
                    label="Rodzaj parzenia"
                    placeholder="Wybierz rodzaj"
                    data={methodTypeOptions}
                    value={props.formData.method === null ? null : String(props.formData.method)}
                    onChange={
                        (value) => {props.updateField("method", value === null ? null : Number(value) as MethodType)}}
                    required
                    />
            </Grid.Col>

            <Grid.Col span={12}>
                <NumberInput
                    label="Temperatura parzenia"
                    placeholder="96 °C"
                    value={props.formData.temperature}
                    onChange={(value) => {props.updateField("temperature", value)}}
                    min={-100}
                    max={96}
                    decimalScale={0}
                    fixedDecimalScale={true}
                    suffix=" °C"
                    required
                />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 12 }}>
                <TextInput
                    label="Czasy parzenia"
                    placeholder="Wpisz czas w sekundach"
                    type="number"
                    value={newTime}
                    onChange={(event) => setNewTime(event.currentTarget.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            addBrewingTime();
                        }
                    }}
                    rightSection={
                        <ActionIcon
                            variant="light"
                            onClick={addBrewingTime}
                            aria-label="Dodaj czas parzenia"
                        >
                            <IconPlus size={16} />
                        </ActionIcon>
                    }
                />

                <Group gap="xs" mt="sm">
                    {props.formData.brewingTimes.map((time, index) => (
                        <Badge
                            key={`${index}-${time}`}
                            size="lg"
                            variant="light"
                            rightSection={
                                <ActionIcon
                                    size="xs"
                                    color="gray"
                                    variant="transparent"
                                    onClick={() => removeBrewingTime(index)}
                                    aria-label={`Usuń czas ${time} sekund`}
                                >
                                    <IconX size={12} />
                                </ActionIcon>
                            }
                        >
                            {time} s
                        </Badge>
                    ))}
                </Group>
            </Grid.Col>

            {props.formData.method === MethodType.Gongfu &&
                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <NumberInput
                        label="Czas wydłużania kolejnych parzeń"
                        placeholder="...+ 5 s"
                        value={props.formData.gongfuBrewingTimeIncrement}
                        onChange={(value) => {props.updateField("gongfuBrewingTimeIncrement", value)}}
                        min={1}
                        decimalScale={0}
                        fixedDecimalScale={true}
                        suffix=" s"
                        prefix="...+ "
                    />
                </Grid.Col>
            }

        </Grid>
    );
};
export default BrewingMethodForm;
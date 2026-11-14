import { BrewingTime } from "../../types/BrewingMethod";
import { MethodType } from "../../types/enums";
import { BrewingMethodFormData } from "../../types/FormDatas";
import { Grid, NumberInput, Select, ActionIcon, Group, MaskInput, Text, Popover, Button, UnstyledButton } from "@mantine/core";
import { IconArrowLeft, IconArrowRight, IconPlus, IconTrash } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { getMethodTypeStringVersion } from "../../utils/utils";
import { getSecondsStringVersion } from "../../utils/brewingMethodUtils";

const methodTypeOptions = Object.values(MethodType)
    .filter((value): value is MethodType => typeof value === 'number')
    .map((methodType) => ({
        value: String(methodType),
        label: getMethodTypeStringVersion(methodType)
    }));



type BrewingMethodFormProps = {
    formData: BrewingMethodFormData;
    updateField: <TKey extends keyof BrewingMethodFormData>(
        key: TKey,
        value: BrewingMethodFormData[TKey]
    ) => void;
};

const BrewingMethodForm = (props: BrewingMethodFormProps) => {

    const brewingTimesResetRef = useRef<() => void>(null);

    const [newTime, setNewTime] = useState<BrewingTime | null>(null);

    const [openedPopoverIndex, setOpenedPopoverIndex] = useState<number | null>(null);

    const convertTimeToSeconds = (time: BrewingTime): number => {
        return time.minutes * 60 + time.seconds;
    }

    const convertRawToTime = (raw: string): BrewingTime => {
        if (raw.length !== 4) {
            return {
                minutes: 0,
                seconds: 0
            } as BrewingTime;
        }

        const minutes = Number(raw.slice(0, 2));
        const seconds = Number(raw.slice(2, 4));

        return {
            minutes: minutes,
            seconds: seconds
        } as BrewingTime;
    }

    const moveBrewingTime = (index: number, direction: -1 | 1) => {
        const newIndex = index + direction;

        if (newIndex < 0 || newIndex >= props.formData.brewingTimes.length) {
            return;
        }

        const newBrewingTimes = [...props.formData.brewingTimes];

        [newBrewingTimes[index], newBrewingTimes[newIndex]] =
            [newBrewingTimes[newIndex], newBrewingTimes[index]];

        props.updateField("brewingTimes", newBrewingTimes);
    };

    const addBrewingTime = () => {
        if (newTime === null) return;

        const totalSeconds = convertTimeToSeconds(newTime);

        if (totalSeconds <= 0) return;

        props.updateField("brewingTimes", [...props.formData.brewingTimes, totalSeconds]);

        setNewTime(null);

        brewingTimesResetRef.current?.();
    }

    const removeBrewingTime = (index: number) => {
        props.updateField("brewingTimes",
            props.formData.brewingTimes.filter((_, currentIndex) => currentIndex !== index));
    }

    return (
        <Grid gap="md">
            <Grid.Col span={{ base: 12, sm: 6 }}>
                <Select
                    label="Rodzaj parzenia"
                    placeholder="Wybierz rodzaj"
                    data={methodTypeOptions}
                    value={props.formData.method === null ? null : String(props.formData.method)}
                    onChange={
                        (value) => { props.updateField("method", value === null ? null : Number(value) as MethodType) }}
                    required
                />
            </Grid.Col>

            <Grid.Col span={12}>
                <NumberInput
                    label="Temperatura parzenia"
                    placeholder="96 °C"
                    value={props.formData.temperature}
                    onChange={(value) => { props.updateField("temperature", value) }}
                    min={-100}
                    max={96}
                    decimalScale={0}
                    fixedDecimalScale={true}
                    suffix=" °C"
                    required
                    hideControls
                />
            </Grid.Col>

            <Grid.Col span={12}>
                <NumberInput
                    label="Ilość gramów na 100ml wody"
                    placeholder="2 g/100ml"
                    value={props.formData.amountPerHundred}
                    onChange={(value) => { props.updateField("amountPerHundred", value) }}
                    min={0}
                    max={20}
                    decimalScale={1}
                    fixedDecimalScale={false}
                    suffix=" g/100ml"
                    required
                    hideControls
                />
            </Grid.Col>


            <Grid.Col span={{ base: 12, sm: 12 }}>
                <MaskInput
                    label="Czasy parzenia"
                    placeholder="__min__s"
                    mask={"99min 99s"}
                    onChangeRaw={(raw) => {
                        const convertedTime = convertRawToTime(raw)
                        setNewTime(convertedTime)
                    }}
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
                    resetRef={brewingTimesResetRef}
                />

                <Group gap="xs" mt="sm" wrap="wrap">
                    {props.formData.brewingTimes.map((seconds, index) => {
                        return (
                            <Group key={`${index}-${seconds}`} gap="xs">
                                <Popover
                                    position="bottom"
                                    shadow="md"
                                    opened={openedPopoverIndex === index}
                                    onChange={(opened) => {
                                        setOpenedPopoverIndex(opened ? index : null);
                                    }}
                                >
                                    <Popover.Target>
                                        <UnstyledButton
                                            type="button"
                                            onClick={() => {
                                                setOpenedPopoverIndex(
                                                    openedPopoverIndex === index ? null : index
                                                );
                                            }}
                                        >
                                            <Text fw={500} c="teaGreen.9">
                                                {getSecondsStringVersion(seconds)}
                                            </Text>
                                        </UnstyledButton>
                                    </Popover.Target>

                                    <Popover.Dropdown>
                                        <Group gap="xs">
                                            <ActionIcon
                                                variant="light"
                                                color="gray"
                                                disabled={index === 0}
                                                onClick={() => {
                                                    moveBrewingTime(index, -1);
                                                    setOpenedPopoverIndex(index - 1);
                                                }}
                                            >
                                                <IconArrowLeft size={16} />
                                            </ActionIcon>

                                            <ActionIcon
                                                variant="light"
                                                color="gray"
                                                disabled={index === props.formData.brewingTimes.length - 1}
                                                onClick={() => {
                                                    moveBrewingTime(index, 1);
                                                    setOpenedPopoverIndex(index + 1);
                                                }}
                                            >
                                                <IconArrowRight size={16} />
                                            </ActionIcon>

                                            <ActionIcon
                                                variant="light"
                                                color="red"
                                                onClick={() => {
                                                    removeBrewingTime(index);
                                                    setOpenedPopoverIndex(null);
                                                }}
                                            >
                                                <IconTrash size={16} />
                                            </ActionIcon>
                                        </Group>
                                    </Popover.Dropdown>
                                </Popover>

                                {index < props.formData.brewingTimes.length - 1 && (
                                    <IconArrowRight
                                        size={16}
                                        color="var(--mantine-color-dimmed)"
                                    />
                                )}
                            </Group>
                        );
                    })}
                </Group>
            </Grid.Col>

            {props.formData.method === MethodType.Gongfu &&
                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <NumberInput
                        label="Czas wydłużania kolejnych parzeń"
                        placeholder="...+ 5 s"
                        value={props.formData.gongfuBrewingTimeIncrement}
                        onChange={(value) => { props.updateField("gongfuBrewingTimeIncrement", value) }}
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
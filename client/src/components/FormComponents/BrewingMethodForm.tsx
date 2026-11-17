import { BrewingMethod, BrewingTime } from "../../types/BrewingMethod";
import { MethodType } from "../../types/enums";
import { FormMode, FormPanelDetails } from "../../types/FormDatas";
import { Grid, NumberInput, Select, ActionIcon, Group, MaskInput, Text, Popover, Button, UnstyledButton } from "@mantine/core";
import { IconArrowLeft, IconArrowRight, IconPlus, IconTrash } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { getMethodTypeStringVersion } from "../../utils/utils";
import { getSecondsStringVersion } from "../../utils/brewingMethodUtils";
import useForm from "../../hooks/useForm";
import { NewBrewingMethod, useAddBrewingMethodMutation, useEditBrewingMethodMutation } from "../../services/teaApi";
import FormPanel from "./FormPanel";

const ADD_FORM_PANEL_DETAILS = {
    title: "Dodaj sposób parzenia",
    description: "Uzupełnij informacje o sposobie parzenia",
    successMessage: "Poprawnie dodano sposób parzenia!",
    submitLabel: "Dodaj"
} as FormPanelDetails;

const EDIT_FORM_PANEL_DETAILS = {
    title: "Edytuj sposób parzenia",
    description: "Uzupełnij informacje o sposobie parzenia",
    successMessage: "Poprawnie edytowano sposób parzenia!",
    submitLabel: "Zapisz zmiany"
} as FormPanelDetails;

type FormData = {
    teaId: number;
    method: MethodType | null;
    temperature: string | number;
    amountPerHundred: string | number;
    brewingTimes: number[];
    gongfuBrewingTimeIncrement: string | number;
}


const getEmptyFormData = (teaId: number): FormData => ({
    teaId: teaId,
    method: null,
    temperature: "",
    amountPerHundred: "",
    brewingTimes: [],
    gongfuBrewingTimeIncrement: ""
} as FormData);

const converter = (formData: FormData): NewBrewingMethod => ({
    teaId: formData.teaId,
    method: formData.method!,
    temperature: Number(formData.temperature),
    amountPerHundred: Number(formData.amountPerHundred),
    brewingTimes: formData.brewingTimes,
    gongfuBrewingTimeIncrement:
        formData.method === MethodType.Gongfu
            ? Number(formData.gongfuBrewingTimeIncrement)
            : null
});

const convertToFormData = (brewingMethod: BrewingMethod): FormData => {
    return {
        teaId: brewingMethod.teaId,
        method: brewingMethod.method,
        temperature: brewingMethod.temperature,
        amountPerHundred: brewingMethod.amountPerHundred,
        brewingTimes: [...brewingMethod.brewingTimes],
        gongfuBrewingTimeIncrement: brewingMethod.gongfuBrewingTimeIncrement ?? ""
    } as FormData;
}

const validator = (formData: FormData): boolean => {
    if (formData.method === null) return false;

    if (
        formData.temperature === "" ||
        !Number.isFinite(Number(formData.temperature))
    ) return false;

    if (
        formData.amountPerHundred === "" ||
        !Number.isFinite(Number(formData.amountPerHundred))
    ) return false;

    if (
        formData.brewingTimes.length === 0 ||
        formData.brewingTimes.some((time) => !Number.isFinite(time) || time <= 0)
    ) return false;

    if (formData.method === MethodType.Gongfu) {
        if (
            formData.gongfuBrewingTimeIncrement === "" ||
            !Number.isFinite(Number(formData.gongfuBrewingTimeIncrement)) ||
            Number(formData.gongfuBrewingTimeIncrement) <= 0
        ) return false;
    }

    return true;
};

const methodTypeOptions = Object.values(MethodType)
    .filter((value): value is MethodType => typeof value === 'number')
    .map((methodType) => ({
        value: String(methodType),
        label: getMethodTypeStringVersion(methodType)
    }));

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

type BrewingMethodFormProps = {
    teaId?: number;
    onFinish?: () => void;
    initialBrewingMethod?: BrewingMethod;
};

const BrewingMethodForm = (props: BrewingMethodFormProps) => {

    const teaId = props.teaId ?? props.initialBrewingMethod?.teaId ?? null;

    if (teaId === null) return <></>

    const emptyFormData = getEmptyFormData(teaId);

    const [addBrewingMethod, { isLoading: isAdding }] = useAddBrewingMethodMutation();
    const [editBrewingMethod, { isLoading: isEditing }] = useEditBrewingMethodMutation();

    const formMode = props.initialBrewingMethod ? FormMode.Edit : FormMode.Add

    const {
        formData,
        updateField,
        clearForm,
        isValid,
        getData
    } = useForm<FormData, NewBrewingMethod>(validator, converter, emptyFormData, props.initialBrewingMethod ? convertToFormData(props.initialBrewingMethod) : emptyFormData);

    const brewingTimesResetRef = useRef<() => void>(null);

    const [newTime, setNewTime] = useState<BrewingTime | null>(null);

    const [openedPopoverIndex, setOpenedPopoverIndex] = useState<number | null>(null);

    const handleSave = async () => {
        const brewingMethodToSave = getData();

        if (brewingMethodToSave === null) return;

        switch (formMode) {
            case FormMode.Add:
                await addBrewingMethod(brewingMethodToSave).unwrap();
                break;
            case FormMode.Edit:
                await editBrewingMethod({ brewingMethodId: props.initialBrewingMethod!.id, brewingMethod: brewingMethodToSave }).unwrap();
                break;
            default:
                break;
        }
    }

    const getDetails = (): FormPanelDetails => {
        switch (formMode) {
            case FormMode.Add:
                return ADD_FORM_PANEL_DETAILS;
            case FormMode.Edit:
                return EDIT_FORM_PANEL_DETAILS;
        }
    }

    const getIsSaving = () => {
        switch (formMode) {
            case FormMode.Add:
                return isAdding;
            case FormMode.Edit:
                return isEditing;
        }
    }

    const moveBrewingTime = (index: number, direction: -1 | 1) => {
        const newIndex = index + direction;

        if (newIndex < 0 || newIndex >= formData.brewingTimes.length) {
            return;
        }

        const newBrewingTimes = [...formData.brewingTimes];

        [newBrewingTimes[index], newBrewingTimes[newIndex]] =
            [newBrewingTimes[newIndex], newBrewingTimes[index]];

        updateField("brewingTimes", newBrewingTimes);
    };

    const addBrewingTime = () => {
        if (newTime === null) return;

        const totalSeconds = convertTimeToSeconds(newTime);

        if (totalSeconds <= 0) return;

        updateField("brewingTimes", [...formData.brewingTimes, totalSeconds]);

        setNewTime(null);

        brewingTimesResetRef.current?.();
    }

    const removeBrewingTime = (index: number) => {
        updateField("brewingTimes",
            formData.brewingTimes.filter((_, currentIndex) => currentIndex !== index));
    }

    return (
        <FormPanel
            details={getDetails()}
            isValid={isValid()}
            isSaving={getIsSaving()}
            onSave={handleSave}
            onFinish={props.onFinish ?? clearForm}
            onClear={formMode === FormMode.Add ? clearForm : undefined}
        >
            <Grid gap="md">
                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Select
                        label="Rodzaj parzenia"
                        placeholder="Wybierz rodzaj"
                        data={methodTypeOptions}
                        value={formData.method === null ? null : String(formData.method)}
                        onChange={
                            (value) => { updateField("method", value === null ? null : Number(value) as MethodType) }}
                        required
                    />
                </Grid.Col>

                <Grid.Col span={12}>
                    <NumberInput
                        label="Temperatura parzenia"
                        placeholder="96 °C"
                        value={formData.temperature}
                        onChange={(value) => { updateField("temperature", value) }}
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
                        value={formData.amountPerHundred}
                        onChange={(value) => { updateField("amountPerHundred", value) }}
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
                        {formData.brewingTimes.map((seconds, index) => {
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
                                                    disabled={index === formData.brewingTimes.length - 1}
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

                                    {index < formData.brewingTimes.length - 1 && (
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

                {
                    formData.method === MethodType.Gongfu &&
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <NumberInput
                            label="Czas wydłużania kolejnych parzeń"
                            placeholder="...+ 5 s"
                            value={formData.gongfuBrewingTimeIncrement}
                            onChange={(value) => { updateField("gongfuBrewingTimeIncrement", value) }}
                            min={1}
                            decimalScale={0}
                            fixedDecimalScale={true}
                            suffix=" s"
                            prefix="...+ "
                        />
                    </Grid.Col>
                }

            </Grid >
        </FormPanel>
    );
};
export default BrewingMethodForm;
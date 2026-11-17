import { Grid, NumberInput, TextInput } from "@mantine/core";
import { FormMode, FormPanelDetails } from "../../types/FormDatas";
import FormPanel from "./FormPanel";
import { NewTeaWare, useAddTeaWareMutation, useEditTeaWareMutation } from "../../services/teaApi";
import useForm from "../../hooks/useForm";
import { TeaWare } from "../../types/TeaWare";

//CONSTS
const ADD_FORM_PANEL_DETAILS = {
    title: "Dodaj naczynie",
    description: "Uzupełnij informacje o naczyniu",
    successMessage: "Poprawnie dodano naczynie!",
    submitLabel: "Dodaj"
} as FormPanelDetails;

const EDIT_FORM_PANEL_DETAILS = {
    title: "Edytuj naczynie",
    description: "Uzupełnij informacje o naczyniu",
    successMessage: "Poprawnie edytowano naczynie!",
    submitLabel: "Zapisz zmiany"
} as FormPanelDetails;

type FormData = {
    name: string,
    capacity: number | string
}

const EMPTY_FORM_DATA = {
    name: "",
    capacity: ""
}

const converter = (formData: FormData): NewTeaWare => {
    return {
        name: formData.name,
        capacity: formData.capacity as number
    } as NewTeaWare;
}

const validator = (formData: FormData): boolean => {
    if (formData.capacity === "" || typeof formData.capacity !== "number") return false;
    if (formData.name.trim() === "") return false;
    return true;
}

type TeaWareFormProps = {
    onFinish?: () => void;
    initialTeaWare?: TeaWare;
}

const TeaWareForm = (props: TeaWareFormProps) => {
    const [addTeaWare, { isLoading: isAdding }] = useAddTeaWareMutation();
    const [editTeaWare, { isLoading: isEditing }] = useEditTeaWareMutation();
    const formMode = props.initialTeaWare ? FormMode.Edit : FormMode.Add

    const {
        formData,
        updateField,
        clearForm,
        isValid,
        getData
    } = useForm<FormData, NewTeaWare>(validator, converter, EMPTY_FORM_DATA, props.initialTeaWare);

    const handleSave = async () => {
        const teaWareToSave = getData();

        if (teaWareToSave === null) return;

        switch (formMode) {
            case FormMode.Add:
                await addTeaWare(teaWareToSave).unwrap();
                break;
            case FormMode.Edit:
                await editTeaWare({ id: props.initialTeaWare!.id, teaWare: teaWareToSave }).unwrap();
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
                <Grid.Col span={{ base: 12, sm: 12 }}>
                    <TextInput
                        label="Nazwa naczynia"
                        placeholder="Wpisz nazwę..."
                        required
                        value={formData.name}
                        onChange={(event) => { updateField("name", event.currentTarget.value) }}
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
                        value={formData.capacity}
                        onChange={(value) => { updateField("capacity", value) }}
                    />
                </Grid.Col>
            </Grid>
        </FormPanel>

    )
}

export default TeaWareForm
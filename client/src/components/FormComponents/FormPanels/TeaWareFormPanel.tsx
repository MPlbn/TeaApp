import useForm from '../../../hooks/useForm';
import { NewTeaWare, useAddTeaWareMutation, useEditTeaWareMutation } from '../../../services/teaApi';
import { FormMode, FormPanelDetails } from '../../../types/FormDatas';
import { TeaWare } from '../../../types/TeaWare';
import TeaWareForm from '../Forms/TeaWareForm';
import FormPanel from './FormPanel';

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

export type TeaWareFormData = {
    name: string;
    capacity: number | string;
}

const EMPTY_FORM_DATA = {
    name: "",
    capacity: ""
}

const converter = (formData: TeaWareFormData): NewTeaWare => {
    return {
        name: formData.name,
        capacity: formData.capacity as number
    } as NewTeaWare;
}

const validator = (formData: TeaWareFormData): boolean => {
    if (formData.capacity === "" || typeof formData.capacity !== "number") return false;
    if (formData.name.trim() === "") return false;
    return true;
}

type TeaWareFormPanelProps = {
    onFinish?: () => void;
    initialTeaWare?: TeaWare;
}

const TeaWareFormPanel = (props: TeaWareFormPanelProps) => {
    const [addTeaWare, { isLoading: isAdding }] = useAddTeaWareMutation();
    const [editTeaWare, { isLoading: isEditing }] = useEditTeaWareMutation();
    const formMode = props.initialTeaWare ? FormMode.Edit : FormMode.Add

    const {
        formData,
        updateField,
        clearForm,
        isValid,
        getData
    } = useForm<TeaWareFormData, NewTeaWare>(validator, converter, EMPTY_FORM_DATA, props.initialTeaWare);

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
            <TeaWareForm
                formData={formData}
                updateField={updateField}
            />
        </FormPanel>
    )
}

export default TeaWareFormPanel
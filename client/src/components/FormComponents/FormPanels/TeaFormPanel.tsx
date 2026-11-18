import useForm from "../../../hooks/useForm";
import { NewTea, useAddTeaMutation, useEditTeaMutation } from "../../../services/teaApi";
import { FlavorType, TeaType, UserRole } from "../../../types/enums";
import { FormMode, FormPanelDetails } from "../../../types/FormDatas";
import { Tea } from "../../../types/Tea";
import TeaForm from "../Forms/TeaForm";
import FormPanel from "./FormPanel";
import { useAppSelector } from "../../../store/hooks";

const ADD_FORM_PANEL_DETAILS = {
    title: "Dodaj herbatę",
    description: "Uzupełnij informacje o herbacie",
    successMessage: "Poprawnie dodano herbatę!",
    submitLabel: "Dodaj"
} as FormPanelDetails;

const EDIT_FORM_PANEL_DETAILS = {
    title: "Edytuj herbatę",
    description: "Uzupełnij informacje o herbacie",
    successMessage: "Poprawnie edytowano herbatę!",
    submitLabel: "Zapisz zmiany"
} as FormPanelDetails;

export type TeaFormData = {
    name: string;
    type: TeaType | null;
    origin: string;
    price: string | number;
    shop: string;
    description: string;
    flavors: FlavorType[];
    isPublic: boolean;
}

const EMPTY_FORM_DATA = {
    name: "",
    type: null,
    origin: "",
    price: "",
    shop: "",
    description: "",
    flavors: [],
    isPublic: false
} as TeaFormData;

const converter = (formData: TeaFormData): NewTea => {
    return {
        name: formData.name,
        type: formData.type,
        origin: formData.origin,
        price: formData.price,
        shop: formData.shop,
        description: formData.description,
        flavors: formData.flavors,
        isPublic: formData.isPublic
    } as NewTea;
}

const convertToFormData = (tea: Tea): TeaFormData => {
    return {
        name: tea.name,
        type: tea.type,
        origin: tea.origin,
        price: tea.price ?? "",
        shop: tea.shop,
        description: tea.description,
        flavors: [...tea.flavors],
        isPublic: tea.isPublic
    } as TeaFormData;
}

const validator = (formData: TeaFormData): boolean => {
    const price = Number(formData.price)
    if (formData.name.trim() === '') return false;

    if (formData.type === null) return false;


    if (
        formData.price === '' ||
        price <= 0 ||
        !Number.isFinite(price)
    ) return false;

    return true;
}

type TeaFormPanelProps = {
    onFinish?: () => void;
    initialTea?: Tea;
}

const TeaFormPanel = (props: TeaFormPanelProps) => {
    const [addTea, { isLoading: isAdding }] = useAddTeaMutation();
    const [editTea, { isLoading: isEditing }] = useEditTeaMutation();

    const user = useAppSelector((state) => state.auth.user);

    const isAdmin = user !== null && user.roles.includes(UserRole.Admin);

    const formMode = props.initialTea ? FormMode.Edit : FormMode.Add

    const {
        formData,
        updateField,
        clearForm,
        isValid,
        getData
    } = useForm<TeaFormData, NewTea>(validator, converter, EMPTY_FORM_DATA, props.initialTea ? convertToFormData(props.initialTea) : EMPTY_FORM_DATA);

    const handleSave = async () => {
        const teaToSave = getData();

        if (teaToSave === null) return;

        switch (formMode) {
            case FormMode.Add:
                await addTea(teaToSave).unwrap();
                break;
            case FormMode.Edit:
                await editTea({ teaId: props.initialTea!.id, tea: teaToSave }).unwrap();
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
            <TeaForm
                formData={formData}
                updateField={updateField}
                isAdmin={isAdmin}
            />
        </FormPanel>
    )
}

export default TeaFormPanel
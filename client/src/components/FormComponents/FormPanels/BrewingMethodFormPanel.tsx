import useForm from "../../../hooks/useForm";
import { NewBrewingMethod, useAddBrewingMethodMutation, useEditBrewingMethodMutation } from "../../../services/teaApi";
import { BrewingMethod } from "../../../types/BrewingMethod";
import { MethodType } from "../../../types/enums";
import { FormMode, FormPanelDetails } from "../../../types/FormDatas";
import BrewingMethodForm from "../Forms/BrewingMethodForm";
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

export type BrewingMethodFormData = {
    teaId: number;
    method: MethodType | null;
    temperature: string | number;
    amountPerHundred: string | number;
    brewingTimes: number[];
    gongfuBrewingTimeIncrement: string | number;
}

const getEmptyFormData = (teaId: number): BrewingMethodFormData => ({
    teaId: teaId,
    method: null,
    temperature: "",
    amountPerHundred: "",
    brewingTimes: [],
    gongfuBrewingTimeIncrement: ""
} as BrewingMethodFormData);


const converter = (formData: BrewingMethodFormData): NewBrewingMethod => ({
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

const convertToFormData = (brewingMethod: BrewingMethod): BrewingMethodFormData => {
    return {
        teaId: brewingMethod.teaId,
        method: brewingMethod.method,
        temperature: brewingMethod.temperature,
        amountPerHundred: brewingMethod.amountPerHundred,
        brewingTimes: [...brewingMethod.brewingTimes],
        gongfuBrewingTimeIncrement: brewingMethod.gongfuBrewingTimeIncrement ?? ""
    } as BrewingMethodFormData;
}

const validator = (formData: BrewingMethodFormData): boolean => {
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


type BrewingMethodPanelFormProps = {
    teaId?: number;
    initialBrewingMethod?: BrewingMethod;
    onFinish?: () => void
}

const BrewingMethodFormPanel = (props: BrewingMethodPanelFormProps) => {
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
    } = useForm<BrewingMethodFormData, NewBrewingMethod>(validator, converter, emptyFormData, props.initialBrewingMethod ? convertToFormData(props.initialBrewingMethod) : emptyFormData);

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


    return (
        <FormPanel
            details={getDetails()}
            isValid={isValid()}
            isSaving={getIsSaving()}
            onSave={handleSave}
            onFinish={props.onFinish ?? clearForm}
            onClear={formMode === FormMode.Add ? clearForm : undefined}
        >
            <BrewingMethodForm
                formData={formData}
                updateField={updateField}
            />
        </FormPanel>
    )
}

export default BrewingMethodFormPanel
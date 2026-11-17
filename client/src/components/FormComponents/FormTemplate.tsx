import { Grid, TextInput } from "@mantine/core";
import { FormMode, FormPanelDetails } from "../../types/FormDatas";
import FormPanel from "./FormPanel";
import useForm from "../../hooks/useForm";


//CONSTS
const ADD_FORM_PANEL_DETAILS = {
    title: "Dodaj <Object>",
    description: "Uzupełnij informacje o <Object>",
    successMessage: "Poprawnie dodano <Object>!",
    submitLabel: "Dodaj"
} as FormPanelDetails;

const EDIT_FORM_PANEL_DETAILS = {
    title: "Edytuj <Object>",
    description: "Uzupełnij informacje o <Object>",
    successMessage: "Poprawnie edytowano <Object>!",
    submitLabel: "Zapisz zmiany"
} as FormPanelDetails;

// Add all input returns
type FormData = {
    field: string;
}

// Create empty state
const EMPTY_FORM_DATA = {
    field: ""
}

//change <any> to API correct object type
const converter = (formData: FormData): any => {
    return {
        field: formData.field,
    } as any;
}

//Validate if the fields are true - assume normalized data
const validator = (formData: FormData): boolean => {
    return true;
}

type FormTemplateProps = {
    onFinish?: () => void;
    initialObject?: any; // initial API correct object
    additionalArgs?: { // any additional args needed?
        arg: any
    }
}

const FormTemplate = (props: FormTemplateProps) => {
    // const [addAPI, { isLoading: isAdding }] = useAddXYZMutation();
    // const [editAPI, { isLoading: isEditing }] = useEditXYZMutation();

    const formMode = props.initialObject ? FormMode.Edit : FormMode.Add

    const {
        formData,
        updateField,
        clearForm,
        isValid,
        getData
    } = useForm<FormData, any>(validator, converter, EMPTY_FORM_DATA, props.initialObject); //Reokace any for API correct object

    const handleSave = async () => {
        const objectToSave = getData();

        if (objectToSave === null) return;

        switch (formMode) {
            case FormMode.Add:
                //await addAPI(objectToSave).unwrap();
                break;
            case FormMode.Edit:
                //await editAPI({ id: props.initialObject!.id, object: objectToSave }).unwrap();
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
            // return isAdding;
            case FormMode.Edit:
            // return isEditing;
        }
    }

    return (
        <FormPanel
            details={getDetails()}
            isValid={isValid()}
            isSaving={false} // getIsSaving()
            onSave={handleSave}
            onFinish={props.onFinish ?? clearForm}
            onClear={formMode === FormMode.Add ? clearForm : undefined}
        >
            <Grid gap="md">
                {/* Add any needed form inputs */}
                <Grid.Col span={{ base: 12, sm: 12 }}>
                    <TextInput
                        label="Nazwa naczynia"
                        placeholder="Wpisz nazwę..."
                        required
                        value={formData.field}
                        onChange={(event) => { updateField("field", event.currentTarget.value) }}
                    />
                </Grid.Col>
            </Grid>
        </FormPanel>

    )
}

export default FormTemplate
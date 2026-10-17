import BrewingMethodForm from "../FormComponents/BrewingMethodForm";
import useForm from "../../hooks/useForm";
import { BrewingMethodFormData, emptyBrewingMethodFormData } from "../../types/FormDatas";
import { brewingMethodFormValidator } from "../../validators/formValidators";
import { BrewingMethod } from "../../types/BrewingMethod";
import { convertBrewingMethodFormDataToNewBrewingMethod, convertBrewingMethodToBrewingMethodFormData } from "../../utils/utils";
import { useEditBrewingMethodMutation } from "../../services/teaApi";
import FormPanel from "../FormComponents/FormPanel";

const BREWING_EDIT_SUCCESS_MESSAGE = "Poprawnie edytowano sposób parzenia";

type BrewingMethodEditorViewProps = {
    brewingMethod: BrewingMethod;
    onFinish: () => void;
}

const BrewingMethodEditorView = (props: BrewingMethodEditorViewProps) => {
    const startingFormData = convertBrewingMethodToBrewingMethodFormData(props.brewingMethod);

    const {
        formData,
        updateField,
        isValid,
        getData
    } = useForm<BrewingMethodFormData>(brewingMethodFormValidator, emptyBrewingMethodFormData, startingFormData);

    const [editBrewingMethod, {isLoading: isSaving}] = useEditBrewingMethodMutation();

    const handleSave = async () => {
        const brewingMethodToEdit = convertBrewingMethodFormDataToNewBrewingMethod(getData(), props.brewingMethod.teaId);

        if(brewingMethodToEdit === null){
            return;
        }

        await editBrewingMethod({brewingMethodId: props.brewingMethod.id, brewingMethod:brewingMethodToEdit}).unwrap();
    }

    return(
        <FormPanel
            title="Edytuj sposób parzenia"
            description="Uzupełnij informacje o sposobie parzenia"
            successMessage={BREWING_EDIT_SUCCESS_MESSAGE}
            submitLabel="Zapisz zmiany"
            isValid={isValid()}
            isSaving={isSaving}
            onSave={handleSave}
            onFinish={props.onFinish}
       >
            <BrewingMethodForm
                formData={formData}
                updateField={updateField}
            />
       </FormPanel>
    )
};
export default BrewingMethodEditorView;
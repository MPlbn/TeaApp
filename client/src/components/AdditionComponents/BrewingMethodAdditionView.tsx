import useForm from "../../hooks/useForm";
import { BrewingMethodFormData, emptyBrewingMethodFormData } from "../../types/FormDatas";
import { brewingMethodFormValidator } from "../../validators/formValidators";
import { useAddBrewingMethodMutation } from "../../services/teaApi";
import { convertBrewingMethodFormDataToNewBrewingMethod } from "../../utils/utils";
import FormPanel from "../FormComponents/FormPanel";
import BrewingMethodForm from "../FormComponents/BrewingMethodForm";

const BREWING_METHOD_ADD_SUCCESS_MESSAGE = "Poprawnie dodano sposób parzenia!";

type BrewingMethodAdditionViewProps = {
    teaID: number;
    onFinish: () => void;
}

const BrewingMethodAdditionView = (props: BrewingMethodAdditionViewProps) => {
    const {
        formData,
        updateField,
        clearForm,
        isValid,
        getData
    } = useForm<BrewingMethodFormData>(brewingMethodFormValidator, emptyBrewingMethodFormData);

    const [addBrewingMethod, {isLoading: isAdding}] = useAddBrewingMethodMutation();

    const handleSave = async () => {
        const brewingMethodToAdd = convertBrewingMethodFormDataToNewBrewingMethod(getData(), props.teaID)

        if(brewingMethodToAdd === null){
            return;
        }
        await addBrewingMethod(brewingMethodToAdd).unwrap();
    };

    const handleClear = () => {
        clearForm();
    }

    return(
        <FormPanel
            title="Dodaj sposób parzenia"
            description="Uzupełnij informacje o sposobie parzenia"
            successMessage={BREWING_METHOD_ADD_SUCCESS_MESSAGE}
            submitLabel="Dodaj"
            isValid={isValid()}
            isSaving={isAdding}
            onSave={handleSave}
            onFinish={props.onFinish}
            onClear={handleClear}
        >
            <BrewingMethodForm
                formData={formData}
                updateField={updateField}
            />
        </FormPanel>
    );
}
export default BrewingMethodAdditionView;
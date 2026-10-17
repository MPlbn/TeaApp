import useForm from "../../hooks/useForm";
import { useAddTeaMutation } from "../../services/teaApi";
import { emptyTeaFormData, TeaFormData } from "../../types/FormDatas";
import { convertTeaFormDataToNewTea } from "../../utils/utils";
import { teaFormValidator } from "../../validators/formValidators";
import TeaForm from "../FormComponents/TeaForm";
import FormPanel from "../FormComponents/FormPanel";

const TEA_ADD_SUCCESS_MESSAGE = "Poprawnie dodano herbatę!";

const TeaAdditionView = () => {
    const {
        formData,
        updateField,
        clearForm,
        isValid,
        getData
    } = useForm<TeaFormData>(teaFormValidator, emptyTeaFormData);

    const [addTea, {isLoading: isAdding}] = useAddTeaMutation();

    const handleSave = async () => {
        const teaToAdd = convertTeaFormDataToNewTea(getData());

        if(teaToAdd === null){
            return;
        }
        await addTea(teaToAdd).unwrap();
    }
      
    const handleClear = () => {
        clearForm();
    }

    return (
        <FormPanel
            title="Dodaj recenzję"
            description="Uzupełnij informacje o recenzji"
            successMessage={TEA_ADD_SUCCESS_MESSAGE}
            submitLabel="Dodaj"
            isValid={isValid()}
            isSaving={isAdding}
            onSave={handleSave}
            onFinish={handleClear}
            onClear={handleClear}
        >
            <TeaForm
                formData={formData}
                updateField={updateField}
            />
        </FormPanel>
    )
}
export default TeaAdditionView;
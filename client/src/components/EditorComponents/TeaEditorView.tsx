import { Tea } from "../../types/Tea";
import { convertTeaFormDataToNewTea, convertTeaToTeaFormData } from "../../utils/utils";
import { teaFormValidator } from "../../validators/formValidators";
import { emptyTeaFormData } from "../../types/FormDatas";
import useForm from "../../hooks/useForm";
import { useEditTeaMutation } from "../../services/teaApi";
import { TeaFormData } from "../../types/FormDatas";
import TeaForm from "../FormComponents/TeaForm";
import FormPanel from "../FormComponents/FormPanel";

const TEA_EDIT_SUCCESS_MESSAGE = "Poprawnie edytowano herbatę!";


type TeaEditorViewProps = {
    tea: Tea;
    onFinish: () => void;
};

const TeaEditorView = (props: TeaEditorViewProps) => { 
    const startingFormData = convertTeaToTeaFormData(props.tea);

    const {
        formData,
        updateField,
        isValid,
        getData
    } = useForm<TeaFormData>(teaFormValidator, emptyTeaFormData, startingFormData);

    const [editTea, {isLoading: isSaving}] = useEditTeaMutation();

    const handleSave = async () => {
        const teaToEdit = convertTeaFormDataToNewTea(getData());

        if(teaToEdit === null){
            return;
        }

        await editTea({teaId: props.tea.id, tea: teaToEdit}).unwrap();
    }

    return(
        <FormPanel
            title="Edytuj herbatę"
            description="Uzupełnij informacje o herbacie"
            successMessage={TEA_EDIT_SUCCESS_MESSAGE}
            submitLabel="Zapisz zmiany"
            isValid={isValid()}
            isSaving={isSaving}
            onSave={handleSave}
            onFinish={props.onFinish}
       >
            <TeaForm
                formData={formData}
                updateField={updateField}
            />
       </FormPanel>
    );
};
export default TeaEditorView;
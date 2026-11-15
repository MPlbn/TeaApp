import useForm from '../../hooks/useForm';
import { emptyTeaWareFromData, TeaWareFormData } from '../../types/FormDatas';
import { useAddTeaWareMutation } from '../../services/teaApi';
import TeaWareForm from '../FormComponents/TeaWareForm';
import FormPanel from '../FormComponents/FormPanel';
import { teaWareFormValidator } from '../../validators/formValidators';
import { convertTeaWareFormDataToNewTeaWare } from '../../utils/utils';

const TEAWARE_ADD_SUCCESS_MESSAGE = "Poprawnie dodano naczynie!";

type TeaWareAdditionViewProps = {
    onFinish: () => void;
}

const TeaWareAdditionView = (props: TeaWareAdditionViewProps) => {

    const {
        formData,
        updateField,
        clearForm,
        isValid,
        getData
    } = useForm<TeaWareFormData>(teaWareFormValidator, emptyTeaWareFromData);

    const [addTeaWare, { isLoading: isSaving }] = useAddTeaWareMutation();

    const handleSave = async () => {
        const teaWareToAdd = convertTeaWareFormDataToNewTeaWare(getData());

        if (teaWareToAdd === null) return;

        await addTeaWare(teaWareToAdd).unwrap();
    }

    const handleClear = () => { clearForm(); }

    return (
        <FormPanel
            title='Dodaj naczynie'
            description='Uzupełnij informacje o naczyniu'
            successMessage={TEAWARE_ADD_SUCCESS_MESSAGE}
            submitLabel='Dodaj'
            isValid={isValid()}
            isSaving={isSaving}
            onSave={handleSave}
            onFinish={props.onFinish}
            onClear={handleClear}
        >
            <TeaWareForm
                formData={formData}
                updateField={updateField}
            />
        </FormPanel>
    )
}

export default TeaWareAdditionView
import useForm from '../../hooks/useForm';
import { emptyTeaWareFromData, TeaWareFormData } from '../../types/FormDatas';
import { NewTeaWare, useEditTeaWareMutation } from '../../services/teaApi';
import TeaWareForm from '../FormComponents/TeaWareForm';
import FormPanel from '../FormComponents/FormPanel';
import { teaWareFormValidator } from '../../validators/formValidators';
import { TeaWare } from '../../types/TeaWare';
import { convertTeaWareFormDataToNewTeaWare } from '../../utils/utils';

const TEAWARE_EDIT_SUCCESS_MESSAGE = "Poprawnie edytowano naczynie!";

type TeaWareEditorViewProps = {
    teaWare: TeaWare;
    onFinish: () => void;
}

const TeaWareEditorView = (props: TeaWareEditorViewProps) => {
    const startingFormData = {
        name: props.teaWare.name,
        capacity: props.teaWare.capacity
    } as TeaWareFormData;

    const {
        formData,
        updateField,
        isValid,
        getData
    } = useForm<TeaWareFormData>(teaWareFormValidator, emptyTeaWareFromData, startingFormData);

    const [editTeaWare, { isLoading: isEditing }] = useEditTeaWareMutation();

    const handleEdit = async () => {
        const teaWareToEdit = convertTeaWareFormDataToNewTeaWare(getData());

        if (teaWareToEdit === null) return;

        await editTeaWare({ id: props.teaWare.id, teaWare: teaWareToEdit }).unwrap();
    }

    return (
        <FormPanel
            title='Edytuj naczynie'
            description='Uzupełnij informacje o naczyniu'
            successMessage={TEAWARE_EDIT_SUCCESS_MESSAGE}
            submitLabel='Zapisz zmiany'
            isValid={isValid()}
            isSaving={isEditing}
            onSave={handleEdit}
            onFinish={props.onFinish}
        >
            <TeaWareForm
                formData={formData}
                updateField={updateField}
            />
        </FormPanel>
    )
}

export default TeaWareEditorView
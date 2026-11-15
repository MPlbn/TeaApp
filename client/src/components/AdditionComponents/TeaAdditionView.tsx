import useForm from "../../hooks/useForm";
import { useAddTeaMutation } from "../../services/teaApi";
import { emptyTeaFormData, TeaFormData } from "../../types/FormDatas";
import { convertTeaFormDataToNewTea } from "../../utils/utils";
import { teaFormValidator } from "../../validators/formValidators";
import TeaForm from "../FormComponents/TeaForm";
import FormPanel from "../FormComponents/FormPanel";
import { useAppSelector } from "../../store/hooks";
import { useState } from "react";
import { CollectionType } from "../../types/enums";

const TEA_ADD_SUCCESS_MESSAGE = "Poprawnie dodano herbatę!";


const TeaAdditionView = () => {
    const user = useAppSelector((state) => state.auth.user);

    const [collectionType, setCollectionType] = useState<CollectionType | null>(null);

    const {
        formData,
        updateField,
        clearForm,
        isValid,
        getData
    } = useForm<TeaFormData>(teaFormValidator, emptyTeaFormData);

    const [addTea, { isLoading: isAdding }] = useAddTeaMutation();

    const handleSave = async () => {
        const teaToAdd = convertTeaFormDataToNewTea(getData(), collectionType === CollectionType.Public);

        if (teaToAdd === null) {
            return;
        }

        await addTea(teaToAdd).unwrap();
    }

    const handleClear = () => {
        clearForm();
    }

    return (
        <FormPanel
            title="Dodaj herbatę"
            description="Uzupełnij informacje o herbacie"
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
                user={user}
                collectionType={collectionType}
                setCollectionType={setCollectionType}
            />
        </FormPanel>
    )
}
export default TeaAdditionView;
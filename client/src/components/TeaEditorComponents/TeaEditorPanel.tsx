import useForm from "../../hooks/useForm";
import { emptyTeaFormData, TeaFormData } from "../../types/FormDatas";
import { editTea } from "../../services/teaService";
import { 
    Title,
    Stack,
    Text,
    Button,
    Group,
    Paper
} from "@mantine/core";
import TeaForm from "../FormComponents/TeaForm";
import { useState } from "react";
import { Tea } from "../../types/Tea";
import { convertTeaToTeaFormData } from "../../utils/utils";
import { teaFormValidator } from "../../validators/formValidators";
import { useAppDispatch } from "../../store/hooks";
import { openInfoModal } from "../../store/uiSlice";

const TEA_EDIT_FAIL_MESSAGE = "Nie udało się edytować herbaty.";
const TEA_EDIT_SUCCESS_MESSAGE = "Poprawnie edytowano herbatę!";


type TeaEditorPanelProps = {
    tea: Tea;
    onFinish: () => void;
};

const TeaEditorPanel = (props: TeaEditorPanelProps) => { 
    const dispatch = useAppDispatch();

    const startingFormData = convertTeaToTeaFormData(props.tea);

    const {
        formData,
        updateField,
        isValid,
        getData
    } = useForm<TeaFormData>(teaFormValidator, emptyTeaFormData, startingFormData);

    const [isSaving, setIsSaving] = useState(false);

    const handleEdit = async () => {
        if (!isValid()){
            return;
        }

        const tea = getData();

        if(tea.type === null){
            return;
        }

        const teaToEdit = {
            ...tea,
            price: tea.price === '' ? null : Number(tea.price),
            type: tea.type
        }

        setIsSaving(true);

        try {
            await editTea(props.tea.id, teaToEdit);
            dispatch(openInfoModal({
                message: TEA_EDIT_SUCCESS_MESSAGE
            }));
        } catch (error) {
            dispatch(openInfoModal({
                message: error instanceof Error ? error.message : TEA_EDIT_FAIL_MESSAGE
            }));
        } finally {
            setIsSaving(false);
            props.onFinish();
        }
    }

    return(
        <Stack>
            <div>
                <Title order={1}>Edytuj herbatę</Title>
                <Text c="dimmed" mt="xs">
                    Uzupełnij informacje o nowej herbacie.
                </Text>
            </div>

            <Paper withBorder p="lg" radius="md">
                <Stack gap="md">
                    <TeaForm formData={formData} updateField={updateField}/>
                    <Group justify='flex-end' mt="sm">
                        <Button 
                            variant='gradient'
                            onClick={handleEdit} 
                            disabled={!isValid() || isSaving}
                            loading={isSaving}
                        >
                            Zapisz zmiany
                        </Button>
                    </Group>
                </Stack>
            </Paper>       
        </Stack>
    );
};
export default TeaEditorPanel;
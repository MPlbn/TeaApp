import { useState } from "react";
import { 
    Stack,
    Modal,
    Center,
    Group,
    Button,
    Title,
    Text,
    Paper
} from "@mantine/core";
import TeaForm from "../FormComponents/TeaForm";
import useForm from "../../hooks/useForm";
import { emptyTeaFormData, TeaFormData } from "../../types/FormDatas";
import { teaFormValidator } from "../../validators/formValidators";
import { openInfoModal } from "../../store/uiSlice";
import { useAddTeaMutation } from "../../services/teaApi";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { useAppDispatch } from "../../store/hooks";

const TEA_ADD_SUCCESS_MESSAGE = "Poprawnie dodano herbatę!";

const TeaAdditionPanel = () => {
    const dispatch = useAppDispatch();
    
    const {
        formData,
        updateField,
        clearForm,
        isValid,
        getData
    } = useForm<TeaFormData>(teaFormValidator, emptyTeaFormData);

    const[addTea, {isLoading: isAdding}] = useAddTeaMutation();

    const handleAdd = async () => {
        if (!isValid()){
            return;
        }

        const tea = getData();

        if(tea.type === null) {
            return;
        }

        const teaToAdd = {
            ...tea,
            price: tea.price === '' ? null : Number(tea.price),
            type: tea.type
        };

        try {
            await addTea(teaToAdd).unwrap();
            clearForm();
            dispatch(openInfoModal({
                message: TEA_ADD_SUCCESS_MESSAGE
            }))
        } catch (error) {
            dispatch(openInfoModal({
                message: getApiErrorMessage(error)
            }));
        }
    }
      
    const handleClear = () => {
        clearForm();
    }

    return (
        <Stack gap="xl">

            <div>
                <Title order={1}>Dodaj herbatę</Title>
                <Text c="dimmed" mt="xs">
                    Uzupełnij informacje o nowej herbacie.
                </Text>
            </div>

            <Paper withBorder p="lg" radius="md">
                <Stack gap="md">
                    <TeaForm
                        formData={formData}
                        updateField={updateField}
                    />
                    <Group justify='flex-end' mt="sm">
                        <Button 
                            variant='default' 
                            onClick={handleClear}
                            disabled={isAdding}
                            loading={isAdding}    
                        >
                            Wyczyść
                        </Button>
                        <Button 
                            variant='gradient'
                            onClick={handleAdd} 
                            disabled={!isValid() || isAdding}
                            loading={isAdding}
                        >
                            Dodaj
                        </Button>
                    </Group>

                </Stack>
            </Paper>

        </Stack>
    )
}
export default TeaAdditionPanel;
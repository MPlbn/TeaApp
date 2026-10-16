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
import { addTea } from "../../services/teaService";
import { emptyTeaFormData, TeaFormData } from "../../types/FormDatas";
import { teaFormValidator } from "../../validators/formValidators";

const TeaAdditionPanel = () => {
    const {
        formData,
        updateField,
        clearForm,
        isValid,
        getData
    } = useForm<TeaFormData>(teaFormValidator, emptyTeaFormData);
    //Modal
    const [isInfoPopupModalOpen, setIsInfoPopupModalOpen] = useState(false);
    const [infoPopupModalMessage, setInfoPopupModalMessage] = useState('');

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
            await addTea(teaToAdd);

            clearForm();
    
            setInfoPopupModalMessage('Poprawnie dodano herbatę!');
        } catch (error) {
            setInfoPopupModalMessage(error instanceof Error ? `Nie udało się dodać herbaty: ${error.message}` : `Wystąpił nieznany błąd`);
        }
        
        setIsInfoPopupModalOpen(true);
    }

    
        
    const handleClear = () => {
        clearForm();
    }

    return (
        <Stack gap="xl">
            <Modal
                opened={isInfoPopupModalOpen}
                onClose={() => setIsInfoPopupModalOpen(false)}
                title=""
                centered
                withCloseButton={false}
                closeOnClickOutside={false}
                closeOnEscape={false}
            >
                <Stack gap="md">
                    <Center>
                        <Text>{infoPopupModalMessage}</Text>
                    </Center>

                    <Group variant='gradient' justify='center'>
                        <Button
                            onClick={() => setIsInfoPopupModalOpen(false)}
                        >
                            OK
                        </Button>
                    </Group>
                </Stack>
            </Modal>

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
                        <Button variant='default' onClick={handleClear}>Clear</Button>
                        <Button 
                            variant='gradient'
                            onClick={handleAdd} 
                            disabled={!isValid()}
                        >
                            Add
                        </Button>
                    </Group>

                </Stack>
            </Paper>

        </Stack>
    )
}
export default TeaAdditionPanel;
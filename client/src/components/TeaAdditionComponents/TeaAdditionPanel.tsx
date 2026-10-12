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
import TeaAdditionForm from "./TeaAdditionForm";
import useAddTeaForm from "../../hooks/useTeaAdditionForm";
import { addTea } from "../../services/teaService";

const TeaAdditionPanel = () => {
    const {
        formData,
        updateField,
        clearForm,
        isValid,
        getTeaData
    } = useAddTeaForm();
    //Modal
    const [isInfoPopupModalOpen, setIsInfoPopupModalOpen] = useState(false);
    const [infoPopupModalMessage, setInfoPopupModalMessage] = useState('');

    const handleAdd = async () => {
        if (!isValid()){
            return;
        }

        const tea = getTeaData();

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
            setIsInfoPopupModalOpen(true);
        } catch (error) {
            setInfoPopupModalMessage(error instanceof Error ? `Nie udało się dodać herbaty: ${error.message}` : `Wystąpił nieznany błąd`);
        }
        
        setIsInfoPopupModalOpen(true);
    }

    
        
    function handleClear(){
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
                    <TeaAdditionForm
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
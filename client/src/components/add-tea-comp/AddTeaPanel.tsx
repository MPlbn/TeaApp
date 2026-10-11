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
import AddTeaForm from "./AddTeaForm";
import useAddTeaForm from "../../hooks/useAddTeaForm";

export default function AddTeaPanel() {
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

    function handleAdd(){
        if (!isValid()){
            return;
        }

        const tea = getTeaData();

        const teaToAdd = {
            ...tea,
            price: tea.price === '' ? null : Number(tea.price)
        };

        console.log('Herbata do dodania:', teaToAdd);

        clearForm();

        setInfoPopupModalMessage('Poprawnie dodano herbatę!');
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
                    <AddTeaForm
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

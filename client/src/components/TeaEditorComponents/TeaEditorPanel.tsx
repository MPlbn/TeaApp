import useTeaForm from "../../hooks/useTeaForm";
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
import { useEffect, useState } from "react";
import { Tea } from "../../types/Tea";

type TeaEditorPanelProps = {
    tea: Tea;
    onSuccess: () => void;
};

const TeaEditorPanel = (props: TeaEditorPanelProps) => {
    const {
        formData,
        updateField,
        setFormValues,
        isValid,
        getTeaData
    } = useTeaForm(); //initial data

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // useEffect(() => {
    //     setFormValues({

    //     });
    // });

    async function handleEdit() {
        if (!isValid()){
            return;
        }

        const tea = getTeaData();

        if(tea.type === null){
            return;
        }

        const teaToEdit = {
            ...tea,
            price: tea.price === '' ? null : Number(tea.price),
            type: tea.type
        }

        setIsSaving(true);
        setError(null)

        try {
            await editTea(props.tea.id, teaToEdit);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Nie udało się edytować herbaty.");
        } finally {
            setIsSaving(false);
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
                    <TeaForm
                        formData={formData}
                        updateField={updateField}
                    />

                    {error && <Text c="red">{error}</Text>}

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
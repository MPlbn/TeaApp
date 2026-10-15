import useForm from "../../hooks/useForm";
import { addBrewing } from "../../services/teaService";
import { emptyBrewingMethodFormData, BrewingMethodFormData } from "../../types/FormDatas";
import { convertBrewingMethodFormDataToNewBrewingMethod } from "../../utils/utils";
import { brewingMethodFormValidator } from "../../validators/formValidators";
import { useState } from "react";
import BrewingMethodForm from "../FormComponents/BrewingMethodForm";
import { Button, Group, Stack, Paper, Title, Text } from "@mantine/core";

type BrewingMethodAdditionPanelProps = {
    teaID: number;
    onSuccess: () => void;
}
const BrewingMethodAdditionPanel = (props: BrewingMethodAdditionPanelProps) => {

    const {
        formData,
        updateField,
        clearForm,
        isValid,
        getData
    } = useForm<BrewingMethodFormData>(emptyBrewingMethodFormData, emptyBrewingMethodFormData, brewingMethodFormValidator);

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAdd = async () => {
        if(isValid()){
            return;
        }

        const brewingMethod = getData();
        const brewingMethodToAdd = convertBrewingMethodFormDataToNewBrewingMethod(brewingMethod, props.teaID);

        if(brewingMethodToAdd === null) {
            setError("Sprawdź poprawność danych sposobu parzenia")
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            await addBrewing(brewingMethodToAdd);
            props.onSuccess();
        } catch (error) {
            setError(error instanceof Error ? error.message : "Nie udało się dodać sposobu parzenia");
        } finally {
            setIsSaving(false);
        }
        props.onSuccess();
    }

    const handleClear = () => {
        clearForm();
    }

    return(
        <Stack>
            <div>
                <Title order={1}>Dodaj sposób parzenia</Title>
                <Text c="dimmed" mt="xs">
                    Uzupełnij informacje o nowym sposobie parzenia.
                </Text>
            </div>

            <Paper withBorder p="lg" radius="md">
                <Stack gap="md">
                    <BrewingMethodForm formData={formData} updateField={updateField}/>
                    <Group justify="flex-end" mt="sm">
                        <Button variant="default" onClick={handleClear}>Wyczyść</Button>
                        <Button variant="gradient" onClick={handleAdd} disabled={!isValid}>Dodaj</Button>
                    </Group>
                </Stack>
            </Paper>
        </Stack>
    );
};
export default BrewingMethodAdditionPanel;
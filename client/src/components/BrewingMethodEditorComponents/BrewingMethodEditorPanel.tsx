import { Paper, Text, Title, Button, Group, Stack } from "@mantine/core";
import BrewingMethodForm from "../FormComponents/BrewingMethodForm";
import useForm from "../../hooks/useForm";
import { BrewingMethodFormData, emptyBrewingMethodFormData } from "../../types/FormDatas";
import { brewingMethodFormValidator } from "../../validators/formValidators";
import { BrewingMethod } from "../../types/BrewingMethod";
import { convertBrewingMethodFormDataToNewBrewingMethod, convertBrewingMethodToBrewingMethodFormData } from "../../utils/utils";
import { useState } from "react";
import { editBrewingMethod } from "../../services/teaService";


// ID needed - whole BrewingMethod
type BrewingMethodEditorPanelProps = {
    brewingMethod: BrewingMethod;
}

const BrewingMethodEditorPanel = (props: BrewingMethodEditorPanelProps) => {
    const startingFormData = convertBrewingMethodToBrewingMethodFormData(props.brewingMethod)

    const {
        formData,
        updateField,
        isValid,
        getData
    } = useForm<BrewingMethodFormData>(emptyBrewingMethodFormData, startingFormData, brewingMethodFormValidator)

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const handleEdit = async () => {
        if(!isValid()){
            return;
        }

        const brewingMethod = getData();
        const teaID = brewingMethod.teaID
        if(teaID === null){
            return;
        }

        const brewingMethodToEdit = convertBrewingMethodFormDataToNewBrewingMethod(brewingMethod, teaID);
        if(brewingMethodToEdit === null){
            return;
        }

        setIsSaving(true);
        setError(null)

        try {
            await editBrewingMethod(props.brewingMethod.id, brewingMethodToEdit);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Nie udało się edytować sposobu parzenia.");
        } finally {
            setIsSaving(false);
        }

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
                    {error && <Text c="red">{error}</Text>}
                    <Group justify="flex-end" mt="sm">
                        <Button 
                        variant="gradient" 
                        onClick={handleEdit} 
                        disabled={!isValid || isSaving} 
                        loading={isSaving}
                        >
                            Zapisz zmiany
                        </Button>
                    </Group>
                </Stack>
            </Paper>
        </Stack>
    )
};
export default BrewingMethodEditorPanel;
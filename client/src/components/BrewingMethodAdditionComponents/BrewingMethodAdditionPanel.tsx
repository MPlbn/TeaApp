import useForm from "../../hooks/useForm";
import { addBrewing } from "../../services/teaService";
import { emptyBrewingMethodFormData, BrewingMethodFormData } from "../../types/FormDatas";
import { convertBrewingMethodFormDataToNewBrewingMethod } from "../../utils/utils";
import { brewingMethodFormValidator } from "../../validators/formValidators";
import { useState } from "react";
import BrewingMethodForm from "../FormComponents/BrewingMethodForm";
import { Button, Group, Stack, Paper, Title, Text } from "@mantine/core";
import { useAppDispatch } from "../../store/hooks";
import { openInfoModal } from "../../store/uiSlice";

const BREWING_ADD_SUCCESS_MESSAGE = "Poprawnie dodano sposób parzenia!";
const BREWING_ADD_FAIL_MESSAGE = "Nie udało się dodać sposobu parzenia";
const BREWING_INVALID_FORM_DATA = "Niepoprawne dane formularza...";
const BREWING_INVALID_METHOD_TYPE = "Sprawdź poprawność danych sposobu parzenia";

type BrewingMethodAdditionPanelProps = {
    teaID: number;
    onFinish: () => void;
}
const BrewingMethodAdditionPanel = (props: BrewingMethodAdditionPanelProps) => {
    const dispatch = useAppDispatch();

    const {
        formData,
        updateField,
        clearForm,
        isValid,
        getData
    } = useForm<BrewingMethodFormData>(brewingMethodFormValidator, emptyBrewingMethodFormData);

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAdd = async () => {
        formData.teaId = props.teaID;

        if(!isValid()){
            setError(BREWING_INVALID_FORM_DATA);
            return;
        }


        const brewingMethodToAdd = convertBrewingMethodFormDataToNewBrewingMethod(getData(), props.teaID);

        if(brewingMethodToAdd === null) {
            setError(BREWING_INVALID_METHOD_TYPE);
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            await addBrewing(brewingMethodToAdd);
            dispatch(openInfoModal({
                message: BREWING_ADD_SUCCESS_MESSAGE
            }));
        } catch (error) {
            dispatch(openInfoModal({
                message: error instanceof Error ? error.message : BREWING_ADD_FAIL_MESSAGE
            }));
        } finally {
            setIsSaving(false);
            props.onFinish();
        }
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
                    {error && <Text c="red">{error}</Text>}
                    <Group justify="flex-end" mt="sm">
                        <Button variant="default" onClick={handleClear}>Wyczyść</Button>
                        <Button variant="gradient" onClick={handleAdd} disabled={!isValid || isSaving} loading={isSaving}>Dodaj</Button>
                    </Group>
                </Stack>
            </Paper>
        </Stack>
    );
};
export default BrewingMethodAdditionPanel;
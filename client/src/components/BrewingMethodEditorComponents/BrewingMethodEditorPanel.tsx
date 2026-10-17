import { Paper, Text, Title, Button, Group, Stack } from "@mantine/core";
import BrewingMethodForm from "../FormComponents/BrewingMethodForm";
import useForm from "../../hooks/useForm";
import { BrewingMethodFormData, emptyBrewingMethodFormData } from "../../types/FormDatas";
import { brewingMethodFormValidator } from "../../validators/formValidators";
import { BrewingMethod } from "../../types/BrewingMethod";
import { convertBrewingMethodFormDataToNewBrewingMethod, convertBrewingMethodToBrewingMethodFormData } from "../../utils/utils";
import { useAppDispatch } from "../../store/hooks";
import { openInfoModal } from "../../store/uiSlice";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { useEditBrewingMethodMutation } from "../../services/teaApi";

const BREWING_EDIT_SUCCESS_MESSAGE = "Poprawnie edytowano sposób parzenia";

type BrewingMethodEditorPanelProps = {
    brewingMethod: BrewingMethod;
    onFinish: () => void;
}

const BrewingMethodEditorPanel = (props: BrewingMethodEditorPanelProps) => {
    const dispatch = useAppDispatch();
    const startingFormData = convertBrewingMethodToBrewingMethodFormData(props.brewingMethod);

    const {
        formData,
        updateField,
        isValid,
        getData
    } = useForm<BrewingMethodFormData>(brewingMethodFormValidator, emptyBrewingMethodFormData, startingFormData);

    const [editBrewingMethod, {isLoading: isSaving}] = useEditBrewingMethodMutation();


    const handleEdit = async () => {
        if(!isValid()){
            return;
        }

        const brewingMethodToEdit = convertBrewingMethodFormDataToNewBrewingMethod(getData(), props.brewingMethod.teaId);
        
        if(brewingMethodToEdit === null){
            return;
        }

        try {
            await editBrewingMethod({brewingMethodId: props.brewingMethod.id, brewingMethod: brewingMethodToEdit}).unwrap();
            dispatch(openInfoModal({
                message: BREWING_EDIT_SUCCESS_MESSAGE
            })); 
            props.onFinish();
        } catch (error) {
            dispatch(openInfoModal({
                message: getApiErrorMessage(error)
            })); 
        }
    }

    return(
        <Stack>
            <div>
                <Title order={1}>Edytuj sposób parzenia</Title>
                <Text c="dimmed" mt="xs">
                    Uzupełnij informacje o nowym sposobie parzenia.
                </Text>
            </div>

            <Paper withBorder p="lg" radius="md">
                <Stack gap="md">
                    <BrewingMethodForm formData={formData} updateField={updateField}/>
                    <Group justify="flex-end" mt="sm">
                        <Button 
                            variant="gradient" 
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
    )
};
export default BrewingMethodEditorPanel;
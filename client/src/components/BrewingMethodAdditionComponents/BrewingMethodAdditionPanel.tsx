import useForm from "../../hooks/useForm";
import { emptyBrewingMethodFormData, BrewingMethodFormData } from "../../types/FormDatas";
import { convertBrewingMethodFormDataToNewBrewingMethod } from "../../utils/utils";
import { brewingMethodFormValidator } from "../../validators/formValidators";
import { useState } from "react";
import BrewingMethodForm from "../FormComponents/BrewingMethodForm";
import { Button, Group, Stack, Paper, Title, Text } from "@mantine/core";
import { useAppDispatch } from "../../store/hooks";
import { openInfoModal } from "../../store/uiSlice";
import { useAddBrewingMethodMutation } from "../../services/teaApi";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

const BREWING_ADD_SUCCESS_MESSAGE = "Poprawnie dodano sposób parzenia!";

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

    const [addBrewingMethod, {isLoading: isAdding}] = useAddBrewingMethodMutation();

    const handleAdd = async () => {
        formData.teaId = props.teaID; // useless?? Test TODO

        if(!isValid()){
            return;
        }

        const brewingMethodToAdd = convertBrewingMethodFormDataToNewBrewingMethod(getData(), props.teaID);

        if(brewingMethodToAdd === null) {
            return;
        }

        try {
            await addBrewingMethod(brewingMethodToAdd).unwrap();
            props.onFinish();
            dispatch(openInfoModal({
                message: BREWING_ADD_SUCCESS_MESSAGE
            }));
        } catch (error) {
            dispatch(openInfoModal({
                message: getApiErrorMessage(error)
            }));
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
                    <Group justify="flex-end" mt="sm">
                        <Button 
                            variant="default" 
                            onClick={handleClear} 
                            disabled={isAdding} 
                            loading={isAdding}
                        >
                            Wyczyść
                        </Button>
                        <Button 
                            variant="gradient" 
                            onClick={handleAdd} 
                            disabled={!isValid || isAdding} 
                            loading={isAdding}
                        >
                            Dodaj
                        </Button>
                    </Group>
                </Stack>
            </Paper>
        </Stack>
    );
};
export default BrewingMethodAdditionPanel;
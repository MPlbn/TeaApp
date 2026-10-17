import { Button, Group, Paper, Stack, Text, Modal } from "@mantine/core";
import { BrewingMethod } from "../../../types/BrewingMethod";
import { getMethodTypeStringVersion } from "../../../utils/utils";
import { useState } from "react";
import BrewingMethodEditorView from "../../BrewingMethodEditorComponents/BrewingMethodEditorView";
import { useAppDispatch } from "../../../store/hooks";
import { openInfoModal } from "../../../store/uiSlice";
import { useDeleteBrewingMethodMutation } from "../../../services/teaApi";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

const DELETE_SUCCESS_MESSAGE = "Poprawnie usunięto sposób parzenia";

type TeaDetailsBrewingMethodProps = {
    brewingMethod: BrewingMethod;
};

const TeaDetailsBrewingMethod = (props: TeaDetailsBrewingMethodProps) => {
    const dispatch = useAppDispatch();
    const [isBrewingMethodEditorOpen, setIsBrewingMethodEditorOpen] = useState(false);
    const [deleteBrewingMethod, {isLoading: isDeleting}] = useDeleteBrewingMethodMutation();

    const handleDelete = async () => {
        try {
            await deleteBrewingMethod(props.brewingMethod.id).unwrap();
            dispatch(openInfoModal({
                message: DELETE_SUCCESS_MESSAGE
            }));           
        } catch (error) {
            dispatch(openInfoModal({
                message: getApiErrorMessage(error)
            })); 
        }
    };
    
    return(
        <>
        <Paper withBorder radius="md">
            <Stack>
                <Stack>
                    <Text c="dimmed">Rodzaj parzenia</Text>
                    <Text>{getMethodTypeStringVersion(props.brewingMethod.method)}</Text>
                </Stack>

                <Stack>
                    <Text c="dimmed">Temperatura parzenia</Text>
                    <Text>{props.brewingMethod.temperature} °C</Text>
                </Stack>
                <Stack>
                    <Text c="dimmed">Czasy parzenia</Text>
                    <Group>
                        {props.brewingMethod.brewingTimes.map((brewingTime, index) => 
                            (<Text key={index}>{brewingTime}{"s"}{index < props.brewingMethod.brewingTimes.length - 1 && " ->"}</Text>))}
                    </Group>
                </Stack>
                <Stack>
                    <Text c="dimmed">Gongfu increment</Text>
                    <Text>{props.brewingMethod.gongfuBrewingTimeIncrement}</Text>
                </Stack>
            </Stack>
            <Group>
                <Button onClick={() => setIsBrewingMethodEditorOpen(true)}>Edytuj</Button>
                <Button c="red" onClick={handleDelete}>Usuń</Button>
            </Group>
        </Paper>

        <Modal
            opened={isBrewingMethodEditorOpen}
            onClose={() => setIsBrewingMethodEditorOpen(false)}
            title=""
            centered
            closeOnClickOutside={false}
            closeOnEscape={false}
        >
            <BrewingMethodEditorView brewingMethod={props.brewingMethod} onFinish={() => setIsBrewingMethodEditorOpen(false)}/>
        </Modal>
        </>
    );
};
export default TeaDetailsBrewingMethod;
import { Button, Group, Paper, Stack, Text, Modal } from "@mantine/core";
import { BrewingMethod } from "../../types/BrewingMethod";
import { getMethodTypeStringVersion } from "../../utils/utils";
import { useState } from "react";
import BrewingMethodEditorView from "../BrewingMethodEditorComponents/BrewingMethodEditorView";

type TeaDetailsBrewingMethodProps = {
    brewingMethod: BrewingMethod;
    onSuccess: () => void;
};

const TeaDetailsBrewingMethod = (props: TeaDetailsBrewingMethodProps) => {
    const handleDelete = (id: number) => {
        
    };
    
    const handleEditSuccess = () => {
        props.onSuccess();
        setIsBrewingMethodEditorOpen(false);
    }

    const [isBrewingMethodEditorOpen, setIsBrewingMethodEditorOpen] = useState(false);


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
                <Button c="red" onClick={() => handleDelete(props.brewingMethod.id)}>Usuń</Button>
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
            <BrewingMethodEditorView brewingMethod={props.brewingMethod} onSuccess={handleEditSuccess}/>
        </Modal>
        </>
    );
};
export default TeaDetailsBrewingMethod;
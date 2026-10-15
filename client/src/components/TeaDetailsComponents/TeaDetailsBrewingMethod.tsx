import { Button, Group, Paper, Stack, Text } from "@mantine/core";
import { BrewingMethod } from "../../types/BrewingMethod";
import { getMethodTypeStringVersion } from "../../utils/utils";

type TeaDetailsBrewingMethodProps = {
    brewingMethod: BrewingMethod,
    handleEdit: (brewingMethodId: number) => undefined;
    handleDelete: (brewingMethodId: number) => undefined;
};

const TeaDetailsBrewingMethod = (props: TeaDetailsBrewingMethodProps) => {
    
    return(
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
                        {props.brewingMethod.brewingTimes.map((brewingTime, index) => (<Text key={index}>{brewingTime}</Text>))}
                    </Group>
                </Stack>
                <Stack>
                    <Text c="dimmed">Gongfu increment</Text>
                    <Text>{props.brewingMethod.gongfuBrewingTimeIncrement}</Text>
                </Stack>
            </Stack>
            <Group>
                <Button onClick={props.handleEdit(props.brewingMethod.id)}>Edytuj</Button>
                <Button c="red" onClick={props.handleDelete(props.brewingMethod.id)}>Usuń</Button>
            </Group>
        </Paper>
    );
};
export default TeaDetailsBrewingMethod;
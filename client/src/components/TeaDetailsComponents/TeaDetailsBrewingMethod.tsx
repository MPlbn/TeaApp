import { Button, Group, Paper, Stack, Text } from "@mantine/core";
import { BrewingMethod } from "../../types/BrewingMethod";

type TeaDetailsBrewingMethodProps = {
    brewingMethod: BrewingMethod,
    handleEdit: (brewingMethodId: number) => undefined;
    handleDelete: (brewingMethodId: number) => undefined;
};

const TeaDetailsBrewingMethod = (props: TeaDetailsBrewingMethodProps) => {
    
    return(
        <Paper withBorder radius="md">
            <Stack>
                <Text>{props.brewingMethod.teaID}</Text>
                <Text>{props.brewingMethod.method}</Text>
                <Text>{props.brewingMethod.temperature}</Text>
                <Text>{props.brewingMethod.brewingTimes}</Text>
                <Text>{props.brewingMethod.gongfuBrewingTimeIncrement}</Text>
            </Stack>
            <Group>
                <Button onClick={props.handleEdit(props.brewingMethod.id)}>Edytuj</Button>
                <Button c="red" onClick={props.handleDelete(props.brewingMethod.id)}>Usuń</Button>
            </Group>
        </Paper>
    );
};
export default TeaDetailsBrewingMethod;
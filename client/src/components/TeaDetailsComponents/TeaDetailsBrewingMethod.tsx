import { Paper, Stack, Text } from "@mantine/core";
import { BrewingMethod } from "../../types/BrewingMethod";

type TeaDetailsBrewingMethodProps = {
    brewingMethod: BrewingMethod
};

const TeaDetailsBrewingMethod = (props: TeaDetailsBrewingMethodProps) => {
    
    return(
        <Paper withBorder radius="md">
            <Stack>
                <Text>{props.brewingMethod.teaId}</Text>
                <Text>{props.brewingMethod.method}</Text>
                <Text>{props.brewingMethod.temperature}</Text>
                <Text>{props.brewingMethod.brewingTimes}</Text>
                <Text>{props.brewingMethod.gongfuBrewingTimeIncrement}</Text>
            </Stack>
        </Paper>
    );
};
export default TeaDetailsBrewingMethod;
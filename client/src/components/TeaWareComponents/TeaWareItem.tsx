import { Paper, Stack, Text } from "@mantine/core"
import { TeaWare } from "../../types/TeaWare"

type TeaWareItemProps = {
    teaWare: TeaWare;
}

const TeaWareItem = (props: TeaWareItemProps) => {
    return (
        <Paper withBorder>
            <Stack gap="md">
                <Text>Nazwa: {props.teaWare.name}</Text>
                <Text>Pojemność: {props.teaWare.capacity}ml</Text>
            </Stack>
        </Paper>
    )
}

export default TeaWareItem
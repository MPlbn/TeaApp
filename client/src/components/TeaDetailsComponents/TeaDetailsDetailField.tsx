import { Divider, Grid, Paper, Stack, Text, Title } from "@mantine/core";
import { TeaType } from "../../types/enums";
import { getTeaTypeStringVerison } from "../../utils/utils";

type TeaDetailsDetailFieldProps = {
    teaType: TeaType;
    origin: string;
    description: string;
    price: number | null;
};

const TeaDetailsDetailField = (props: TeaDetailsDetailFieldProps) => {
    return (
        <Paper withBorder radius="md" p="lg">
            <Stack gap="md">
                <Title order={3}>Informacje o herbacie</Title>

                <Divider/>

                <Grid>
                    <Grid.Col span={{base: 12, sm: 6}}>
                        <Stack>
                            <Text size="sm" c="dimmed">Rodzaj herbaty</Text>
                            <Text fw={500}>{getTeaTypeStringVerison(props.teaType)}</Text>
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={{base: 12, sm: 6}}>
                        <Stack>
                            <Text size="sm" c="dimmed">Pochodzenie</Text>
                            <Text fw={500}>{props.origin}</Text>
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={{base: 12, sm: 6}}>    
                        <Stack>
                            <Text size="sm" c="dimmed">Cena za 50g</Text>
                            <Text fw={500}>{props.price} zł</Text>
                        </Stack>
                    </Grid.Col>
                </Grid>
                <Divider/>
                <Stack>
                    <Text size="sm" c="dimmed">Opis</Text>
                    <Text style={{whiteSpace: 'pre-wrap'}}>{props.description || 'Brak opisu...'}</Text>
                </Stack>
            </Stack>
        </Paper>
    )
}
export default TeaDetailsDetailField;
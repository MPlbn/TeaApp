import { Divider, Grid, Paper, Stack, Text, Title } from "@mantine/core";
import { getTeaTypeStringVerison } from "../../utils/utils";
import { Tea } from "../../types/Tea";

type TeaDetailsDetailFieldProps = {
    tea: Tea
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
                            <Text fw={500}>{getTeaTypeStringVerison(props.tea.type)}</Text>
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={{base: 12, sm: 6}}>
                        <Stack>
                            <Text size="sm" c="dimmed">Pochodzenie</Text>
                            <Text fw={500}>{props.tea.origin}</Text>
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={{base: 12, sm: 6}}>    
                        <Stack>
                            <Text size="sm" c="dimmed">Cena za 50g</Text>
                            <Text fw={500}>{props.tea.price} zł</Text>
                        </Stack>
                    </Grid.Col>
                </Grid>
                <Divider/>
                <Stack>
                    <Text size="sm" c="dimmed">Opis</Text>
                    <Text style={{whiteSpace: 'pre-wrap'}}>{props.tea.description || 'Brak opisu...'}</Text>
                </Stack>
            </Stack>
        </Paper>
    )
}
export default TeaDetailsDetailField;
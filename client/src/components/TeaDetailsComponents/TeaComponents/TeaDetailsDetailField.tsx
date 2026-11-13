import { Badge, Divider, Grid, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { getFlavorTypeStringVersion, getTeaTypeStringVersion } from "../../../utils/utils";
import { Tea } from "../../../types/Tea";

type TeaDetailsDetailFieldProps = {
    tea: Tea
};

const TeaDetailsDetailField = (props: TeaDetailsDetailFieldProps) => {
    return (
        <Paper withBorder radius="lg" p="lg" shadow="xs">
            <Stack gap="lg">
                <Title order={3}>Informacje o herbacie</Title>

                <Divider color="gray.2" />

                <Grid>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Stack gap={4}>
                            <Text size="sm" c="dimmed">Rodzaj herbaty</Text>
                            <Text fw={500} c="teaGreen.9">{getTeaTypeStringVersion(props.tea.type)}</Text>
                        </Stack>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Stack>
                            <Text size="sm" c="dimmed">Pochodzenie</Text>
                            <Text fw={500} c="teaGreen.9">{props.tea.origin}</Text>
                        </Stack>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Stack gap={4}>
                            <Text size="sm" c="dimmed">Cena za 50g</Text>
                            <Text fw={500} c="teaGreen.9">{props.tea.price} zł</Text>
                        </Stack>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Stack gap={4}>
                            <Text size="sm" c="dimmed">Nuty smakowe</Text>
                            <Group gap="xs" wrap="wrap">
                                {props.tea.flavors.map((flavor) => (
                                    <Badge key={flavor} variant="light" color="teaGreen" size="lg">
                                        {getFlavorTypeStringVersion(flavor)}
                                    </Badge>
                                ))}
                            </Group>
                        </Stack>
                    </Grid.Col>
                </Grid>

                <Divider color="gray.2" />

                <Stack gap={4}>
                    <Text size="sm" c="dimmed">Opis</Text>
                    <Text color="teaGreen.9" style={{ whiteSpace: 'pre-wrap' }}>{props.tea.description || 'Brak opisu...'}</Text>
                </Stack>
            </Stack>
        </Paper>
    )
}
export default TeaDetailsDetailField;
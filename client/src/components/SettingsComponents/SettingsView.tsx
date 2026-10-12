import {
    Stack,
    Title,
    Text,
    Paper
} from '@mantine/core';

const SettingsView = () => {
    return(
        <Stack gap="xl">
            <div>
                <Title order={1}>USTAWIENIA</Title>
                <Text c="dimmed" mt="xs">
                    Tekst jakiś blebleble.
                </Text>
            </div>

            <Paper withBorder p="lg" radius="md">
                <Stack gap="xs">
                    <Title order={3}>Preferencje</Title>
                    <Text c="dimmed" size="sm">
                        Faktyczne ustawienia będą tu.
                    </Text>
                </Stack>
            </Paper>

            <Paper withBorder p="lg" radius="md">
                <Stack gap="xs">
                    <Title order={3}>Informacje o aplikacji</Title>
                    <Text c="dimmed" size="sm">
                        Informacje blebleble.
                    </Text>
                </Stack>
            </Paper>
        </Stack>
    );
}

export default SettingsView;
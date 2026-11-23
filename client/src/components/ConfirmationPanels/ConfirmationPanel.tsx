import { Stack, ThemeIcon, Title, Text, Button, Group } from "@mantine/core"
import { IconCircleCheck, IconInfoCircle } from "@tabler/icons-react";

type ConfirmationPanelProps = {
    infoText: string;
    handleSubmit: () => void;
    handleCancel: () => void;
}

const ConfirmationPanel = (props: ConfirmationPanelProps) => {
    return (
        <Stack gap="lg">
            <Stack align="center" gap="xs">
                <ThemeIcon
                    size={56}
                    radius="xl"
                    color="teaGreen.8"
                    variant="light"
                >
                    <IconInfoCircle size={28} />
                </ThemeIcon>

                <Title order={3} c="teaGreen.8" ta="center">Jesteś pewny?</Title>
            </Stack>

            <Text c="dimmed" ta="center">{props.infoText}</Text>

            <Group gap="sm" justify='flex-end'>
                <Button
                    variant='subtle'
                    color='gray'
                    onClick={props.handleCancel}
                    radius="md"
                >
                    Anuluj
                </Button>

                <Button
                    variant='filled'
                    color='teaGreen.7'
                    leftSection={<IconCircleCheck size={16} />}
                    onClick={props.handleSubmit}
                    radius="md"
                >
                    Tak
                </Button>
            </Group>
        </Stack>
    )
}

export default ConfirmationPanel
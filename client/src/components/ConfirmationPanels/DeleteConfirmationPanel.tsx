import { Button, Group, Stack, Title, Text, ThemeIcon } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';

type DeleteConfirmationPanelProps = {
    deletedObjectName: string;
    handleDelete: () => void;
    handleCancel: () => void;
}

const DeleteConfirmationPanel = (props: DeleteConfirmationPanelProps) => {
    return (
        <Stack gap="lg">
            <Stack align="center" gap="xs">
                <ThemeIcon
                    size={56}
                    radius="xl"
                    color="red"
                    variant="light"
                >
                    <IconTrash size={28} />
                </ThemeIcon>

                <Title order={3} c="red.8" ta="center">Jesteś pewny?</Title>
            </Stack>

            <Text c="dimmed" ta="center">Czy na pewno chcesz usunąć <Text span fw={600} c="dark">{props.deletedObjectName}</Text>? Tej operacji nie można cofnąć.</Text>

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
                    color='red.9'
                    leftSection={<IconTrash size={16} />}
                    onClick={props.handleDelete}
                    radius="md"
                >
                    Tak, Usuń
                </Button>
            </Group>
        </Stack>
    )
}

export default DeleteConfirmationPanel
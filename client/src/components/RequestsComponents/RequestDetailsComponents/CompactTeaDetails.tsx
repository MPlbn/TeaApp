import { Badge, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { Tea } from "../../../types/Tea";
import { getFlavorTypeStringVersion, getTeaTypeColor, getTeaTypeStringVersion } from "../../../utils/utils";

type CompactTeaDetailsProps = {
    tea: Tea
}

const CompactTeaDetails = ({ tea }: CompactTeaDetailsProps) => {
    return (
        <Paper withBorder radius="md" p="md">
            <Stack gap="sm">
                <Group justify="space-between" align="center">
                    <Title order={4}>{tea.name}</Title>
                    <Badge variant="light" color={getTeaTypeColor(tea.type)}>{getTeaTypeStringVersion(tea.type)}</Badge>
                </Group>

                <Group gap="xs">
                    <Text size="sm" c="dimmed">
                        Origin:
                    </Text>
                    <Text size="sm">{tea.origin}</Text>
                </Group>

                <Group gap="xs">
                    <Text size="sm" c="dimmed">
                        Shop:
                    </Text>
                    <Text size="sm">{tea.shop}</Text>
                </Group>

                <Group gap="xs">
                    <Text size="sm" c="dimmed">
                        Price:
                    </Text>
                    <Text size="sm">
                        {tea.price !== null ? `${tea.price.toFixed(2)}` : "Not specified"}
                    </Text>
                </Group>

                {tea.description && (
                    <Group gap="xs">
                        <Text size="sm" c="dimmed">
                            Description:
                        </Text>
                        <Text size="sm" lineClamp={3}>
                            {tea.description}
                        </Text>
                    </Group>
                )}

                {tea.flavors.length > 0 && (
                    <Group gap="xs">
                        <Text size="sm" c="dimmed">
                            Flavors:
                        </Text>
                        <Group gap={6}>
                            {tea.flavors.map((flavor) => (
                                <Badge key={flavor} variant="outline" color="teaGreen.9">
                                    {getFlavorTypeStringVersion(flavor)}
                                </Badge>
                            ))}
                        </Group>
                    </Group>
                )}
            </Stack>
        </Paper>
    )
}

export default CompactTeaDetails;

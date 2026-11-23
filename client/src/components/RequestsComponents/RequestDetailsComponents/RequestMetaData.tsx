
import { Badge, Grid, Paper, Stack, Text } from "@mantine/core";
import { RequestResponse } from "../../../types/PublishRequestTypes";
import { getRequestStatusColor, getRequestStatusStringVersion } from "../../../utils/utils";

type RequestMetadataProps = {
    request: RequestResponse;
};

const RequestMetadata = ({ request }: RequestMetadataProps) => {
    const formatDate = (uDate: string | null) =>
        uDate ? new Date(uDate).toLocaleString() : "Not resolved";

    return (
        <Paper withBorder radius="md" p="md">
            <Stack gap="sm">
                <Text fw={600}>Request information</Text>

                <Grid>
                    <Grid.Col span={6}>
                        <Text size="xs" c="dimmed">Request ID</Text>
                        <Text size="sm">#{request.id}</Text>
                    </Grid.Col>

                    <Grid.Col span={6}>
                        <Text size="xs" c="dimmed">Status</Text>
                        <Badge color={getRequestStatusColor(request.status)}>{getRequestStatusStringVersion(request.status)}</Badge>
                    </Grid.Col>

                    <Grid.Col span={6}>
                        <Text size="xs" c="dimmed">Created at</Text>
                        <Text size="sm">{formatDate(request.createdAt)}</Text>
                    </Grid.Col>

                    <Grid.Col span={6}>
                        <Text size="xs" c="dimmed">Resolved at</Text>
                        <Text size="sm">{formatDate(request.resolvedAt) ?? "Not resolved yet..."}</Text>
                    </Grid.Col>

                    <Grid.Col span={6}>
                        <Text size="xs" c="dimmed">Submitted by</Text>
                        <Text size="sm">{request.ownerUserName ?? "Unknown"}</Text>
                    </Grid.Col>

                    <Grid.Col span={6}>
                        <Text size="xs" c="dimmed">Resolved by</Text>
                        <Text size="sm">{request.resolverUserName ?? "Not assigned"}</Text>
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <Text size="xs" c="dimmed">Resolution message</Text>
                        <Text size="sm">{request.resolutionMessage ?? "No message"}</Text>
                    </Grid.Col>
                </Grid>
            </Stack>
        </Paper>
    );
};

export default RequestMetadata;

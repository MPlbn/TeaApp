import { Button, Group, Paper, Stack, Text } from '@mantine/core';
import { RequestResponse, ResolvePublishRequestRequest } from '../../../types/PublishRequest'
import { useGetTeaByIDPrivateQuery, useResolveRequestMutation } from '../../../services/teaApi';
import { IconCheck, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { getApiErrorMessage } from '../../../utils/getApiErrorMessage';
import { PublishRequestStatus } from '../../../types/enums';

const RESOLVE_SUCCESS_MESSAGE = "Poprawnie rozpatrzono prośbę: ";

type PublishRequestProps = {
    publishRequestData: RequestResponse;
}


const PublishRequest = (props: PublishRequestProps) => {
    const {
        data: teaData,
        isLoading: isFetchingTea
    } = useGetTeaByIDPrivateQuery(props.publishRequestData.details.teaId, { skip: true });

    const [resolveRequest, { isLoading: isResolving }] = useResolveRequestMutation();

    const handleResolve = async (isAccepted: boolean) => {
        try {
            const suffix = isAccepted ? "Zaakceptowano" : "Odrzucono"
            const requestResolveData = {
                status: isAccepted ? PublishRequestStatus.Accepted : PublishRequestStatus.Rejected,
                resolutionMessage: "" //to fill later
            } as ResolvePublishRequestRequest;
            if (isAccepted) {
                resolveRequest({ publishRequestId: props.publishRequestData.id, request: requestResolveData }).unwrap();
            }

            notifications.show({
                title: "SUKCES",
                message: `${RESOLVE_SUCCESS_MESSAGE} ${suffix}`,
                color: "teaGreen.8",
                icon: <IconCheck />
            })
        }
        catch (error) {
            notifications.show({
                title: "BŁĄD",
                message: getApiErrorMessage(error),
                color: "red",
                icon: <IconX />
            });
        }
    }
    return (
        <Paper withBorder>
            <Stack>
                <Text>{props.publishRequestData.id}</Text>
                <Text>{props.publishRequestData.details.teaId}</Text>
                <Text>{props.publishRequestData.createdAt}</Text>
                <Text>{props.publishRequestData.resolvedAt}</Text>
                <Text>{props.publishRequestData.status}</Text>
                <Text>{props.publishRequestData.ownerId}</Text>
                <Text>{props.publishRequestData.ownerUserName}</Text>
                <Group>
                    <Button
                    >
                        Detale
                    </Button>
                    <Button
                        onClick={() => handleResolve(false)}
                    >
                        Odrzuć
                    </Button>
                    <Button
                        onClick={() => handleResolve(true)}
                    >
                        Akceptuj
                    </Button>
                </Group>
            </Stack>
        </Paper>
    )
}

export default PublishRequest
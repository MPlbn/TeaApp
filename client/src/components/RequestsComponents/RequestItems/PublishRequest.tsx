import { Badge, Box, Collapse, Group, Loader, Modal, Stack, Text } from '@mantine/core';
import { RequestResponse, ResolveRequestDTO } from '../../../types/PublishRequestTypes'
import { useCancelRequestMutation, useGetTeaByIDPrivateQuery, useResolveRequestMutation } from '../../../services/teaApi';
import { IconCheck, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { getApiErrorMessage } from '../../../utils/getApiErrorMessage';
import { RequestStatus } from '../../../types/enums';
import PendingRequestItemPanel from '../PendingRequestsComponents/PendingRequestItemPanel';
import { useState } from 'react';
import CompactTeaDetails from '../RequestDetailsComponents/CompactTeaDetails';
import RequestMetadata from '../RequestDetailsComponents/RequestMetaData';
import MyRequestItemPanel from '../MyRequestsComponents/MyRequestItemPanel';

const RESOLVE_SUCCESS_MESSAGE = "Poprawnie rozpatrzono prośbę: ";
const CANCEL_SUCCESS_MESSAGE = "Poprawnie wycofano prośbę";

type PublishRequestProps = {
    publishRequestData: RequestResponse;
    isViewPending: boolean;
}


const PublishRequest = (props: PublishRequestProps) => {
    const {
        data: teaData,
        isLoading: isFetchingTea
    } = useGetTeaByIDPrivateQuery(props.publishRequestData.details.teaId);


    const [isDetailsShown, setIsDetailsShown] = useState(false);

    const [resolutionMessage, setResolutionMessage] = useState<string>("");

    const [resolveRequest, { isLoading: isResolving }] = useResolveRequestMutation();

    const [cancelRequest, { isLoading: isCancelling }] = useCancelRequestMutation();

    const handleResolve = async (isAccepted: boolean) => {
        try {
            const suffix = isAccepted ? "Zaakceptowano" : "Odrzucono"
            const requestResolveData = {
                status: isAccepted ? RequestStatus.Accepted : RequestStatus.Rejected,
                resolutionMessage: resolutionMessage.trim()
            } as ResolveRequestDTO;

            await resolveRequest({ publishRequestId: props.publishRequestData.id, request: requestResolveData }).unwrap();

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

    const handleCancel = async (id: number) => {
        try {
            await cancelRequest(id).unwrap();

            notifications.show({
                title: "SUKCES",
                message: CANCEL_SUCCESS_MESSAGE,
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

    const handleDetails = () => {
        setIsDetailsShown((previous) => !previous);
    }


    if (isFetchingTea) return <Loader />

    if (!teaData) return <></>

    const renderContent = () => {
        return (
            <>
                <Stack gap="xs">
                    <Group justify="space-between" align="center">
                        <Box>
                            <Text fw={600}>{teaData.name}</Text>
                            <Text size="xs" c="dimmed">
                                Submitted by {props.publishRequestData.ownerUserName}
                            </Text>
                        </Box>

                        <Badge color="teaGreen" variant="light">
                            Publish Request
                        </Badge>
                    </Group>

                    <Group gap="lg">
                        <Text size="xs" c="dimmed">
                            Request ID: #{props.publishRequestData.id}
                        </Text>

                        <Text size="xs" c="dimmed">
                            Submitted: {new Date(props.publishRequestData.createdAt).toLocaleString()}
                        </Text>
                    </Group>
                </Stack>

                <Collapse expanded={isDetailsShown}>
                    <Box pt="md">
                        <RequestMetadata request={props.publishRequestData} />
                        <CompactTeaDetails tea={teaData} />
                    </Box>
                </Collapse>
            </>
        )
    }

    const renderItemPanel = () => {
        if (props.isViewPending) {
            return (
                <PendingRequestItemPanel
                    onDetails={handleDetails}
                    onAccept={() => handleResolve(true)}
                    onReject={() => handleResolve(false)}
                    isLoading={isResolving}
                    resolutionMessage={resolutionMessage}
                    onResolutionMessageChange={setResolutionMessage}
                >
                    {renderContent()}
                </PendingRequestItemPanel>
            )
        }

        return (
            <MyRequestItemPanel
                onDetails={handleDetails}
                onCancel={() => handleCancel(props.publishRequestData.id)}
                isPending={props.publishRequestData.status === RequestStatus.Pending}
            >
                {renderContent()}
            </MyRequestItemPanel>
        );
    }

    return (
        <>
            {renderItemPanel()}
        </>
    )

}
export default PublishRequest
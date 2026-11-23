import TeaDetailsTitle from "../TeaDetailsTitle";
import TeaDetailsDetailField from "./TeaDetailsDetailField";
import { useState } from "react";
import { Stack, Button, Group, Modal, Box } from "@mantine/core";
import { useNavigate } from "react-router";
import { RequestType, ViewType } from "../../../types/enums";
import { useCreateRequestMutation, useDeleteTeaMutation, useIsPendingRequestPresentQuery, useUnpublishTeaMutation, } from "../../../services/teaApi";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { Tea } from "../../../types/Tea";
import styles from "../../../Styles/TeaDetailsSection.module.css"
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import DeleteConfirmationPanel from "../../ConfirmationPanels/DeleteConfirmationPanel";
import TeaFormPanel from "../../FormComponents/FormPanels/TeaFormPanel";
import { RequestCreationData } from "../../../types/RequestCreationData";
import { PublishRequestDetails } from "../../../types/RequestDetails";
import ItemModificationMenu from "../../ItemModificationMenu";
import ConfirmationPanel from "../../ConfirmationPanels/ConfirmationPanel";
import { CONFIRMATION_PUBLISH, CONFIRMATION_UNPUBLISH } from "../../../config/ConfirmationPanelTexts";

const TEA_DELETE_SUCCESS_MESSAGE = "Poprawnie usunięto herbatę!";
const TEA_PUBLISH_SUCCESS_MESSAGE = "Poprawnie zgłoszono herbatę do publikacji";
const TEA_UNPUBLISH_SUCCESS_MESSAGE = "Poprawnie wycofano herbatę z publicznej kolekcji";

type TeaDetailsInfoSectionProps = {
    tea: Tea;
    canModifyTea: boolean;
    isPublicView: boolean;
};

const TeaDetailsInfoSection = (props: TeaDetailsInfoSectionProps) => {

    const navigate = useNavigate();
    const [modalMode, setModalMode] = useState<"Delete" | "Edit" | "Publish" | "Unpublish" | null>(null);

    const [deleteTea, { isLoading: isDeleting }] = useDeleteTeaMutation();

    const [createRequest, { isLoading: isSavingRequest }] = useCreateRequestMutation();

    const [unpublishTea, { isLoading: isUnpublishing }] = useUnpublishTeaMutation();

    const {
        data: isPendingPublishRequestPresent,
        isLoading: isFetchingIsPublishRequestPresent
    } = useIsPendingRequestPresentQuery({ type: RequestType.Publish, targetId: String(props.tea.id) })

    const handleDelete = async () => {
        try {
            navigate(props.isPublicView ? ViewType.TeaListView : ViewType.PrivateTeaListView);
            await deleteTea(props.tea.id).unwrap();
            notifications.show({
                title: "SUKCES",
                message: TEA_DELETE_SUCCESS_MESSAGE,
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

    const handlePublish = async () => {
        const publishRequestDetails = {
            teaId: props.tea.id
        } as PublishRequestDetails;

        const publishRequestData = {
            type: RequestType.Publish,
            details: publishRequestDetails
        } as RequestCreationData;

        try {
            await createRequest(publishRequestData).unwrap();
            notifications.show({
                title: "SUKCES",
                message: TEA_PUBLISH_SUCCESS_MESSAGE,
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

        setModalMode(null);
    }

    const handleUnpublish = async () => {
        try {
            await unpublishTea(props.tea.id).unwrap();
            notifications.show({
                title: "SUKCES",
                message: TEA_UNPUBLISH_SUCCESS_MESSAGE,
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

        setModalMode(null);
    }

    const renderModificationButtons = () => {
        if (!props.canModifyTea) return <></>;

        if (props.tea.isPublic && props.tea.ownerId !== null && !props.isPublicView) {
            return (
                <>
                    <Button
                        size="xs"
                        color={"red"}
                        variant="subtle"
                        onClick={() => setModalMode("Unpublish")}
                        radius="md"
                    >
                        Wycofaj z publicznej kolekcji
                    </Button>
                </>
            )
        }

        if (!isPendingPublishRequestPresent && !props.tea.isPublic) {
            return (
                <>
                    <Button
                        size="xs"
                        color={"teaGreen"}
                        variant="subtle"
                        onClick={() => setModalMode("Publish")}
                        radius="md"
                    >
                        Upublicznij
                    </Button>
                </>
            )
        }

        return <></>;

    }

    const renderModalInsides = () => {
        switch (modalMode) {
            case "Delete":
                return (
                    <DeleteConfirmationPanel
                        deletedObjectName={props.tea.name}
                        handleDelete={handleDelete}
                        handleCancel={() => setModalMode(null)}
                    />
                )

            case "Edit":
                return <TeaFormPanel initialTea={props.tea} onFinish={() => setModalMode(null)} />;

            case "Publish":
                return (
                    <ConfirmationPanel
                        infoText={CONFIRMATION_PUBLISH}
                        handleSubmit={handlePublish}
                        handleCancel={() => setModalMode(null)}
                    />
                );

            case "Unpublish":
                return (
                    <ConfirmationPanel
                        infoText={CONFIRMATION_UNPUBLISH}
                        handleSubmit={handleUnpublish}
                        handleCancel={() => setModalMode(null)}
                    />
                );

            default:
                return <></>
        }

    }

    return (
        <Stack className={styles.section}>
            <Group pos="relative">
                <TeaDetailsTitle isPublic={props.tea.isPublic} name={props.tea.name} onBack={() => navigate(-1)} />
                {renderModificationButtons()}
                {props.canModifyTea && (
                    <Box pos="absolute" top={10} right={10} style={{ zIndex: 1 }}>
                        <ItemModificationMenu setModalMode={setModalMode} />
                    </Box>
                )}
            </Group>
            <TeaDetailsDetailField tea={props.tea} />
            <Modal
                opened={modalMode !== null}
                onClose={() => setModalMode(null)}
                centered
                size="lg"
            >
                {renderModalInsides()}
            </Modal>
        </Stack>
    );
};
export default TeaDetailsInfoSection;
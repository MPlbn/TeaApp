import TeaDetailsTitle from "../TeaDetailsTitle";
import TeaDetailsDetailField from "./TeaDetailsDetailField";
import { useState } from "react";
import { Stack, Button, Group, Modal, Box } from "@mantine/core";
import { useNavigate } from "react-router";
import { RequestType, ViewType } from "../../../types/enums";
import { useCreateRequestMutation, useDeleteTeaMutation, useGetUserRequestsQuery, } from "../../../services/teaApi";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { Tea } from "../../../types/Tea";
import styles from "../../../Styles/TeaDetailsSection.module.css"
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import DeleteConfirmationPanel from "../../DeleteConfirmationPanel";
import TeaFormPanel from "../../FormComponents/FormPanels/TeaFormPanel";
import { RequestCreationData } from "../../../types/RequestCreationData";
import { PublishRequestDetails } from "../../../types/RequestDetails";
import ItemModificationMenu from "../../ItemModificationMenu";

const TEA_DELETE_SUCCESS_MESSAGE = "Poprawnie usunięto herbatę!";
const TEA_PUBLISH_SUCCESS_MESSAGE = "Poprawnie zgłoszono herbatę do publikacji";

type TeaDetailsInfoSectionProps = {
    tea: Tea;
    canModifyTea: boolean;
    isPublic: boolean;
};

const TeaDetailsInfoSection = (props: TeaDetailsInfoSectionProps) => {

    const navigate = useNavigate();
    const [modalMode, setModalMode] = useState<"Delete" | "Edit" | null>(null);

    const [deleteTea, { isLoading: isDeleting }] = useDeleteTeaMutation();

    const [createRequest, { isLoading: isSavingRequest }] = useCreateRequestMutation();

    const isPublishButtonDisabled = () => {
        return false;
    }

    const handleDelete = async () => {
        try {
            navigate(props.isPublic ? ViewType.TeaListView : ViewType.PrivateTeaListView);
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
    }

    const renderModificationButtons = () => {
        if (!props.canModifyTea) return <></>;

        return (
            <>
                <Button
                    size="xs"
                    color={"teaGreen"}
                    variant="subtle"
                    disabled={isPublishButtonDisabled()}
                    onClick={handlePublish}
                >
                    Upublicznij
                </Button>
            </>
        )
    }

    const renderModalInsides = () => {
        if (modalMode === "Delete") {
            return (
                <DeleteConfirmationPanel
                    deletedObjectName={props.tea.name}
                    handleDelete={handleDelete}
                    handleCancel={() => setModalMode(null)}
                />
            )
        }

        if (modalMode === "Edit") {
            return <TeaFormPanel initialTea={props.tea} onFinish={() => setModalMode(null)} />
        }

        return <></>
    }

    return (
        <Stack className={styles.section}>
            <Group pos="relative">
                <TeaDetailsTitle isPublic={props.isPublic} name={props.tea.name} onBack={() => navigate(-1)} />
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
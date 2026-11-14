import TeaDetailsTitle from "../TeaDetailsTitle";
import TeaDetailsDetailField from "./TeaDetailsDetailField";
import { useState } from "react";
import { Stack, Button, Group, Modal } from "@mantine/core";
import { useNavigate } from "react-router";
import { ViewType } from "../../../types/enums";
import TeaEditorView from "../../EditorComponents/TeaEditorView";
import { useDeleteTeaMutation, } from "../../../services/teaApi";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { Tea } from "../../../types/Tea";
import styles from "../../../Styles/TeaDetailsSection.module.css"
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

const TEA_DELETE_SUCCESS_MESSAGE = "Poprawnie usunięto herbatę!";

type TeaDetailsInfoSectionProps = {
    tea: Tea;
    canModifyTea: boolean;
    isPublic: boolean;
};

const TeaDetailsInfoSection = (props: TeaDetailsInfoSectionProps) => {

    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const navigate = useNavigate();

    const [deleteTea, { isLoading: isDeleting }] = useDeleteTeaMutation();

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

    const renderModificationButtons = () => {
        if (!props.canModifyTea) return <></>;

        return (
            <>
                <Button size="xs" color={"teaGreen"} variant="subtle" onClick={() => setIsEditorOpen(true)}>Edytuj</Button>
                <Button size="xs" color="red" variant="subtle" onClick={handleDelete} loading={isDeleting}>Usuń</Button>
            </>
        )
    }

    return (
        <Stack className={styles.section}>
            <Group>
                <TeaDetailsTitle isPublic={props.isPublic} name={props.tea.name} onBack={() => navigate(-1)} />
                {renderModificationButtons()}
            </Group>
            <TeaDetailsDetailField tea={props.tea} />
            <Modal
                opened={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                centered
                size="lg"
            >
                <TeaEditorView tea={props.tea} onFinish={() => setIsEditorOpen(false)} />
            </Modal>
        </Stack>
    );
};
export default TeaDetailsInfoSection;
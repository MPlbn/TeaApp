import TeaDetailsTitle from "../TeaDetailsTitle";
import TeaDetailsDetailField from "./TeaDetailsDetailField";
import { useState } from "react";
import { Loader, Text, Stack, Button, Group, Modal } from "@mantine/core";
import { useNavigate } from "react-router";
import { ViewType } from "../../../types/enums";
import TeaEditorView from "../../EditorComponents/TeaEditorView";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { openInfoModal } from "../../../store/uiSlice";
import { useDeleteTeaMutation, useGetTeaByIDPrivateQuery, useGetTeaByIDQuery } from "../../../services/teaApi";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { isUserAuthorizedToEditTea } from "../../../utils/utils";
import { Tea } from "../../../types/Tea";

const TEA_DELETE_SUCCESS_MESSAGE = "Poprawnie usunięto herbatę!";

type TeaDetailsInfoSectionProps = {
    tea: Tea,
    canModifyTea: boolean
};

const TeaDetailsInfoSection = (props: TeaDetailsInfoSectionProps) => {

    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [deleteTea, { isLoading: isDeleting }] = useDeleteTeaMutation();

    const handleDelete = async () => {
        try {
            await deleteTea(props.tea.id).unwrap();
            navigate(ViewType.TeaListView);
            dispatch(openInfoModal({
                message: TEA_DELETE_SUCCESS_MESSAGE
            }));
        }
        catch (error) {
            dispatch(openInfoModal({
                message: getApiErrorMessage(error)
            }));
        }
    }

    const renderModificationButtons = () => {
        if (!props.canModifyTea) return <></>;

        return (
            <>
                <Button onClick={() => setIsEditorOpen(true)}>Edytuj</Button>
                <Button c="red" variant="outline" onClick={handleDelete} loading={isDeleting}>Usuń</Button>
            </>
        )
    }

    return (
        <Stack>
            <Group>
                <TeaDetailsTitle name={props.tea.name} onBack={() => navigate(-1)} />
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
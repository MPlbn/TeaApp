import TeaDetailsTitle from "../TeaDetailsTitle";
import TeaDetailsDetailField from "./TeaDetailsDetailField";
import { useState } from "react";
import { Loader, Text, Stack, Button, Group, Modal } from "@mantine/core";
import { useNavigate } from "react-router";
import { ViewType } from "../../../types/enums";
import TeaEditorView from "../../TeaEditorComponents/TeaEditorView";
import { useAppDispatch } from "../../../store/hooks";
import { openInfoModal } from "../../../store/uiSlice";
import { useDeleteTeaMutation, useGetTeaByIDQuery } from "../../../services/teaApi";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

const TEA_NOT_FOUND_MESSAGE = "Nie znaleziono herbaty.";
const TEA_DELETE_SUCCESS_MESSAGE = "Poprawnie usunięto herbatę!";

type TeaDetailsInfoSectionProps = {
    teaID: number;
};

const TeaDetailsInfoSection = (props: TeaDetailsInfoSectionProps) => {
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {
        data: tea,
        error: fetchingError,
        isLoading
    } = useGetTeaByIDQuery(props.teaID, {skip: !Number.isInteger(props.teaID) || props.teaID <= 0});

    const [deleteTea, {isLoading: isDeleting}] = useDeleteTeaMutation();

    const handleDelete = async () => {
        try {
            await deleteTea(props.teaID).unwrap();
            navigate(ViewType.TeaListView);
            dispatch(openInfoModal({
                message: TEA_DELETE_SUCCESS_MESSAGE
            }));
        }
        catch(error) {
            dispatch(openInfoModal({
                message: getApiErrorMessage(error)
            }));
        }
    }
    
    
    if(isLoading){
        return <Loader/>
    }
    
    if(fetchingError){
        return <Text c="red">Błąd: {getApiErrorMessage(fetchingError)}</Text>
    }
    
    if(!tea){
        return <Text c="red">{TEA_NOT_FOUND_MESSAGE}</Text>;
    }

    return(
        <Stack>
            <Group>
                <TeaDetailsTitle name={tea.name} onBack={() => navigate(ViewType.TeaListView)}/>
                <Button onClick={() => setIsEditorOpen(true)}>Edytuj</Button>
                <Button c="red" variant="outline" onClick={handleDelete} loading={isDeleting}>Usuń</Button>
            </Group>
            <TeaDetailsDetailField tea={tea}/>
            <Modal
                opened={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                centered
                size="lg"
            >
                <TeaEditorView tea={tea} onFinish={() => setIsEditorOpen(false)}/>
            </Modal>
        </Stack>
    );
};
export default TeaDetailsInfoSection;
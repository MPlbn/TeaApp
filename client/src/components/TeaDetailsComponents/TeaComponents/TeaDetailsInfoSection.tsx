import TeaDetailsTitle from "../TeaDetailsTitle";
import TeaDetailsDetailField from "./TeaDetailsDetailField";
import { useEffect, useState, useCallback } from "react";
import { Tea } from "../../../types/Tea"; 
import { Loader, Text, Stack, Button, Group, Modal } from "@mantine/core";
import { getTeaByID, deleteTea } from "../../../services/teaService";
import { useNavigate } from "react-router";
import { ViewType } from "../../../types/enums";
import TeaEditorView from "../../TeaEditorComponents/TeaEditorView";

const TEA_LOAD_FAIL_MESSAGE = "Nie udało się pobrać herbaty.";
const TEA_NO_ID_MESSAGE = "Nie podano ID herbaty.";
const TEA_WRONG_ID_MESSAGE = "ID herbaty ma nieprawidłową wartość.";
const TEA_NOT_FOUND_MESSAGE = "Nie znaleziono herbaty.";
const TEA_DELETE_FAIL_MESSAGE = "Nie udało się usunąć herbaty.";

type TeaDetailsInfoSectionProps = {
    teaID: number;
    openInfoModalWithMessage: (message: string) => void
};

const TeaDetailsInfoSection = (props: TeaDetailsInfoSectionProps) => {
    const [tea, setTea] = useState<Tea | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    const navigate = useNavigate();

    const loadTea = useCallback(async() => {
            setIsLoading(true);
            setIsError(false);

            try {
                const fetcehedTea = await getTeaByID(props.teaID);

                if(fetcehedTea === null){
                    setTea(null);
                    setIsError(true);
                    props.openInfoModalWithMessage(TEA_NOT_FOUND_MESSAGE);
                    return;
                }

                setTea(fetcehedTea);
            } catch (error) {
                setIsError(true);
                props.openInfoModalWithMessage(error instanceof Error ? error.message : TEA_LOAD_FAIL_MESSAGE);
            } finally {
                setIsLoading(false);
            }
    }, [props.teaID, props.openInfoModalWithMessage]);

    const handleEditFinish = async (message: string) => {
        await loadTea();
        setIsEditorOpen(false);
        props.openInfoModalWithMessage(message);
    };

    const handleDelete = async () => {
        try {
            await deleteTea(props.teaID);
            navigate(ViewType.TeaListView);
        }
        catch(error) {
            setIsError(true);
            props.openInfoModalWithMessage(error instanceof Error ? error.message : TEA_DELETE_FAIL_MESSAGE);
        }
    }

    useEffect(() => {  
        if(!props.teaID){
            setIsError(true);
            props.openInfoModalWithMessage(TEA_NO_ID_MESSAGE);
            setIsLoading(false);
            return;
        }
    
        if(!Number.isInteger(props.teaID) || props.teaID <= 0){
            setIsError(true);
            props.openInfoModalWithMessage(TEA_WRONG_ID_MESSAGE);
            setIsLoading(false);
            return;
        }
        
        void loadTea();
    }, [loadTea, props.teaID, props.openInfoModalWithMessage]);
    
    
    if(isLoading){
        return <Loader/>
    }
    
    if(isError){
        return <Text c="red">Błąd</Text>
    }
    
    if(tea === null){
        return <Text c="red">{TEA_NOT_FOUND_MESSAGE}</Text>;
    }

    return(
        <Stack>
            <Group>
                <TeaDetailsTitle name={tea.name} onBack={() => navigate(ViewType.TeaListView)}/>
                <Button onClick={() => setIsEditorOpen(true)}>Edytuj</Button>
                <Button c="red" variant="outline" onClick={handleDelete}>Usuń</Button>
            </Group>
            <TeaDetailsDetailField tea={tea}/>
            <Modal
                opened={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                centered
                size="lg"
            >
                <TeaEditorView tea={tea} onFinish={handleEditFinish}/>
            </Modal>
        </Stack>
    );
};
export default TeaDetailsInfoSection;
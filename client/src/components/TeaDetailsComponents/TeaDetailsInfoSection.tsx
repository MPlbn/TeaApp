import TeaDetailsTitle from "./TeaDetailsTitle";
import TeaDetailsDetailField from "./TeaDetailsDetailField";
import { useEffect, useState, useCallback } from "react";
import { Tea } from "../../types/Tea"; 
import { Loader, Text, Stack, Button, Group, Modal } from "@mantine/core";
import { getTeaByID, deleteTea } from "../../services/teaService";
import { useNavigate } from "react-router";
import { ViewType } from "../../types/enums";
import TeaEditorView from "../TeaEditorComponents/TeaEditorView";

type TeaDetailsInfoSectionProps = {
    teaID: number;
};

const TeaDetailsInfoSection = (props: TeaDetailsInfoSectionProps) => {
    const [tea, setTea] = useState<Tea | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchingError, setFetchingError] = useState<string | null>(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    const navigate = useNavigate();

    const loadTea = useCallback(async() => {
            setIsLoading(true);
            setFetchingError(null);

            try {
                const fetcehedTea = await getTeaByID(props.teaID);
                setTea(fetcehedTea);
            } catch (error) {
                setFetchingError(error instanceof Error ? error.message : "Nie udało się pobrać herbaty.");
            } finally {
                setIsLoading(false);
            }
    }, [props.teaID]);

    const handleEditSuccess = async () => {
        setIsEditorOpen(false);
        await loadTea();
    };

    const handleDelete = async () => {
        try {
            await deleteTea(props.teaID);
            navigate(ViewType.TeaListView);
        }
        catch(error) {
            setFetchingError(error instanceof Error ? error.message : "Nie udało się usunąć herbaty.");
        }
    }

    useEffect(() => {  
        if(!props.teaID){
            setFetchingError("Nie podano ID herbaty.");
            setIsLoading(false);
            return;
        }
    
        if(!Number.isInteger(props.teaID) || props.teaID <= 0){
            setFetchingError("ID herbaty ma nieprawidłową wartość.");
            setIsLoading(false);
            return;
        }
        
        void loadTea();
    }, [loadTea, props.teaID]);

    if(isLoading){
        return <Loader/>
    }

    if(fetchingError !== null){
        return <Text c="red">Błąd: {fetchingError}</Text>
    }

    if(tea === null){
        return <Text>Nie znaleziono herbaty.</Text>
    }

    return(
        <Stack>
            <TeaDetailsTitle name={tea.name} onBack={() => navigate(ViewType.TeaListView)}/>
            <TeaDetailsDetailField tea={tea}/>
            <Group>
                <Button onClick={() => setIsEditorOpen(true)}>Edytuj</Button>
                <Button c="red" variant="outline" onClick={handleDelete}>Usuń</Button>
            </Group>
            <Modal
                opened={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                centered
                size="lg"
            >
                <TeaEditorView tea={tea} onSuccess={handleEditSuccess}/>
            </Modal>
        </Stack>
    );
};
export default TeaDetailsInfoSection;
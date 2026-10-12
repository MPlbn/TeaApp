import TeaDetailsTitle from "./TeaDetailsTitle";
import TeaDetailsDetailField from "./TeaDetailsDetailField";
import { useEffect, useState } from "react";
import { Tea } from "../../types/Tea"; 
import { Loader, Text, Stack } from "@mantine/core";
import { getTeaByID } from "../../services/teaService";
import { useNavigate } from "react-router";
import { ViewType } from "../../types/enums";

type TeaDetailsInfoSectionProps = {
    teaID: number;
};

const TeaDetailsInfoSection = (props: TeaDetailsInfoSectionProps) => {
    const [tea, setTea] = useState<Tea | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchingError, setFetchingError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadTea = async () => {
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
    
            try {
                const fetcehedTea = await getTeaByID(props.teaID);
                setTea(fetcehedTea);
            } catch (error) {
                setFetchingError(error instanceof Error ? error.message : "Nie udało się pobrać herbaty.");
            } finally {
                setIsLoading(false);
            }
        }
        void loadTea();
    }, [props.teaID]);

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
        </Stack>
    );
};
export default TeaDetailsInfoSection;
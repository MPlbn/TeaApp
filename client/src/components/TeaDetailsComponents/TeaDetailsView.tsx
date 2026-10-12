import { useParams } from "react-router";
import { Loader, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { getTeaByID } from "../../services/teaService";
import { Tea } from "../../types/Tea";
import TeaDetailsTitle from "./TeaDetailsTitle";
import TeaDetailsDetailField from "./TeaDetailsDetailField";

const TeaDetailsView = () => {
    const {id} = useParams<{id: string}>();
    const [tea, setTea] = useState<Tea | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchingError, setFetchingError] = useState<string | null>(null);

    useEffect(() => {
            const loadTea = async () => {
                if(!id) {
                    setFetchingError("Nie podano ID herbaty.");
                    setIsLoading(false);
                    return;
                }

                const teaID = Number(id);

                if(!Number.isInteger(teaID) || teaID <= 0) {
                    setFetchingError("ID herbaty ma nieprawidłową wartość.");
                    setIsLoading(false);
                    return;
                }

                try {
                    const fetchedTea = await getTeaByID(teaID);
                    setTea(fetchedTea);
                } catch (error) {
                    setFetchingError(error instanceof Error ? error.message : "Nie udało się pobrać herbaty.");
                } finally {
                    setIsLoading(false);
                }
            }

            void loadTea();
        }, [id]);

    if(isLoading) {
        return <Loader/>;
    }

    if(fetchingError !== null) {
        return <Text c="red">Błąd: {fetchingError}</Text>;
    }

    if(tea === null) {
        return <Text>Nie znaleziono herbaty.</Text>;
    }

    return (
        <Stack>
            <TeaDetailsTitle
                name={tea.name}
                onBack={() => {window.history.back()}}
            />
            <TeaDetailsDetailField 
                teaType={tea.type}
                origin={tea.origin}
                description={tea.description}
                price={tea.price}
            />
        </Stack>
    );
}
export default TeaDetailsView;
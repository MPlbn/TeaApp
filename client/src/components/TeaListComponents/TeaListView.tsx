import { 
    Stack,
    Title,
    Text
} from "@mantine/core";
import { Tea } from "../../types/Tea";
import { TeaType } from "../../types/enums";
import { useEffect, useState } from "react";
import { Loader } from "@mantine/core";
import TeaListItem from "./TeaListItem";
import TeaListFilter from "./TeaListFilter";
import { getAllTeas } from "../../services/teaService";

const TeaListView = () => {

    const [teas, setTeas] = useState<Tea[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchingError, setFetchingError] = useState<string | null>(null);
    const [selectedTeaType, setSelectedTeaType] = useState<TeaType | null>(null);
    
    useEffect(() => {
        const loadTeas = async () => {
            try {
                const fetchedTeas = await getAllTeas();
                setTeas(fetchedTeas);
            } catch (error) {
                setFetchingError(error instanceof Error ? error.message : "Nie udało się pobrać herbat.")
            } finally {
                setIsLoading(false);
            }
        };

        void loadTeas();
    }, []);

    if(isLoading) {
        return <Loader/>;
    }
    
    if(fetchingError !== null) {
        return <Text c="red">Błąd: {fetchingError}</Text>
    }


    const filteredTeas = teas.filter((tea) => selectedTeaType === null ? true : tea.type === selectedTeaType);

    return (
        <Stack gap="md">
            <Title order={2}>Lista herbat</Title>
            <TeaListFilter
                selectedTeaType={selectedTeaType}
                onTeaTypeChange={setSelectedTeaType}
            />

            <Text c="dimmed" size="sm">
                Znalezionych herbat: {filteredTeas.length}
            </Text>

            <Stack gap="xs">
                {filteredTeas.map((tea) => {return <TeaListItem key={tea.id} tea={tea}/>})}
            </Stack>
        </Stack>
    );
}
export default TeaListView;
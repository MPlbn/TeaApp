import { 
    Stack,
    Title,
    Text
} from "@mantine/core";
import { TeaType } from "../../types/enums";
import { Loader } from "@mantine/core";
import TeaListItem from "./TeaListItem";
import TeaListFilter from "./TeaListFilter";
import { useGetAllTeasForListQuery } from "../../services/teaApi";
import { useState } from "react";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

const TeaListView = () => {
    const [selectedTeaType, setSelectedTeaType] = useState<TeaType | null>(null);
    
    const {
        data: teas,
        error: fetchingError,
        isLoading
    } = useGetAllTeasForListQuery();


    if(isLoading) {
        return <Loader/>;
    }
    
    if(fetchingError) {
        return <Text c="red">Błąd: {getApiErrorMessage(fetchingError)}</Text>
    }


    const filteredTeas = (teas ?? []).filter((tea) => selectedTeaType === null ? true : tea.type === selectedTeaType);

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
                {filteredTeas.map((tea) => {return <TeaListItem key={tea.id} shortTea={tea}/>})}
            </Stack>
        </Stack>
    );
}
export default TeaListView;
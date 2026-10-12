import { MockTeas } from "../../config/MockTeas";
import { 
    Stack,
    Title,
    Text
} from "@mantine/core";
import { Tea } from "../../types/Tea";
import { TeaType } from "../../types/enums";
import { useState } from "react";
import TeaListItem from "./TeaListItem";
import TeaListFilter from "./TeaListFilter";

const TeaListView = () => {

    const [selectedTeaType, setSelectedTeaType] = useState<TeaType | null>(null);

    const filteredTeas = MockTeas.filter((tea) => selectedTeaType === null ? true : tea.teaType === selectedTeaType);

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
                {filteredTeas.map((tea) => {return <TeaListItem key={tea.ID} tea={tea}/>})}
            </Stack>
        </Stack>
    );
}
export default TeaListView;
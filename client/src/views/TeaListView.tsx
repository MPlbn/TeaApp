import { MockTeas } from "../config/MockTeas";
import { 
    Stack,
    Title,
    Text
} from "@mantine/core";
import TeaListItem from "../components/TeaListItem";
import type { Tea } from "../types/Tea";
import TeaListFilter from "../components/TeaListFilter";
import { TeaType } from "../types/enums";
import { useState } from "react";

type TeaListViewProps = {
    onTeaSelect: (tea: Tea) => void;
};

export default function TeaListView(uProp: TeaListViewProps) {
    function handleTeaListItemClick(tea: Tea): void {
        uProp.onTeaSelect(tea);
    }

    const [selectedTeaType, setSelectedTeaType] = useState<TeaType | null>(null);

    const filteredTeas = MockTeas.filter(
        function (tea) {
            if (selectedTeaType === null) {
                return true;
            }

            return tea.teaType === selectedTeaType;
        }
    );

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
                {filteredTeas.map(
                    function (tea) {
                        return (
                            <TeaListItem 
                                key={tea.ID}
                                tea={tea}
                                onClick={handleTeaListItemClick}
                            />
                        );
                    }
                )}
            </Stack>
        </Stack>
    );
}

import { Stack } from "@mantine/core";
import { TeaType } from "../../types/enums";
import TeaTypeChooserSet from "./TeaTypeChooserSet";

type TeaListFilterProps = {
    selectedTeaType: TeaType | null;
    onTeaTypeChange: (teaType: TeaType | null) => void;
};


export default function TeaListFilter(uProp: TeaListFilterProps) {
    return (
        <Stack gap="md">
            <TeaTypeChooserSet 
                selectedTeaType={uProp.selectedTeaType}
                onTeaTypeChange={uProp.onTeaTypeChange}
            />
        </Stack>
    );
}

import { Stack } from "@mantine/core";
import { TeaType } from "../../types/enums";
import TeaTypeChooserSet from "./TeaTypeChooserSet";

type TeaListFilterProps = {
    selectedTeaType: TeaType | null;
    onTeaTypeChange: (teaType: TeaType | null) => void;
};


const TeaListFilter = (props: TeaListFilterProps) => {
    return (
        <Stack gap="md">
            <TeaTypeChooserSet 
                selectedTeaType={props.selectedTeaType}
                onTeaTypeChange={props.onTeaTypeChange}
            />
        </Stack>
    );
}
export default TeaListFilter;
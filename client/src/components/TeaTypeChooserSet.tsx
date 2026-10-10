import { Button } from "@mantine/core";
import TeaTypeChooser from "./TeaTypeChooser";
import { TeaType } from "../types/enums";
import { teaTypeOptions } from "../config/TeaTypeChooserOptions";


type TeaTypeChooserSetProps = {
    selectedTeaType: TeaType | null;
    onTeaTypeChange: (teaType: TeaType | null) => void;
}



export default function TeaTypeChooserSet(uProp: TeaTypeChooserSetProps) {
    function handleTeaTypeClick(uTeaType: TeaType | null): void {
        uProp.onTeaTypeChange(uTeaType);
    }
  
    return (
        <Button.Group>
            {teaTypeOptions.map(
                function (option) {
                    return (
                        <TeaTypeChooser 
                            key={option.label}
                            label={option.label}
                            active={uProp.selectedTeaType === option.value}
                            onClick={
                                function () {
                                    handleTeaTypeClick(option.value);
                                }
                            }
                        />
                    );
                }
            )}
        </Button.Group>
    );
}

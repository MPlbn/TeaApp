import { Button } from "@mantine/core";
import { TeaType } from "../../types/enums";
import { teaTypeOptions } from "../../config/TeaTypeChooserOptions";
import TeaTypeChooser from "./TeaTypeChooser";


type TeaTypeChooserSetProps = {
    selectedTeaType: TeaType | null;
    onTeaTypeChange: (teaType: TeaType | null) => void;
}

const TeaTypeChooserSet = (props: TeaTypeChooserSetProps) => {
  
    return (
        <Button.Group>
            {teaTypeOptions.map((option) => {
                return (
                    <TeaTypeChooser 
                        key={option.label}
                        label={option.label}
                        active={props.selectedTeaType === option.value}
                        onClick={() => {props.onTeaTypeChange(option.value)}}
                    />
                );
                }
            )}
        </Button.Group>
    );
}
export default TeaTypeChooserSet;
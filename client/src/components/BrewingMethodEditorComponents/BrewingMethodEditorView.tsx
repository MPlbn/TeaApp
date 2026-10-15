import { BrewingMethodFormData } from "../../types/FormDatas";
import BrewingMethodEditorPanel from "./BrewingMethodEditorPanel";
type BrewingMethodEditorViewProps = {
    data: BrewingMethodFormData
}

const BrewingMethodEditorView = (props: BrewingMethodEditorViewProps) => {
    return(
        <BrewingMethodEditorPanel data={props.data}/>
    )
};
export default BrewingMethodEditorView;
import { BrewingMethod } from "../../types/BrewingMethod";
import BrewingMethodEditorPanel from "./BrewingMethodEditorPanel";
type BrewingMethodEditorViewProps = {
    brewingMethod: BrewingMethod
    onSuccess: () => void;
}

const BrewingMethodEditorView = (props: BrewingMethodEditorViewProps) => {
    return(
        <BrewingMethodEditorPanel brewingMethod={props.brewingMethod} onSuccess={props.onSuccess}/>
    )
};
export default BrewingMethodEditorView;
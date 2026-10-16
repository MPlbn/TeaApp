import { BrewingMethod } from "../../types/BrewingMethod";
import BrewingMethodEditorPanel from "./BrewingMethodEditorPanel";
type BrewingMethodEditorViewProps = {
    brewingMethod: BrewingMethod
    onFinish: (message: string) => void;
}

const BrewingMethodEditorView = (props: BrewingMethodEditorViewProps) => {
    return(
        <BrewingMethodEditorPanel brewingMethod={props.brewingMethod} onFinish={props.onFinish}/>
    )
};
export default BrewingMethodEditorView;
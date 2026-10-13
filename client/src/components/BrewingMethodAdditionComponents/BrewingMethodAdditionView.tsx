import { BrewingMethod } from "../../types/BrewingMethod";
import BrewingMethodAdditionPanel from "./BrewingMethodAdditionPanel";

type BrewingMethodAdditionViewProps = {
    brewingMethod: BrewingMethod;
    onSuccess(): () => void;
};

const BrewingMethodAdditionView = (props: BrewingMethodAdditionViewProps) => {
    return(
        <BrewingMethodAdditionPanel brewingMethod={props.brewingMethod} onSuccess={props.onSuccess}/>
    );
};
export default BrewingMethodAdditionView;
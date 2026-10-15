import BrewingMethodAdditionPanel from "./BrewingMethodAdditionPanel";

type BrewingMethodAdditionViewProps = {
    teaID: number;
    onSuccess: () => void;
};

const BrewingMethodAdditionView = (props: BrewingMethodAdditionViewProps) => {
    return(
        <BrewingMethodAdditionPanel teaID={props.teaID} onSuccess={props.onSuccess}/>
    );
};
export default BrewingMethodAdditionView;
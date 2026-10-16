import BrewingMethodAdditionPanel from "./BrewingMethodAdditionPanel";

type BrewingMethodAdditionViewProps = {
    teaID: number;
    onFinish: () => void;
};

const BrewingMethodAdditionView = (props: BrewingMethodAdditionViewProps) => {
    return(
        <BrewingMethodAdditionPanel teaID={props.teaID} onFinish={props.onFinish}/>
    );
};
export default BrewingMethodAdditionView;
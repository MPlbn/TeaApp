import TeaEditorPanel from "./TeaEditorPanel";
import { Tea } from "../../types/Tea";

type TeaEditorViewProps = {
    tea: Tea;
    onSuccess: () => void;
};

const TeaEditorView = (props: TeaEditorViewProps) => {
    return(
        <TeaEditorPanel tea={props.tea} onSuccess={props.onSuccess}/>
    );
};
export default TeaEditorView; 
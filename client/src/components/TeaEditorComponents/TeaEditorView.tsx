import TeaEditorPanel from "./TeaEditorPanel";
import { Tea } from "../../types/Tea";

type TeaEditorViewProps = {
    tea: Tea;
    onFinish: () => void;
};

const TeaEditorView = (props: TeaEditorViewProps) => {
    return(
        <TeaEditorPanel tea={props.tea} onFinish={props.onFinish}/>
    );
};
export default TeaEditorView; 
import { Review } from "../../types/Review";
import ReviewEditorPanel from "./ReviewEditorPanel";

type ReviewEditorViewProps = {
    review: Review,
    onFinish: () => void;
}

const ReviewEditorView = (props: ReviewEditorViewProps) => {
    return(
        <ReviewEditorPanel review={props.review} onFinish={props.onFinish}/>
    )
}
export default ReviewEditorView;
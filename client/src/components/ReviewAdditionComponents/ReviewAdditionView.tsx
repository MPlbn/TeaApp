import ReviewAdditionPanel from "./ReviewAdditionPanel";

type ReviewAdditionViewProps = {
    teaID: number;
    onFinish: () => void;
}

const ReviewAdditionView = (props: ReviewAdditionViewProps) => {
    return(
        <ReviewAdditionPanel teaID={props.teaID} onFinish={props.onFinish}/>
    );
}
export default ReviewAdditionView;
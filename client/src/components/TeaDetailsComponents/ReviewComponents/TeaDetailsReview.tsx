import { Modal, Stack, Text, Group, Button } from "@mantine/core";
import { Review } from "../../../types/Review";
import { useState } from "react";
import { useAppDispatch } from "../../../store/hooks";
import { useDeleteReviewMutation } from "../../../services/teaApi";
import { openInfoModal } from "../../../store/uiSlice";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import ReviewEditorView from "../../EditorComponents/ReviewEditorView";
const DELETE_SUCCESS_MESSAGE = "Poprawnie usunięto recenzję!";

type TeaDetailsReviewProps = {
    review: Review
};

const TeaDetailsReview = (props: TeaDetailsReviewProps) => {
    const dispatch = useAppDispatch();
    const [isReviewEditorOpen, setIsReviewEditorOpen] = useState(false);
    const [deleteReview, {isLoading: isDeleting}] = useDeleteReviewMutation();

    const handleDelete = async () => {
        try {
            await deleteReview(props.review.id).unwrap();
            dispatch(openInfoModal({
                message: DELETE_SUCCESS_MESSAGE
            }));           
        } catch (error) {
            dispatch(openInfoModal({
                message: getApiErrorMessage(error)
            })); 
        }
    }

    return(
        <>
        <Stack>
            <Text>userID: {props.review.userId}</Text>
            <Text>Review: {props.review.review}</Text>
            <Text>Rating: {props.review.rating}</Text>

            <Group>
                <Button onClick={() => setIsReviewEditorOpen(true)}>Edytuj</Button>
                <Button c="red" onClick={handleDelete}>Usuń</Button>
            </Group>
        </Stack>
        
        <Modal
            opened={isReviewEditorOpen}
            onClose={() => setIsReviewEditorOpen(false)}
            title=""
            centered
            closeOnClickOutside={false}
            closeOnEscape={false}
        >
            <ReviewEditorView review={props.review} onFinish={() => setIsReviewEditorOpen(false)}/>
        </Modal>
        </>
    );
};
export default TeaDetailsReview;
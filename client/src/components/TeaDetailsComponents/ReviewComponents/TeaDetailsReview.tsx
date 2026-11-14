import { Modal, Stack, Text, Group, Button, Paper, Divider, Badge, Blockquote, Rating } from "@mantine/core";
import { Review } from "../../../types/Review";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useDeleteReviewMutation } from "../../../services/teaApi";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import ReviewEditorView from "../../EditorComponents/ReviewEditorView";
import { isUserAuthorizedToModifyReview } from "../../../utils/utils";
import { notifications } from "@mantine/notifications";

const DELETE_SUCCESS_MESSAGE = "Poprawnie usunięto recenzję!";

type TeaDetailsReviewProps = {
    review: Review;
};

const TeaDetailsReview = (props: TeaDetailsReviewProps) => {
    const dispatch = useAppDispatch();
    const [isReviewEditorOpen, setIsReviewEditorOpen] = useState(false);
    const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();
    const user = useAppSelector((state) => state.auth.user);
    const canModifyReview = isUserAuthorizedToModifyReview(props.review, user)

    const handleDelete = async () => {
        try {
            await deleteReview(props.review.id).unwrap();
            notifications.show({
                message: DELETE_SUCCESS_MESSAGE
            });
        } catch (error) {
            notifications.show({
                message: getApiErrorMessage(error)
            });
        }
    }

    const renderModifyButtons = () => {
        if (!canModifyReview) return <></>

        return (
            <Group justify="flex-end" gap="xs">
                <Button
                    size="xs"
                    variant="subtle"
                    onClick={() => setIsReviewEditorOpen(true)}
                >
                    Edytuj
                </Button>
                <Button
                    size="xs"
                    color="red"
                    variant="subtle"
                    onClick={handleDelete}
                    loading={isDeleting}
                >
                    Usuń
                </Button>
            </Group>
        )
    }

    return (
        <>
            <Blockquote cite={props.review.userName} textWrap="wrap">
                <Stack>
                    <Group justify="space-between" gap='xs'>
                        <Badge color="white" p="md">
                            <Group justify="space-between" gap='xs'>
                                <Text c="teaGreen.9">Ocena: </Text>
                                {/* <RatingStars rating={props.review.rating} /> */}
                                <Rating
                                    value={props.review.rating / 2}
                                    fractions={2}
                                    readOnly
                                />
                            </Group>
                        </Badge>
                        {renderModifyButtons()}

                    </Group>

                    <Text>{props.review.review}</Text>

                </Stack>
            </Blockquote >

            <Modal
                opened={isReviewEditorOpen}
                onClose={() => setIsReviewEditorOpen(false)}
                title=""
                centered
                closeOnClickOutside={false}
                closeOnEscape={false}
            >
                <ReviewEditorView review={props.review} onFinish={() => setIsReviewEditorOpen(false)} />
            </Modal>
        </>
    );
};
export default TeaDetailsReview;
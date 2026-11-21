import { Modal, Stack, Text, Group, Button, Paper, Divider, Badge, Blockquote, Rating, Box } from "@mantine/core";
import { Review } from "../../../types/Review";
import { useState } from "react";
import { useAppSelector } from "../../../store/hooks";
import { useDeleteReviewMutation } from "../../../services/teaApi";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { isUserAuthorizedToModifyReview } from "../../../utils/utils";
import { notifications } from "@mantine/notifications";
import DeleteConfirmationPanel from "../../DeleteConfirmationPanel";
import ReviewFormPanel from "../../FormComponents/FormPanels/ReviewFormPanel";
import ItemModificationMenu from "../../ItemModificationMenu";

const DELETE_SUCCESS_MESSAGE = "Poprawnie usunięto recenzję!";

type TeaDetailsReviewProps = {
    review: Review;
};

const TeaDetailsReview = (props: TeaDetailsReviewProps) => {
    const [modalMode, setModalMode] = useState<"Delete" | "Edit" | null>(null);
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

    const renderModalInsides = () => {
        if (modalMode === "Delete") {
            return (
                <DeleteConfirmationPanel
                    deletedObjectName="recenzję"
                    handleDelete={handleDelete}
                    handleCancel={() => setModalMode(null)}
                />
            )
        }

        if (modalMode === "Edit") {
            return <ReviewFormPanel initialReview={props.review} onFinish={() => setModalMode(null)} />
        }

        return <></>
    }

    return (
        <>
            <Blockquote cite={props.review.userName} textWrap="wrap" pos="relative">
                {canModifyReview && (
                    <Box pos="absolute" top={10} right={10} style={{ zIndex: 1 }}>
                        <ItemModificationMenu setModalMode={setModalMode} />
                    </Box>
                )}
                <Stack>
                    <Group justify="space-between" gap='xs'>
                        <Badge color="white" p="md">
                            <Group justify="space-between" gap='xs'>
                                <Text c="teaGreen.9">Ocena: </Text>
                                <Rating
                                    value={props.review.rating / 2}
                                    fractions={2}
                                    readOnly
                                />
                            </Group>
                        </Badge>
                    </Group>

                    <Text>{props.review.review}</Text>

                </Stack>
            </Blockquote >

            <Modal
                opened={modalMode !== null}
                onClose={() => setModalMode(null)}
                title=""
                centered
                closeOnClickOutside={false}
                closeOnEscape={false}
            >
                {renderModalInsides()}
            </Modal>
        </>
    );
};
export default TeaDetailsReview;
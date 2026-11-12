import { Button, Loader, Paper, Stack, Text, Modal } from "@mantine/core";
import { useState } from "react";
import TeaDetailsReview from "./TeaDetailsReview";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { useGetReviewsByTeaIDQuery } from "../../../services/teaApi";
import ReviewAdditionView from "../../AdditionComponents/ReviewAdditionView";
import { useAppSelector } from "../../../store/hooks";
import { doesUserOwnReviewInSet } from "../../../utils/utils";

type TeaDetailsReviewsSetProps = {
    teaID: number;
    canAddReview: boolean;
}

const TeaDetailsReviewsSet = (props: TeaDetailsReviewsSetProps) => {
    const [isReviewAdditionOpen, setIsReviewAdditionOpen] = useState(false);

    const user = useAppSelector((state) => state.auth.user);

    const {
        data: fetchedReviews,
        error: fetchingError,
        isLoading
    } = useGetReviewsByTeaIDQuery(props.teaID);

    if (isLoading) {
        return <Loader />
    }

    if (fetchingError) {
        return <Text c="red">Błąd: {getApiErrorMessage(fetchingError)}</Text>
    }

    const reviews = (fetchedReviews ?? []);

    const userAlreadyOwnsReview = doesUserOwnReviewInSet(reviews, user);

    const renderAddButton = () => {
        if (!props.canAddReview || userAlreadyOwnsReview) return <></>

        return (
            <>
                <Button onClick={() => setIsReviewAdditionOpen(true)}>Dodaj Recenzję</Button>
            </>
        )
    }

    return (
        <>
            <Paper withBorder radius="md">
                <Stack>
                    {reviews.map((review) => {
                        return <TeaDetailsReview key={review.id} review={review} />
                    })}
                    {renderAddButton()}
                </Stack>
            </Paper>

            <Modal
                opened={isReviewAdditionOpen}
                onClose={() => setIsReviewAdditionOpen(false)}
                title=""
                centered
                closeOnClickOutside={false}
                closeOnEscape={false}
            >
                <ReviewAdditionView teaID={props.teaID} onFinish={() => setIsReviewAdditionOpen(false)} />
            </Modal>
        </>
    );
};
export default TeaDetailsReviewsSet;
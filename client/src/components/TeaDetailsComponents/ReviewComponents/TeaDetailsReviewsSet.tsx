import { Button, Loader, Paper, Stack, Text, Modal } from "@mantine/core";
import { useState } from "react";
import TeaDetailsReview from "./TeaDetailsReview";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { useGetReviewsByTeaIDQuery } from "../../../services/teaApi";
import ReviewAdditionView from "../../ReviewAdditionComponents/ReviewAdditionView";

type TeaDetailsReviewsSetProps = {
    teaID: number;
}

const TeaDetailsReviewsSet = (props: TeaDetailsReviewsSetProps) => {
    const [isReviewAdditionOpen, setIsReviewAdditionOpen] = useState(false);

    const {
        data: fetchedReviews,
        error: fetchingError,
        isLoading
    } = useGetReviewsByTeaIDQuery(props.teaID);

    if(isLoading){
        return <Loader/>
    }
    
    if(fetchingError){
        return <Text c="red">Błąd: {getApiErrorMessage(fetchingError)}</Text>
    }

    const reviews = (fetchedReviews ?? []);

    return(
        <>
        <Paper withBorder radius="md">
            <Stack>
                {reviews.map((review) => {
                    return <TeaDetailsReview key={review.id} review={review}/>
                })}
                <Button onClick={() => setIsReviewAdditionOpen(true)}>Dodaj Recenzję</Button>
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
            <ReviewAdditionView teaID={props.teaID} onFinish={() => setIsReviewAdditionOpen(false)}/>
        </Modal>
        </>
    );
};
export default TeaDetailsReviewsSet;
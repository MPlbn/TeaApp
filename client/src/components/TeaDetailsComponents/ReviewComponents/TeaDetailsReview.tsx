import { Stack, Text } from "@mantine/core";
import { Review } from "../../../types/Review";

type TeaDetailsReviewProps = {
    review: Review
};

const TeaDetailsReview = (props: TeaDetailsReviewProps) => {

    return(
        <Stack>
            <Text>userID: {props.review.userId}</Text>
            <Text>Review: {props.review.review}</Text>
            <Text>Rating: {props.review.rating}</Text>
        </Stack>
    );
};
export default TeaDetailsReview;
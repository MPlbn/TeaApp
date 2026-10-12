import { Loader, Paper, Stack, Text } from "@mantine/core";
import { Review } from "../../types/Review";
import { useEffect, useState } from "react";
import { getReviewsByTeaID } from "../../services/teaService";
import TeaDetailsReview from "./TeaDetailsReview";

type TeaDetailsReviewsSetProps = {
    teaID: number;
}

const TeaDetailsReviewsSet = (props: TeaDetailsReviewsSetProps) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchingError, setFetchingError] = useState<string | null>(null);

    useEffect(() => {
        const loadReviews = async () => {
            try {
                const fetchedReviews = await getReviewsByTeaID(props.teaID);
                setReviews(fetchedReviews);
            } catch (error) {
                setFetchingError(error instanceof Error ? error.message : "Nie udało się pobrać recenzji");
            } finally {
                setIsLoading(false);
            }
        }
        void loadReviews();
    }, [props.teaID]);

    if(isLoading){
        return <Loader/>
    }
    
    if(fetchingError !== null){
        return <Text c="red">Błąd: ${fetchingError}</Text>
    }

    return(
        <Paper withBorder radius="md">
            <Stack>
                {reviews.map((review) => {
                    return <TeaDetailsReview key={review.id} review={review}/>
                })}
            </Stack>
        </Paper>
    );
};
export default TeaDetailsReviewsSet;
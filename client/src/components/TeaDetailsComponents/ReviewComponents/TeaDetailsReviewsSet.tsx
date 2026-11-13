import { Button, Loader, Paper, Stack, Text, Modal, Title, Group } from "@mantine/core";
import { useState } from "react";
import TeaDetailsReview from "./TeaDetailsReview";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { useGetReviewsByTeaIDQuery } from "../../../services/teaApi";
import ReviewAdditionView from "../../AdditionComponents/ReviewAdditionView";
import { useAppSelector } from "../../../store/hooks";
import { doesUserOwnReviewInSet } from "../../../utils/utils";
import sectionStyles from "../../../Styles/TeaDetailsSection.module.css"

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
                <Button variant="default" color="teaGreen" onClick={() => setIsReviewAdditionOpen(true)}>Dodaj Recenzję</Button >
            </>
        )
    }

    const renderReviews = () => {
        if (reviews.length === 0) {
            return (
                <Paper withBorder radius="lg" p="xl" bg="white">
                    <Text c="dimmed" ta="center">
                        Ta herbata nie ma jeszcze żadnych recenzji.
                    </Text>
                </Paper>
            )
        }

        return (
            reviews.map((review) => {
                return <TeaDetailsReview key={review.id} review={review} />
            })
        )
    }

    return (
        <>
            <Stack className={sectionStyles.section}>
                <Group justify="space-between" align="center">
                    <Title order={2}>Recenzje</Title>
                    {renderAddButton()}
                </Group>

                {renderReviews()}
            </Stack>


            <Modal
                opened={isReviewAdditionOpen}
                onClose={() => setIsReviewAdditionOpen(false)}
                closeOnClickOutside={false}
                closeOnEscape={false}
            >
                <ReviewAdditionView teaID={props.teaID} onFinish={() => setIsReviewAdditionOpen(false)} />
            </Modal>
        </>
    );
};
export default TeaDetailsReviewsSet;
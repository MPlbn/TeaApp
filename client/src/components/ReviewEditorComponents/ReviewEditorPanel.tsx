import useForm from "../../hooks/useForm";
import { useEditReviewMutation } from "../../services/teaApi";
import { useAppDispatch } from "../../store/hooks";
import { openInfoModal } from "../../store/uiSlice";
import { emptyReviewFormData, ReviewFormData } from "../../types/FormDatas";
import { Review } from "../../types/Review";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { convertReviewFormDataToNewReview, convertReviewToReviewFormData } from "../../utils/utils";
import { reviewFormValidator } from "../../validators/formValidators";
import { Stack, Title, Button, Group, Paper, Text } from "@mantine/core";
import ReviewForm from "../FormComponents/ReviewForm";

const REVIEW_EDIT_SUCCESS_MESSAGE = "Poprawnie edytowano recenzję!";

type ReviewEditorPanelProps = {
    review: Review,
    onFinish: () => void;
}

const ReviewEditorPanel = (props: ReviewEditorPanelProps) => {
    const dispatch = useAppDispatch();
    const startingFormData = convertReviewToReviewFormData(props.review);

    const {
        formData,
        updateField,
        isValid,
        getData
    } = useForm<ReviewFormData>(reviewFormValidator, emptyReviewFormData, startingFormData);

    const [editReview, {isLoading: isSaving}] = useEditReviewMutation();

    const handleEdit = async () => {
        if(!isValid()){
            return;
        }

        const reviewToEdit = convertReviewFormDataToNewReview(getData(), props.review.teaId, 1) // userId = 1, TODO change when user implemented

        if(reviewToEdit === null){
            return;
        }

        try {
            await editReview({reviewId:props.review.id, review:reviewToEdit}).unwrap();
            dispatch(openInfoModal({
                message: REVIEW_EDIT_SUCCESS_MESSAGE
            }))
            props.onFinish();
        } catch (error) {
            dispatch(openInfoModal({
                message: getApiErrorMessage(error)
            }));
        }
    };

    return(
       <Stack>
            <div>
                <Title order={1}>Edytuj sposób recenzję</Title>
                <Text c="dimmed" mt="xs">
                    Uzupełnij informacje o nowej recenzji.
                </Text>
            </div>

            <Paper withBorder p="lg" radius="md">
                <Stack gap="md">
                    <ReviewForm formData={formData} updateField={updateField}/>
                    <Group justify="flex-end" mt="sm">
                        <Button 
                            variant="gradient" 
                            onClick={handleEdit} 
                            disabled={!isValid() || isSaving} 
                            loading={isSaving}
                        >
                            Zapisz zmiany
                        </Button>
                    </Group>
                </Stack>
            </Paper>
        </Stack> 
    );
}
export default ReviewEditorPanel;
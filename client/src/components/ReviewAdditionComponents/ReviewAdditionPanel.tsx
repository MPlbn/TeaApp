import { Paper, Stack, Text, Title, Group, Button } from "@mantine/core";
import { useAppDispatch } from "../../store/hooks";
import useForm from "../../hooks/useForm";
import { emptyReviewFormData, ReviewFormData } from "../../types/FormDatas";
import { reviewFormValidator } from "../../validators/formValidators";
import { useAddReviewMutation } from "../../services/teaApi";
import { convertReviewFormDataToNewReview } from "../../utils/utils";
import { openInfoModal } from "../../store/uiSlice";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import ReviewForm from "../FormComponents/ReviewForm";

const REVIEW_ADD_SUCCESS_MESSAGE = "Poprawnie dodano recenzję!";

type ReviewAdditionPanelProps = {
    teaID: number;
    onFinish: () => void;
}

const ReviewAdditionPanel = (props: ReviewAdditionPanelProps) => {
    const dispatch = useAppDispatch();

    const {
        formData,
        updateField,
        clearForm,
        isValid,
        getData
    } = useForm<ReviewFormData>(reviewFormValidator, emptyReviewFormData);

    const [addReview, {isLoading: isAdding}] = useAddReviewMutation();

    const handleAdd = async () => {
        if(!isValid()){
            return;
        }

        const reviewToAdd = convertReviewFormDataToNewReview(getData(), props.teaID, 1) // 1 - userID before users work - TODO change when user added

        if(reviewToAdd === null){
            return;
        }

        try {
            await addReview(reviewToAdd).unwrap();
            props.onFinish();
            dispatch(openInfoModal({
                message: REVIEW_ADD_SUCCESS_MESSAGE
            }));
        } catch (error) {
            dispatch(openInfoModal({
                message: getApiErrorMessage(error)
            }));
        }

    };

    const handleClear = () => {
        clearForm();
    }

    return(
        <Stack>
            <div>
                <Title order={1}>Dodaj recenzję</Title>
                <Text c="dimmed" mt="xs">
                    Uzupełnij recenzję
                </Text>
            </div>

            <Paper withBorder p="lg" radius="md">
                <Stack gap="md">
                    <ReviewForm formData={formData} updateField={updateField}/>
                    <Group justify="flex-end" mt="sm">
                        <Button 
                            variant="default" 
                            onClick={handleClear} 
                            disabled={isAdding} 
                            loading={isAdding}
                        >
                            Wyczyść
                        </Button>
                        <Button 
                            variant="gradient" 
                            onClick={handleAdd} 
                            disabled={!isValid || isAdding} 
                            loading={isAdding}
                        >
                            Dodaj
                        </Button>
                    </Group>
                </Stack>
            </Paper>
        </Stack>
    );
}
export default ReviewAdditionPanel;
import useForm from "../../hooks/useForm";
import { useEditReviewMutation } from "../../services/teaApi";
import { emptyReviewFormData, ReviewFormData } from "../../types/FormDatas";
import { Review } from "../../types/Review";
import { convertReviewFormDataToNewReview, convertReviewToReviewFormData } from "../../utils/utils";
import { reviewFormValidator } from "../../validators/formValidators";import FormPanel from "../FormComponents/FormPanel";
import ReviewForm from "../FormComponents/ReviewForm";

const REVIEW_EDIT_SUCCESS_MESSAGE = "Poprawnie edytowano recenzję!";

type ReviewEditorViewProps = {
    review: Review,
    onFinish: () => void;
}

const ReviewEditorView = (props: ReviewEditorViewProps) => {
    const startingFormData = convertReviewToReviewFormData(props.review);

    const {
        formData,
        updateField,
        isValid,
        getData
    } = useForm<ReviewFormData>(reviewFormValidator, emptyReviewFormData, startingFormData);

    const [editReview, {isLoading: isSaving}] = useEditReviewMutation();

    const handleSave = async () => {
        const reviewToEdit = convertReviewFormDataToNewReview(getData(), props.review.teaId, 1) // userId = 1, TODO change when user implemented

        if(reviewToEdit === null){
            return;
        }

        await editReview({reviewId:props.review.id, review:reviewToEdit}).unwrap();
    };

    return(
       <FormPanel
            title="Edytuj recenzję"
            description="Uzupełnij informacje o recenzji"
            successMessage={REVIEW_EDIT_SUCCESS_MESSAGE}
            submitLabel="Zapisz zmiany"
            isValid={isValid()}
            isSaving={isSaving}
            onSave={handleSave}
            onFinish={props.onFinish}
       >
            <ReviewForm
                formData={formData}
                updateField={updateField}
            />
       </FormPanel>
    );
}
export default ReviewEditorView;
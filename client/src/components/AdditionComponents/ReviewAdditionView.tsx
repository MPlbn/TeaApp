import useForm from "../../hooks/useForm";
import { emptyReviewFormData, ReviewFormData } from "../../types/FormDatas";
import { reviewFormValidator } from "../../validators/formValidators";
import { useAddReviewMutation } from "../../services/teaApi";
import { convertReviewFormDataToNewReview } from "../../utils/utils";
import ReviewForm from "../FormComponents/ReviewForm";
import FormPanel from "../FormComponents/FormPanel";
import { useAppSelector } from "../../store/hooks";

const REVIEW_ADD_SUCCESS_MESSAGE = "Poprawnie dodano recenzję!";

type ReviewAdditionViewProps = {
    teaID: number;
    onFinish: () => void;
}

const ReviewAdditionView = (props: ReviewAdditionViewProps) => {
    const user = useAppSelector((state) => state.auth.user);

    if (!user) return <>GUEST USER, HOW DID YOU GET HERE</>;

    const {
        formData,
        updateField,
        clearForm,
        isValid,
        getData
    } = useForm<ReviewFormData>(reviewFormValidator, emptyReviewFormData);

    const [addReview, { isLoading: isAdding }] = useAddReviewMutation();

    const handleSave = async () => {
        const reviewToAdd = convertReviewFormDataToNewReview(getData(), props.teaID, user.id)

        if (reviewToAdd === null) {
            return;
        }
        await addReview(reviewToAdd).unwrap();
    };

    const handleClear = () => {
        clearForm();
    }

    return (
        <FormPanel
            title="Dodaj recenzję"
            description="Uzupełnij informacje o recenzji"
            successMessage={REVIEW_ADD_SUCCESS_MESSAGE}
            submitLabel="Dodaj"
            isValid={isValid()}
            isSaving={isAdding}
            onSave={handleSave}
            onFinish={props.onFinish}
            onClear={handleClear}
        >
            <ReviewForm
                formData={formData}
                updateField={updateField}
            />
        </FormPanel>
    );
}
export default ReviewAdditionView;
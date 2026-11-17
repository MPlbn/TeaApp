import { FormMode, FormPanelDetails } from "../../types/FormDatas";
import { Grid, Rating, Stack, Text, Textarea } from "@mantine/core";
import { Review } from "../../types/Review";
import { NewReview, useAddReviewMutation, useEditReviewMutation } from "../../services/teaApi";
import useForm from "../../hooks/useForm";
import FormPanel from "./FormPanel";

//CONSTS
const ADD_FORM_PANEL_DETAILS = {
    title: "Dodaj recenzję",
    description: "Uzupełnij informacje o recenzji",
    successMessage: "Poprawnie dodano recenzję!",
    submitLabel: "Dodaj"
} as FormPanelDetails;

const EDIT_FORM_PANEL_DETAILS = {
    title: "Edytuj recenzję",
    description: "Uzupełnij informacje o recenzji",
    successMessage: "Poprawnie edytowano recenzję!",
    submitLabel: "Zapisz zmiany"
} as FormPanelDetails;

type FormData = {
    teaId: number;
    userId: string;
    review: string;
    rating: number | null;
}

const getEmptyFormData = (teaId: number, userId: string): FormData => ({
    teaId: teaId,
    userId: userId,
    review: "",
    rating: 0
} as FormData);

const converter = (formData: FormData): NewReview => {
    return {
        teaId: formData.teaId,
        userId: formData.userId,
        review: formData.review,
        rating: Number(formData.rating)
    } as NewReview;
}

const validator = (formData: FormData): boolean => {
    if (formData.review === "") return false;

    if (formData.rating === null) return false;

    return true
}

type ReviewFormProps = {
    onFinish?: () => void;
    initialReview?: Review;
    teaId?: number
    userId?: string
};

const ReviewForm = (props: ReviewFormProps) => {
    const [addReview, { isLoading: isAdding }] = useAddReviewMutation();
    const [editReview, { isLoading: isEditing }] = useEditReviewMutation();

    const teaId = props.initialReview?.teaId ?? props.teaId ?? null;
    const userId = props.initialReview?.userId ?? props.userId ?? null;

    if (teaId === null || userId === null) return <></>

    const formMode = props.initialReview ? FormMode.Edit : FormMode.Add
    const emptyForm = getEmptyFormData(teaId, userId);

    const {
        formData,
        updateField,
        clearForm,
        isValid,
        getData
    } = useForm<FormData, NewReview>(validator, converter, emptyForm, props.initialReview ?? emptyForm);

    const handleSave = async () => {
        const reviewToSave = getData();

        if (reviewToSave === null) return;

        switch (formMode) {
            case FormMode.Add:
                await addReview(reviewToSave).unwrap();
                break;
            case FormMode.Edit:
                await editReview({ reviewId: props.initialReview!.id, review: reviewToSave }).unwrap();
                break;
            default:
                break;
        }
    }

    const getDetails = (): FormPanelDetails => {
        switch (formMode) {
            case FormMode.Add:
                return ADD_FORM_PANEL_DETAILS;
            case FormMode.Edit:
                return EDIT_FORM_PANEL_DETAILS;
        }
    }

    const getIsSaving = () => {
        switch (formMode) {
            case FormMode.Add:
                return isAdding;
            case FormMode.Edit:
                return isEditing;
        }
    }

    return (
        <FormPanel
            details={getDetails()}
            isValid={isValid()}
            isSaving={getIsSaving()}
            onSave={handleSave}
            onFinish={props.onFinish ?? clearForm}
            onClear={formMode === FormMode.Add ? clearForm : undefined}
        >
            <Grid gap="md">
                <Grid.Col span={{ base: 12, sm: 12 }}>
                    <Textarea
                        label="Recenzja"
                        placeholder="Wpisz treść recenzji..."
                        value={formData.review}
                        onChange={(event) => { updateField("review", event.currentTarget.value) }}
                        required
                    />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 12 }}>
                    <Stack>
                        <Text size="sm" c="dimmed">Ocena</Text>
                        <Rating
                            value={formData.rating === null ? 0 : formData.rating / 2}
                            onChange={(value) => { updateField("rating", Math.floor(value * 2)) }}
                            size="xl"
                            count={5}
                            fractions={2}
                            allowClear
                        />

                    </Stack>
                </Grid.Col>
            </Grid>
        </FormPanel>
    );
}
export default ReviewForm
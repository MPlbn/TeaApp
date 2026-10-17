import { ReviewFormData } from "../../types/FormDatas";
import { Grid, NumberInput, Select, TextInput } from "@mantine/core";

const ratingOptions = Array.from(
    {length: 10},
    (_, i) => String(i+1)
)

type ReviewFormProps = {
    formData: ReviewFormData;
    updateField: <TKey extends keyof ReviewFormData>(
            key: TKey,
            value: ReviewFormData[TKey]
        ) => void; 
};

const ReviewForm = (props: ReviewFormProps) => {

    return(
        <Grid gap="md">
            <Grid.Col span={{ base: 12, sm: 12 }}>
                <TextInput
                    label="Recenzja"
                    placeholder="Wpisz treść recenzji..."
                    value={props.formData.review}
                    onChange={(event) => {props.updateField("review", event.currentTarget.value)}}
                    required
                />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 12 }}>
                <Select
                    label="Ocena"
                    placeholder="Wybierz ocenę"
                    data={ratingOptions}
                    value={props.formData.rating === null ? null : String(props.formData.rating)}
                    onChange={(value) => {props.updateField("rating", value === null ? null : Number(value))}}
                    required
                />
            </Grid.Col>
        </Grid>
    );
}
export default ReviewForm
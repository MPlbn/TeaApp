import { Grid, Rating, Stack, Text, Textarea } from "@mantine/core";
import { ReviewFormData } from "../FormPanels/ReviewFormPanel";

type ReviewFormProps = {
    formData: ReviewFormData;
    updateField: <TKey extends keyof ReviewFormData>(key: TKey, value: ReviewFormData[TKey]) => void;
};

const ReviewForm = (props: ReviewFormProps) => {
    return (
        <Grid gap="md">
            <Grid.Col span={{ base: 12, sm: 12 }}>
                <Textarea
                    label="Recenzja"
                    placeholder="Wpisz treść recenzji..."
                    value={props.formData.review}
                    onChange={(event) => { props.updateField("review", event.currentTarget.value) }}
                    required
                />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 12 }}>
                <Stack>
                    <Text size="sm" c="dimmed">Ocena</Text>

                    <Rating
                        value={props.formData.rating === null ? 0 : props.formData.rating / 2}
                        onChange={(value) => { props.updateField("rating", Math.floor(value * 2)) }}
                        size="xl"
                        count={5}
                        fractions={2}
                        allowClear
                    />
                </Stack>
            </Grid.Col>
        </Grid>
    );
}
export default ReviewForm
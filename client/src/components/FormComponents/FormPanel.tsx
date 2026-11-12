import { useAppDispatch } from "../../store/hooks"
import { ReactNode, useState } from "react";
import { openInfoModal } from "../../store/uiSlice";
import { Stack, Title, Text, Paper, Group, Button } from "@mantine/core";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import styles from "../../Styles/FormPanel.module.css"

type FormPanelProps = {
    title: string;
    description: string;
    successMessage: string;
    submitLabel: string;
    isValid: boolean;
    isSaving: boolean;
    onSave: () => Promise<void>;
    onFinish: () => void;
    onClear?: () => void;
    children: ReactNode;
}

const FormPanel = (props: FormPanelProps) => {
    const dispatch = useAppDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSave = async () => {
        if (!props.isValid || props.isSaving || isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        try {
            await props.onSave();

            dispatch(openInfoModal({
                message: props.successMessage
            }));
        } catch (error) {
            dispatch(openInfoModal({
                message: getApiErrorMessage(error)
            }));
        } finally {
            setIsSubmitting(false);
            props.onFinish();
        }

    }
    const isBusy = props.isSaving || isSubmitting;

    return (
        <Stack className={styles.panel} gap="lg">
            <Stack className={styles.header} gap="xs">
                <Title order={1} ta="center">{props.title}</Title>
                <Text c="dimmed" mt="xs">
                    {props.description}
                </Text>
            </Stack>

            <Paper className={styles.form} withBorder p="xl" radius="lg">
                <Stack gap="lg">
                    {props.children}

                    <Group justify="flex-end" mt="xs">
                        {props.onClear && (
                            <Button
                                className={styles.secondaryButton}
                                variant="default"
                                radius="md"
                                onClick={props.onClear}
                                disabled={isBusy}
                            >
                                Wyczyść
                            </Button>
                        )}

                        <Button
                            className={styles.primaryButton}
                            color="teaGreen"
                            radius="md"
                            onClick={handleSave}
                            disabled={!props.isValid || isBusy}
                            loading={isBusy}
                        >
                            {props.submitLabel}
                        </Button>
                    </Group>
                </Stack>
            </Paper>
        </Stack>
    );
}
export default FormPanel;
import { ReactNode } from "react";
import { Stack, Title, Text, Paper, Group, Button } from "@mantine/core";
import styles from "../../../Styles/FormPanel.module.css"
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { FormPanelDetails } from "../../../types/FormDatas";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";


type FormPanelProps = {
    details: FormPanelDetails;
    isValid: boolean;
    isSaving: boolean;
    onSave: () => Promise<void>;
    onFinish: () => void;
    onClear?: () => void;
    children: ReactNode;
}

const FormPanel = (props: FormPanelProps) => {
    const handleSave = async () => {
        if (!props.isValid || props.isSaving) {
            return;
        }

        try {
            await props.onSave();

            notifications.show({
                title: "SUKCES",
                message: props.details.successMessage,
                color: "teaGreen.8",
                icon: <IconCheck />
            })
            props.onFinish();
        } catch (error) {
            notifications.show({
                title: "BŁĄD",
                message: getApiErrorMessage(error),
                color: "red",
                icon: <IconX />
            });
        }
    }
    const isBusy = props.isSaving;

    return (
        <Stack className={styles.panel} gap="lg">
            <Stack className={styles.header} gap="xs">
                <Title order={1} ta="center">{props.details.title}</Title>
                <Text c="dimmed" mt="xs">
                    {props.details.description}
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
                            {props.details.submitLabel}
                        </Button>
                    </Group>
                </Stack>
            </Paper>
        </Stack>
    );
}
export default FormPanel;
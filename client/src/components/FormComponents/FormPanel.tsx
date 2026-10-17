import { useAppDispatch } from "../../store/hooks"
import { ReactNode, useState } from "react";
import { openInfoModal } from "../../store/uiSlice";
import { Stack, Title, Text, Paper, Group, Button } from "@mantine/core";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

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
        if(!props.isValid || props.isSaving || isSubmitting){
            return;
        }

        setIsSubmitting(true);

        try {
            await props.onSave();

            dispatch(openInfoModal({
                message: props.successMessage
            }));
            props.onFinish();
        } catch (error) {
            dispatch(openInfoModal({
                message: getApiErrorMessage(error)
            }));
        } finally {
            setIsSubmitting(false);
        }

    }
    const isBusy = props.isSaving || isSubmitting;

    return(
        <Stack>
            <div>
                <Title order={1}>{props.title}</Title>

                <Text c="dimmed" mt="xs">
                    {props.description}
                </Text>
            </div>
        
            <Paper withBorder p="lg" radius="md">
                <Stack gap="md">
                    {props.children}

                    <Group justify="flex-end" mt="sm">
                        {props.onClear && (
                            <Button
                                variant="default"
                                onClick={props.onClear}
                                disabled={isBusy}
                            >
                                Wyczyść
                            </Button>
                        )}
                        
                        <Button
                            variant="gradient"
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
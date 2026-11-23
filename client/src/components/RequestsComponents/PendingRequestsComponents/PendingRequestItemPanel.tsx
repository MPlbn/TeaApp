import { Button, Group, Paper, Stack, Textarea } from "@mantine/core";
import { ReactNode } from "react";

type PendingRequestItemPanelProps = {
    children: ReactNode;
    onDetails: () => void;
    onAccept: () => void;
    onReject: () => void;
    resolutionMessage: string;
    onResolutionMessageChange: (uMessage: string) => void;
    isLoading?: boolean;
}

const PendingRequestItemPanel = (props: PendingRequestItemPanelProps) => {
    return (
        <Paper withBorder radius="md" p="md">
            <Stack gap="md">
                {props.children}

                <Textarea
                    label="Powód decyzji"
                    placeholder="Opcjonalna wiadomość dla właściciela..."
                    value={props.resolutionMessage}
                    onChange={(event) => props.onResolutionMessageChange(event.currentTarget.value)}
                    autosize
                    minRows={2}
                    maxRows={4}
                    radius="md"
                />

                <Group grow>
                    <Button
                        variant="outline"
                        onClick={props.onDetails}
                        radius="md"
                        size="sm"
                        color="teaGreen.7"
                    >
                        Detale
                    </Button>

                    <Button
                        color="red.7"
                        variant="filled"
                        onClick={props.onReject}
                        loading={props.isLoading}
                        radius="md"
                        size="sm"
                    >
                        Odrzuć
                    </Button>

                    <Button
                        variant="filled"
                        color="green.7"
                        onClick={props.onAccept}
                        loading={props.isLoading}
                        radius="md"
                        size="sm"
                    >
                        Akceptuj
                    </Button>
                </Group>
            </Stack>
        </Paper>
    );
};

export default PendingRequestItemPanel;
import { Button, Group, Paper, Stack } from "@mantine/core";
import { ReactNode } from "react";

type MyRequestItemPanelProps = {
    children: ReactNode;
    onDetails: () => void;
    onCancel: () => void;
    isPending: boolean;
}

const MyRequestItemPanel = (props: MyRequestItemPanelProps) => {
    return (
        <Paper withBorder radius="md" p="md">
            <Stack gap="md">
                {props.children}

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

                    {props.isPending && <Button
                        color="red.7"
                        variant="filled"
                        onClick={props.onCancel}
                        radius="md"
                        size="sm"
                    >
                        Wycofaj prośbę
                    </Button>}
                </Group>
            </Stack>
        </Paper>
    )
}

export default MyRequestItemPanel
import { Button, Group, Stack } from "@mantine/core";
import { ReactNode } from "react"

type PendingRequestItemPanelProps = {
    children: ReactNode;
}

const PendingRequestItemPanel = (props: PendingRequestItemPanelProps) => {
    const handleAccept = async () => {
        console.log("zaakceptowane")
    }

    const handleReject = async () => {
        console.log("odrzucone")
    }

    return (
        <Stack>
            {props.children}
            <Group>
                <Button
                    onClick={handleAccept}
                >Zaakceptuj</Button>
                <Button
                    onClick={handleReject}
                >Odrzuć</Button>
            </Group>
        </Stack>
    )
}

export default PendingRequestItemPanel
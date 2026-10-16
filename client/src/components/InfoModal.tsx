import { closeInfoModal } from "../store/uiSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Stack, Modal, Text, Button } from "@mantine/core";

const InfoModal = () => {
    const dispatch = useAppDispatch();

    const infoModal = useAppSelector((state) => state.ui.infoModal);

    const isOpen = infoModal !== null;

    return(
        <Modal
            opened={isOpen}
            onClose={() => dispatch(closeInfoModal())}
            title=""
            centered
        >
            <Stack>
                <Text>{infoModal?.message ?? ""}</Text>
                <Button onClick={() => dispatch(closeInfoModal())}>OK</Button>
            </Stack>
        </Modal>
    )
}
export default InfoModal;
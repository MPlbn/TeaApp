import { useParams } from "react-router";
import { Button, Stack, Text, Modal } from "@mantine/core";
import TeaDetailsBrewingMethodsSet from "./BrewingMethodComponents/TeaDetailsBrewingMethodsSet";
import TeaDetailsReviewsSet from "./ReviewComponents/TeaDetailsReviewsSet";
import TeaDetailsInfoSection from "./TeaComponents/TeaDetailsInfoSection";
import { useCallback, useState } from "react";

const TeaDetailsView = () => {
    const {id} = useParams<{id: string}>(); // TODO other way
    const teaID = Number(id);

    const [infoModalMessage, setInfoModalMessage] = useState<string | null>(null)
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)

    const openInfoModalWithMessage = useCallback((message: string) => {
        setInfoModalMessage(message);
        setIsInfoModalOpen(true);
    }, []);

    if(!id ||
        !Number.isInteger(teaID) ||
        teaID <= 0
    ) {
        return <Text c="red">Nieprawidłowe ID herbaty.</Text>;
    }

    return (
        <>
        <Stack>
            <TeaDetailsInfoSection teaID={teaID} openInfoModalWithMessage={openInfoModalWithMessage}/>
            <TeaDetailsBrewingMethodsSet teaID={teaID} openInfoModalWithMessage={openInfoModalWithMessage}/>
            <TeaDetailsReviewsSet teaID={teaID}/>
        </Stack>
        <Modal
            opened={isInfoModalOpen}
            onClose={() => setIsInfoModalOpen(false)}
            title=""
            centered
        >
            <Stack>
                <Text>{infoModalMessage}</Text>
                <Button onClick={() => setIsInfoModalOpen(false)}>OK</Button>

            </Stack>
        </Modal>
        </>
    );
}
export default TeaDetailsView;
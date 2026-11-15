import { Button, Loader, Modal, SimpleGrid, Stack, Text, Title } from "@mantine/core"
import { useGetTeaWareListQuery } from "../../services/teaApi"
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import sectionStyles from "../../Styles/TeaDetailsSection.module.css";
import TeaWareItem from "./TeaWareItem";
import { useState } from "react";
import TeaWareAdditionView from "../AdditionComponents/TeaWareAdditionView";


const TeaWareListView = () => {
    const [isAdditionModalOpen, setIsAdditionModalOpen] = useState(false);

    const {
        data: fetchedTeaWares,
        error: fetchingError,
        isLoading
    } = useGetTeaWareListQuery();

    if (isLoading) return <Loader />

    if (fetchingError) return <Text c="red">Błąd: {getApiErrorMessage(fetchingError)}</Text>

    const teaWares = fetchedTeaWares ?? [];

    return (
        <>
            <Stack className={sectionStyles.section}>
                <Title order={1} c="teaGreen.9">Lista naczyń</Title>

                <Button
                    onClick={() => setIsAdditionModalOpen(true)}
                >
                    Dodaj naczynie
                </Button>

                <Text c="dimmed" size="sm">
                    Znalezionych naczyń: {teaWares.length}
                </Text>

                <Stack
                    gap="md"
                    align="flex-start"
                >
                    {teaWares.map((teaWare) => { return <TeaWareItem key={teaWare.id} teaWare={teaWare} /> })}
                </Stack>
            </Stack>

            <Modal
                opened={isAdditionModalOpen}
                onClose={() => setIsAdditionModalOpen(false)}
                centered
                size="lg"
            >
                <TeaWareAdditionView onFinish={() => setIsAdditionModalOpen(false)} />
            </Modal>
        </>
    )
}

export default TeaWareListView
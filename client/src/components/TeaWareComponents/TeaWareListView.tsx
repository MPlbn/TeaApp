import { Box, Button, Loader, Modal, SimpleGrid, Stack, Text, Title } from "@mantine/core"
import { useGetTeaWareListQuery } from "../../services/teaApi"
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import sectionStyles from "../../Styles/TeaDetailsSection.module.css";
import TeaWareItem from "./TeaWareItem";
import { useState } from "react";
import TeaWareForm from "../FormComponents/Forms/TeaWareForm";
import TeaWareFormPanel from "../FormComponents/FormPanels/TeaWareFormPanel";
import { IconPlus } from "@tabler/icons-react";


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
                <Title mx="auto" order={1} c="teaGreen.9">Lista naczyń</Title>

                <Button
                    onClick={() => setIsAdditionModalOpen(true)}
                    maw={400}
                    size="lg"
                    mx="auto"
                    radius="md"
                    color="teaGreen.7"
                    leftSection={<IconPlus size={16} />}
                >
                    Dodaj naczynie
                </Button>

                <Text mx="auto" c="dimmed" size="sm">
                    Znalezionych naczyń: {teaWares.length}
                </Text>
                <>
                    <SimpleGrid
                        cols={1}
                        spacing="md"
                        maw={400}
                        w="100%"
                        mx="auto"
                    >
                        {teaWares.map((teaWare) => { return <TeaWareItem key={teaWare.id} teaWare={teaWare} /> })}
                    </SimpleGrid>
                </>
            </Stack>

            <Modal
                opened={isAdditionModalOpen}
                onClose={() => setIsAdditionModalOpen(false)}
                centered
                size="lg"
            >
                <TeaWareFormPanel onFinish={() => setIsAdditionModalOpen(false)} />
            </Modal>
        </>
    )
}

export default TeaWareListView
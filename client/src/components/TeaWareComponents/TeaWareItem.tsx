import { ActionIcon, Box, Group, Modal, Paper, Stack, Text, ThemeIcon, UnstyledButton } from "@mantine/core"
import { TeaWare } from "../../types/TeaWare"
import { IconCheck, IconDroplets, IconTeapot, IconX } from "@tabler/icons-react";
import TeaWareFormPanel from "../FormComponents/FormPanels/TeaWareFormPanel";
import { useState } from "react";
import DeleteConfirmationPanel from "../DeleteConfirmationPanel";
import { notifications } from "@mantine/notifications";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { useDeleteTeaWareMutation } from "../../services/teaApi";
import ItemModificationMenu from "../ItemModificationMenu";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setTeaWare, unsetTeaWare } from "../../store/teaWareSlice";
import styles from "../../Styles/TeaWare.module.css"

const DELETE_SUCCESS_MESSAGE = "Poprawnie usunięto naczynie";
const SET_SUCCESS_MESSAGE = "Poprawnie ustawiono naczynie";
const UNSET_SUCCESS_MESSAGE = "Poprawnie ustawiono brak naczynia";

type TeaWareItemProps = {
    teaWare: TeaWare;
}

const TeaWareItem = (props: TeaWareItemProps) => {
    const dispatch = useAppDispatch();
    const [modalMode, setModalMode] = useState<"Delete" | "Edit" | null>(null);
    const [deleteTeaWare, { isLoading: isDeleting }] = useDeleteTeaWareMutation();

    const selectedTeaWare = useAppSelector((state) => state.teaWare);

    const isSelected = selectedTeaWare.teaWare !== null && selectedTeaWare.teaWare.id === props.teaWare.id;



    const setCurrentTeaWareToggle = () => {
        if (isSelected) {
            dispatch(unsetTeaWare());
            notifications.show({
                title: "SUKCES",
                message: UNSET_SUCCESS_MESSAGE,
                color: "teaGreen.8",
                icon: <IconCheck />
            });
        }
        else {
            dispatch(setTeaWare(props.teaWare));
            notifications.show({
                title: "SUKCES",
                message: SET_SUCCESS_MESSAGE,
                color: "teaGreen.8",
                icon: <IconCheck />
            });
        }
    }

    const handleDelete = async () => {
        try {
            await deleteTeaWare(props.teaWare.id).unwrap();
            notifications.show({
                title: "SUKCES",
                message: DELETE_SUCCESS_MESSAGE,
                color: "teaGreen.8",
                icon: <IconCheck />
            });
        } catch (error) {
            notifications.show({
                title: "BŁĄD",
                message: getApiErrorMessage(error),
                color: "red",
                icon: <IconX />
            });
        }
    }

    const renderModalInsides = () => {
        switch (modalMode) {
            case "Edit":
                return <TeaWareFormPanel
                    onFinish={() => setModalMode(null)}
                    initialTeaWare={props.teaWare}
                />
            case "Delete":
                return <DeleteConfirmationPanel
                    deletedObjectName="naczynie"
                    handleDelete={handleDelete}
                    handleCancel={() => setModalMode(null)}
                />
            default:
                return <></>;
        }

    }

    return (
        <>
            <Paper
                withBorder
                radius="lg"
                p="md"
                shadow="xs"
                pos="relative"
            >
                <Group justify="space-between" wrap="nowrap">
                    <Group gap="md" wrap="nowrap">
                        <ActionIcon
                            size={56}
                            radius="lg"
                            variant={isSelected ? "light" : "subtle"}
                            color="teaGreen.7"
                            onClick={setCurrentTeaWareToggle}
                            aria-label={`Wybierz naczynie ${props.teaWare.name}`}
                            className={styles.selectButton}
                        >
                            {isSelected ? <IconCheck size={30} /> : <IconTeapot size={32} />}
                        </ActionIcon>

                        <Stack gap={4}>
                            <Text fw={600} size="lg" c="teaGreen.9">
                                {props.teaWare.name}
                            </Text>

                            <Group gap={5}>
                                <IconDroplets
                                    size={15}
                                    color="var(--mantine-color-dimmed)"
                                />
                                <Text size="sm" c="dimmed">
                                    {props.teaWare.capacity} ml
                                </Text>
                            </Group>
                        </Stack>
                    </Group>
                </Group>

                <Box pos="absolute" top={10} right={10}>
                    <ItemModificationMenu setModalMode={setModalMode} />
                </Box>
            </Paper >
            <Modal
                opened={modalMode !== null}
                onClose={() => setModalMode(null)}
                closeOnClickOutside={false}
                closeOnEscape={false}
            >
                {renderModalInsides()}
            </Modal>
        </>
    )
}

export default TeaWareItem
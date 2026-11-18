import { Button, Group, Paper, Stack, Text, Modal, SimpleGrid, Divider } from "@mantine/core";
import { BrewingMethod } from "../../../types/BrewingMethod";
import { useState } from "react";
import { useDeleteBrewingMethodMutation } from "../../../services/teaApi";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { MethodType } from "../../../types/enums";
import { IconArrowRight, IconCheck, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { getSecondsStringVersion } from "../../../utils/brewingMethodUtils";
import DeleteConfirmationPanel from "../../DeleteConfirmationPanel";
import BrewingMethodFormPanel from "../../FormComponents/FormPanels/BrewingMethodFormPanel";

const DELETE_SUCCESS_MESSAGE = "Poprawnie usunięto sposób parzenia";

type TeaDetailsBrewingMethodProps = {
    brewingMethod: BrewingMethod;
    canModify: boolean;
};

const TeaDetailsBrewingMethod = (props: TeaDetailsBrewingMethodProps) => {
    const [modalMode, setModalMode] = useState<"Delete" | "Edit" | null>(null);
    const [deleteBrewingMethod, { isLoading: isDeleting }] = useDeleteBrewingMethodMutation();
    const isGongfu = props.brewingMethod.method === MethodType.Gongfu;

    const handleDelete = async () => {
        try {
            await deleteBrewingMethod(props.brewingMethod.id).unwrap();
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
    };

    const renderButtons = () => {
        if (!props.canModify) return <></>

        return (
            <Group justify="flex-end" gap="xs">
                <Button
                    size="xs"
                    variant="subtle"
                    onClick={() => setModalMode("Edit")}
                >
                    Edytuj
                </Button>

                <Button
                    size="xs"
                    variant="subtle"
                    color="red"
                    onClick={() => setModalMode("Delete")}
                    loading={isDeleting}
                >
                    Usuń
                </Button>
            </Group>
        )
    }

    const renderModalInsides = () => {
        if (modalMode === "Delete") {
            return (
                <DeleteConfirmationPanel
                    deletedObjectName="sposób parzenia"
                    handleDelete={handleDelete}
                    handleCancel={() => setModalMode(null)}
                />
            )
        }

        if (modalMode === "Edit") {
            return <BrewingMethodFormPanel
                initialBrewingMethod={props.brewingMethod}
                onFinish={() => setModalMode(null)}
            />
        }

        return <></>
    }

    return (
        <>
            <Paper withBorder radius="md" p="lg" shadow="xs">
                <Stack gap="lg">
                    <SimpleGrid cols={{ base: 1, sm: 2 }}>
                        <Stack gap={4}>
                            <Text size="sm" c="dimmed">Temperatura parzenia</Text>
                            <Text fw={600} size="lg" c="teaGreen.9">
                                {props.brewingMethod.temperature} °C
                            </Text>
                        </Stack>

                        <Stack gap={4}>
                            <Text size="sm" c="dimmed">Ilość herbaty</Text>
                            <Text fw={600} size="lg" c="teaGreen.9">
                                {props.brewingMethod.amountPerHundred} g / 100 ml
                            </Text>
                        </Stack>
                    </SimpleGrid>

                    <Divider color="gray.2" />

                    <Stack gap="sm">
                        <Text size="sm" c="dimmed">Czasy parzenia</Text>

                        <Group gap="xs" wrap="wrap">
                            {props.brewingMethod.brewingTimes.map((brewingTimeSeconds, index) => {
                                return (
                                    <Group key={index} gap="xs">
                                        <Text fw={500} c="teaGreen.9">
                                            {getSecondsStringVersion(brewingTimeSeconds)}
                                        </Text>

                                        {index < props.brewingMethod.brewingTimes.length - 1 && (
                                            <IconArrowRight size={16} color="var(--mantine-color-dimmed)" />
                                        )}
                                    </Group>
                                )
                            })}

                            {isGongfu && (
                                <>
                                    <IconArrowRight size={16} color="var(--mantine-color-dimmed)" />
                                    <Text c="dimmed">... +</Text>
                                    <Text fw={500} c="teaGreen.9">
                                        {props.brewingMethod.gongfuBrewingTimeIncrement}s
                                    </Text>
                                </>
                            )}
                        </Group>
                    </Stack>

                    {renderButtons()}
                </Stack>
            </Paper>

            <Modal
                opened={modalMode !== null}
                onClose={() => setModalMode(null)}
                closeOnClickOutside={false}
                closeOnEscape={false}
            >
                {renderModalInsides()}
            </Modal>
        </>
    );
};
export default TeaDetailsBrewingMethod;
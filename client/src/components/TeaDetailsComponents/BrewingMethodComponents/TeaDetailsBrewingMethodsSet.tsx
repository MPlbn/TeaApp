import { Button, Group, Loader, Modal, Paper, ScrollArea, Stack, Tabs, Text, Title } from "@mantine/core";
import { useState } from "react";
import TeaDetailsBrewingMethod from "./TeaDetailsBrewingMethod";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { useGetBrewingMethodsByTeaIDQuery } from "../../../services/teaApi";
import { MethodType } from "../../../types/enums";
import sectionStyles from "../../../Styles/TeaDetailsSection.module.css"
import styles from "../../../Styles/BrewingMethod.module.css"
import BrewingMethodFormPanel from "../../FormComponents/FormPanels/BrewingMethodFormPanel";

type TeaDetailsBrewingMethodsSetProps = {
    teaID: number,
    canModifyBrewingMethods: boolean
};

const TeaDetailsBrewingMethodsSet = (props: TeaDetailsBrewingMethodsSetProps) => {
    const [isBrewingMethodAdditionOpen, setIsBrewingMethodAdditionOpen] = useState(false);

    const {
        data: fetchedBrewingMethods,
        error: fetchingError,
        isLoading
    } = useGetBrewingMethodsByTeaIDQuery(props.teaID);

    if (isLoading) {
        return <Loader />
    }

    if (fetchingError) {
        return <Text c="red">Błąd: {getApiErrorMessage(fetchingError)}</Text>
    }

    const brewingMethods = (fetchedBrewingMethods ?? []);

    const renderAddButton = () => {
        if (!props.canModifyBrewingMethods) return <></>

        return (
            <>
                <Button color="teaGreen.7" size="xs" variant="subtle" onClick={() => setIsBrewingMethodAdditionOpen(true)}>Dodaj</Button>
            </>
        )
    }

    const renderMethods = (method: MethodType) => {
        const filteredMethods = brewingMethods.filter((filterMethod) => filterMethod.method == method);

        if (filteredMethods.length === 0) {
            return (
                <Text c="dimmed" ta="center" py="xl">Brak zdefiniowanych metod parzenia dla tego sposobu</Text>
            );
        }

        else if (filteredMethods.length === 1) {
            return (

                <Stack gap="md">
                    {filteredMethods.map((brewingMethod) => (
                        <TeaDetailsBrewingMethod
                            key={brewingMethod.id}
                            brewingMethod={brewingMethod}
                            canModify={props.canModifyBrewingMethods}
                        />
                    ))}
                </Stack>
            )
        }

        return (
            <ScrollArea
                h={300}
                type="hover"
                overscrollBehavior="contain"
                offsetScrollbars
                scrollbarSize={4}
            >
                <Stack gap="md">
                    {filteredMethods.map((brewingMethod) => (
                        <TeaDetailsBrewingMethod
                            key={brewingMethod.id}
                            brewingMethod={brewingMethod}
                            canModify={props.canModifyBrewingMethods}
                        />
                    ))}
                </Stack>
            </ScrollArea>
        )
    }

    return (
        <>
            <Stack className={sectionStyles.section}>
                <Group>
                    <Title order={2}>Sposoby parzenia</Title>
                    {renderAddButton()}
                </Group>

                <Paper className={styles.panel} p="lg" shadow="xl">
                    <Tabs defaultValue="gongfu" variant="default" color="teaGreen">
                        <Tabs.List grow>
                            <Tabs.Tab value="gongfu">Gongfu</Tabs.Tab>
                            <Tabs.Tab value="western">Zwykłe</Tabs.Tab>
                            <Tabs.Tab value="alternative">Alternatywne</Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="gongfu" pt="lg">
                            <Stack gap="md">
                                {renderMethods(MethodType.Gongfu)}
                            </Stack>
                        </Tabs.Panel>

                        <Tabs.Panel value="western" pt="lg">
                            <Stack gap="md">
                                {renderMethods(MethodType.Western)}
                            </Stack>
                        </Tabs.Panel>

                        <Tabs.Panel value="alternative" pt="lg">
                            <Stack gap="md">
                                {renderMethods(MethodType.Alternative)}
                            </Stack>
                        </Tabs.Panel>
                    </Tabs>
                </Paper>
            </Stack>

            <Modal
                opened={isBrewingMethodAdditionOpen}
                onClose={() => setIsBrewingMethodAdditionOpen(false)}
                title=""
                centered
                closeOnClickOutside={false}
                closeOnEscape={false}
            >
                <BrewingMethodFormPanel teaId={props.teaID} onFinish={() => setIsBrewingMethodAdditionOpen(false)} />
            </Modal>
        </>
    );
};
export default TeaDetailsBrewingMethodsSet;
import { Button, Loader, Modal, Paper, Stack, Text } from "@mantine/core";
import { getBrewingMethodsByTeaID } from "../../../services/teaService";
import { useCallback, useEffect, useState } from "react";
import { BrewingMethod } from "../../../types/BrewingMethod";
import TeaDetailsBrewingMethod from "./TeaDetailsBrewingMethod";
import BrewingMethodAdditionView from "../../BrewingMethodAdditionComponents/BrewingMethodAdditionView";

const BREWING_FAIL_TO_LOAD_MESSAGE = "Nie udało się pobrać sposobów parzenia.";


type TeaDetailsBrewingMethodsSetProps = {
    teaID: number,
    openInfoModalWithMessage: (message: string) => void;
};

const TeaDetailsBrewingMethodsSet = (props: TeaDetailsBrewingMethodsSetProps) => {
    const [brewingMethods, setBrewingMethods] = useState<BrewingMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isBrewingMethodAdditionOpen, setIsBrewingMethodAdditionOpen] = useState(false);

    const loadBrewingMethods = useCallback(async () => {
        setIsLoading(true);
        setIsError(false);

            try {
                const fetchedBrewingMethods = await getBrewingMethodsByTeaID(props.teaID);
                setBrewingMethods(fetchedBrewingMethods);
            } catch (error) {
                setIsError(true);
                props.openInfoModalWithMessage(error instanceof Error ? error.message : BREWING_FAIL_TO_LOAD_MESSAGE);
            } finally {
                setIsLoading(false);
            }        
    }, [props.teaID, props.openInfoModalWithMessage])

    const handleFinish = async (message: string) => {
        await loadBrewingMethods();
        props.openInfoModalWithMessage(message);
    }

    const handleAddFinish = async (message: string) => {
        setIsBrewingMethodAdditionOpen(false);
        handleFinish(message);
    }

    useEffect(() => {
        void loadBrewingMethods();
    }, [loadBrewingMethods]);

    if(isLoading){
        return <Loader/>
    }

    if(isError){
        return <Text c="red">Błąd</Text>
    }

    return(
        <>
        <Text>Sposoby parzenia</Text>
            <Paper withBorder radius="md">
                <Stack>
                    {brewingMethods.map((brewingMethod) => {
                        return <TeaDetailsBrewingMethod 
                            key={brewingMethod.id} 
                            brewingMethod={brewingMethod}
                            onFinish={handleFinish} 
                        />
                    })}
                    <Button onClick={() => setIsBrewingMethodAdditionOpen(true)}>Dodaj</Button>
                </Stack>
            </Paper>

        <Modal
            opened={isBrewingMethodAdditionOpen}
            onClose={() => setIsBrewingMethodAdditionOpen(false)}
            title=""
            centered
            closeOnClickOutside={false}
            closeOnEscape={false}
        >
            <BrewingMethodAdditionView teaID={props.teaID} onFinish={handleAddFinish}/>
        </Modal>
        </>
    );
};
export default TeaDetailsBrewingMethodsSet;
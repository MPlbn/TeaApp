import { Button, Loader, Modal, Paper, Stack, Text } from "@mantine/core";
import { getBrewingMethodsByTeaID } from "../../services/teaService";
import { useCallback, useEffect, useState } from "react";
import { BrewingMethod } from "../../types/BrewingMethod";
import TeaDetailsBrewingMethod from "./TeaDetailsBrewingMethod";
import BrewingMethodAdditionView from "../BrewingMethodAdditionComponents/BrewingMethodAdditionView";
import BrewingMethodEditorView from "../BrewingMethodEditorComponents/BrewingMethodEditorView";

type TeaDetailsBrewingMethodsSetProps = {
    teaID: number
};

const TeaDetailsBrewingMethodsSet = (props: TeaDetailsBrewingMethodsSetProps) => {
    const [brewingMethods, setBrewingMethods] = useState<BrewingMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchingError, setFetchingError] = useState<string | null>(null);

    const [isBrewingMethodAdditionOpen, setIsBrewingMethodAdditionOpen] = useState(false);

    const loadBrewingMethods = useCallback(async () => {
        setIsLoading(true);
        setFetchingError(null);
            try {
                const fetchedBrewingMethods = await getBrewingMethodsByTeaID(props.teaID);
                setBrewingMethods(fetchedBrewingMethods);
            } catch (error) {
                setFetchingError(error instanceof Error ? error.message : "Nie udało się pobrać sposobów parzenia."); //Możem ożna throw tu bez useStatu
            } finally {
                setIsLoading(false);
            }        
    }, [props.teaID])

    const handleSuccess = async () => {
        setIsBrewingMethodAdditionOpen(false);
        await loadBrewingMethods();
    }

    useEffect(() => {
        void loadBrewingMethods();
    }, [props.teaID]);

    if(isLoading){
        return <Loader/>
    }

    if(fetchingError !== null){
        return <Text c="red">Błąd: {fetchingError}</Text>
    }

    return(
        <>
        <Text>test</Text>
            <Paper withBorder radius="md">
                <Stack>
                    {brewingMethods.map((brewingMethod) => {
                        return <TeaDetailsBrewingMethod 
                            key={brewingMethod.id} 
                            brewingMethod={brewingMethod}
                            onSuccess={handleSuccess} 
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
            <BrewingMethodAdditionView teaID={props.teaID} onSuccess={handleSuccess}/>
        </Modal>
        </>
    );
};
export default TeaDetailsBrewingMethodsSet;
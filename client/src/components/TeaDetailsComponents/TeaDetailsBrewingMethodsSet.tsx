import { Button, Loader, Modal, Paper, Stack, Text } from "@mantine/core";
import { getBrewingMethodsByTeaID } from "../../services/teaService";
import { useEffect, useState } from "react";
import { BrewingMethod } from "../../types/BrewingMethod";
import TeaDetailsBrewingMethod from "./TeaDetailsBrewingMethod";

type TeaDetailsBrewingMethodsSetProps = {
    teaID: number
};

const TeaDetailsBrewingMethodsSet = (props: TeaDetailsBrewingMethodsSetProps) => {
    const [brewingMethods, setBrewingMethods] = useState<BrewingMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchingError, setFetchingError] = useState<string | null>(null);

    const [isBrewingMethodAdditionOpen, setIsBrewingMethodAdditionOpen] = useState(false);

    useEffect(() => {
        const loadBrewingMethods = async () => {
            try {
                const fetchedBrewingMethods = await getBrewingMethodsByTeaID(props.teaID);
                setBrewingMethods(fetchedBrewingMethods);
            } catch (error) {
                setFetchingError(error instanceof Error ? error.message : "Nie udało się pobrać sposobów parzenia.");
            } finally {
                setIsLoading(false);
            }
        }
        void loadBrewingMethods();
    }, [props.teaID]);

    if(isLoading){
        return <Loader/>
    }

    if(fetchingError !== null){
        return <Text c="red">Błąd: {fetchingError}</Text>
    }

    return(<Text>test</Text>
        // <Paper withBorder radius="md">
        //     <Stack>
        //         {brewingMethods.map((brewingMethod) => {
        //             return <TeaDetailsBrewingMethod 
        //                 key={brewingMethod.id} 
        //                 brewingMethod={brewingMethod} 
        //                 handleEdit={() => {}} 
        //                 handleDelete={() => {}}
        //             />
        //         })}
        //         <Button onClick={() => setIsBrewingMethodAdditionOpen(true)}>Dodaj</Button>
        //     </Stack>
        // </Paper>

        // <Modal
        
        // >
        //     <BrewingMethodAdditionView/>
        // </Modal>
    );
};
export default TeaDetailsBrewingMethodsSet;
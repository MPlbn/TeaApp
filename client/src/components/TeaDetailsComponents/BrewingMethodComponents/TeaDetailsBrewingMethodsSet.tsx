import { Button, Loader, Modal, Paper, Stack, Text } from "@mantine/core";
import { useState } from "react";
import TeaDetailsBrewingMethod from "./TeaDetailsBrewingMethod";
import BrewingMethodAdditionView from "../../BrewingMethodAdditionComponents/BrewingMethodAdditionView";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { useGetBrewingMethodsByTeaIDQuery } from "../../../services/teaApi";

type TeaDetailsBrewingMethodsSetProps = {
    teaID: number
};

const TeaDetailsBrewingMethodsSet = (props: TeaDetailsBrewingMethodsSetProps) => {
    const [isBrewingMethodAdditionOpen, setIsBrewingMethodAdditionOpen] = useState(false);

    const {
        data: fetchedBrewingMethods,
        error: fetchingError,
        isLoading
    } = useGetBrewingMethodsByTeaIDQuery(props.teaID);

    if(isLoading){
        return <Loader/>
    }

    if(fetchingError){
        return <Text c="red">Błąd: {getApiErrorMessage(fetchingError)}</Text>
    }

    const brewingMethods = (fetchedBrewingMethods ?? []);

    return(
        <>
        <Text>Sposoby parzenia</Text>
            <Paper withBorder radius="md">
                <Stack>
                    {brewingMethods.map((brewingMethod) => {
                        return <TeaDetailsBrewingMethod 
                            key={brewingMethod.id} 
                            brewingMethod={brewingMethod} 
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
            <BrewingMethodAdditionView teaID={props.teaID} onFinish={() => setIsBrewingMethodAdditionOpen(false)}/>
        </Modal>
        </>
    );
};
export default TeaDetailsBrewingMethodsSet;
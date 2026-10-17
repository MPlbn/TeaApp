import { useParams } from "react-router";
import { Stack, Text, Modal } from "@mantine/core";
import TeaDetailsBrewingMethodsSet from "./BrewingMethodComponents/TeaDetailsBrewingMethodsSet";
import TeaDetailsReviewsSet from "./ReviewComponents/TeaDetailsReviewsSet";
import TeaDetailsInfoSection from "./TeaComponents/TeaDetailsInfoSection";

const TeaDetailsView = () => {
    const {id} = useParams<{id: string}>(); // TODO other way
    const teaID = Number(id);

    if(!id ||
        !Number.isInteger(teaID) ||
        teaID <= 0
    ) {
        return <Text c="red">Nieprawidłowe ID herbaty.</Text>;
    }

    return (
        <>
        <Stack>
            <TeaDetailsInfoSection teaID={teaID}/>
            <TeaDetailsBrewingMethodsSet teaID={teaID}/>
        </Stack>
        </>
    );
}
export default TeaDetailsView;
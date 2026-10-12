import { useParams } from "react-router";
import { Stack, Text } from "@mantine/core";
import TeaDetailsBrewingMethodsSet from "./TeaDetailsBrewingMethodsSet";
import TeaDetailsReviewsSet from "./TeaDetailsReviewsSet";
import TeaDetailsInfoSection from "./TeaDetailsInfoSection";

const TeaDetailsView = () => {
    const {id} = useParams<{id: string}>();
    const teaID = Number(id);

    if(!id ||
        !Number.isInteger(teaID) ||
        teaID <= 0
    ) {
        return <Text c="red">Nieprawidłowe ID herbaty.</Text>;
    }

    return (
        <Stack>
            <TeaDetailsInfoSection teaID={teaID}/>
            <TeaDetailsBrewingMethodsSet teaID={teaID}/>
            <TeaDetailsReviewsSet teaID={teaID}/>
        </Stack>
    );
}
export default TeaDetailsView;
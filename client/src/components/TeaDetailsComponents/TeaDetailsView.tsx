import { useParams } from "react-router";
import { Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { getTeaByID } from "../../services/teaService";
import { Tea } from "../../types/Tea";
import TeaDetailsTitle from "./TeaDetailsTitle";
import TeaDetailsDetailField from "./TeaDetailsDetailField";

const TeaDetailsView = () => {
    const {id} = useParams<{id: string}>();
    const [tea, setTea] = useState<Tea | null>(null);

    useEffect(() => {
            if(!id) {
                setTea(null);
                return;
            }

            const teaID = Number(id);

            if(!Number.isInteger(teaID)){
                setTea(null);
                return;
            }

            const tea = getTeaByID(teaID);

            setTea(tea ?? null);
        }, [id]);

    if (tea === null) {
        return (
            <Text>Nie znaleziono herbaty.</Text>
        );
    }

    return (
        <Stack>
            <TeaDetailsTitle
                name={tea.name}
                onBack={() => {window.history.back()}}
            />
            <TeaDetailsDetailField 
                teaType={tea.teaType}
                origin={tea.origin}
                description={tea.description}
                price={tea.price}
            />
        </Stack>
    );
}
export default TeaDetailsView;
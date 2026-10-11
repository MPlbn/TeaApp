import { useParams } from "react-router";
import { Stack, Text } from "@mantine/core";
import TeaDetailsTitle from "../components/tea-detail-comp/TeaDetailsTitle";
import { useEffect, useState } from "react";
import { getTeaByID } from "../services/teaService";
import { Tea } from "../types/Tea";
import TeaDetailsDetailField from "../components/tea-detail-comp/TeaDetailsDetailField";

export default function TeaDetailsView() {
    const {id} = useParams<{id: string}>();
    const [tea, setTea] = useState<Tea | null>(null);

    useEffect(
        function () {
            if(!id) {
                setTea(null);
                return;
            }

            const teaID = Number(id);

            if(!Number.isInteger(teaID)){
                setTea(null);
                return;
            }

            const xTea = getTeaByID(teaID);

            setTea(xTea ?? null);
        }, 
        [id]
    );

    if (tea === null) {
        return (
            <Text>Nie znaleziono herbaty.</Text>
        );
    }

    return (
        <Stack>
            <TeaDetailsTitle
                name={tea.name}
                onBack={
                    function (){
                        window.history.back();
                    }
                }
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

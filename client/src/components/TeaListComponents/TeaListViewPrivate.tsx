import { useState } from 'react'
import { TeaType } from '../../types/enums';
import { useGetAllTeasPrivateForListQuery } from '../../services/teaApi';
import { Loader, Stack, Text, Title } from '@mantine/core';
import { getApiErrorMessage } from '../../utils/getApiErrorMessage';
import TeaListFilter from './TeaListFilter';
import TeaListItem from './TeaListItem';

const TeaListViewPrivate = () => {
    const [selectedTeaType, setSelectedTeaType] = useState<TeaType | null>(null);

    const {
        data: teas,
        error: fetchingError,
        isLoading
    } = useGetAllTeasPrivateForListQuery();


    if (isLoading) {
        return <Loader />;
    }

    if (fetchingError) {
        return <Text c="red">Błąd: {getApiErrorMessage(fetchingError)}</Text>
    }


    const filteredTeas = (teas ?? []).filter((tea) => selectedTeaType === null ? true : tea.type === selectedTeaType);

    return (
        <Stack gap="md">
            <Title order={2}>Prywatna kolekcja herbat</Title>
            <TeaListFilter
                selectedTeaType={selectedTeaType}
                onTeaTypeChange={setSelectedTeaType}
            />

            <Text c="dimmed" size="sm">
                Znalezionych herbat: {filteredTeas.length}
            </Text>

            <Stack gap="xs">
                {filteredTeas.map((tea) => { return <TeaListItem key={tea.id} shortTea={tea} isPublic={false} /> })}
            </Stack>
        </Stack>
    );
}

export default TeaListViewPrivate
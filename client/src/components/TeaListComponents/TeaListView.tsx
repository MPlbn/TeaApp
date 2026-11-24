import {
    Stack,
    Title,
    Text,
    SimpleGrid,
    Pagination
} from "@mantine/core";
import { TeaType } from "../../types/enums";
import { Loader } from "@mantine/core";
import TeaListItem from "./TeaListItem";
import TeaListFilter from "./TeaListFilter";
import { useGetAllTeasForListQuery, useGetAllTeasPrivateForListQuery } from "../../services/teaApi";
import { useState } from "react";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import sectionStyles from "../../Styles/TeaDetailsSection.module.css"
import { TeaListQueryParams } from "../../types/Tea";

const PAGE_SIZE = 50;

type TeaListViewProps = {
    isPublic: boolean;
}

const TeaListView = (props: TeaListViewProps) => {
    const [selectedTeaType, setSelectedTeaType] = useState<TeaType | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const queryParams = {
        page: currentPage,
        pageSize: PAGE_SIZE,
        type: selectedTeaType
    } as TeaListQueryParams;

    const publicQuery = useGetAllTeasForListQuery(queryParams, { skip: !props.isPublic });
    const privateQuery = useGetAllTeasPrivateForListQuery(queryParams, { skip: props.isPublic });

    const {
        data: teasPage,
        error: fetchingError,
        isLoading
    } = props.isPublic ? publicQuery : privateQuery;

    const handleTeaTypeChange = (type: TeaType | null) => {
        setSelectedTeaType(type);
        setCurrentPage(1);
    }

    if (isLoading) {
        return <Loader />;
    }

    if (fetchingError) {
        return <Text c="red">Błąd: {getApiErrorMessage(fetchingError)}</Text>
    }

    const teas = teasPage?.items ?? [];

    return (
        <Stack className={sectionStyles.section}>
            <Title order={1} c="teaGreen.9">{props.isPublic ? "Publiczna" : "Prywatna"} kolekcja herbat</Title>

            <TeaListFilter
                selectedTeaType={selectedTeaType}
                onTeaTypeChange={handleTeaTypeChange}
            />

            <Text c="dimmed" size="sm">
                Znalezionych herbat: {teasPage?.totalCount ?? 0}
            </Text>

            <SimpleGrid
                cols={2}
                spacing="sm"
                verticalSpacing="md"
            >
                {teas.map((tea) => (
                    <TeaListItem
                        key={tea.id}
                        shortTea={tea}
                        isPublic={props.isPublic}
                    />
                ))}
            </SimpleGrid>

            {teasPage && teasPage.totalPages > 1 && (
                <Pagination
                    value={currentPage}
                    onChange={setCurrentPage}
                    total={teasPage.totalPages}
                    color="teaGreen.7"
                    mt="md"
                    mx="auto"
                />
            )}

        </Stack>
    );
}
export default TeaListView;
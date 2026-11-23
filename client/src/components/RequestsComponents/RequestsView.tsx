import { Loader, SimpleGrid, Stack, Tabs, Text, Title } from "@mantine/core";
import { useGetPendingRequestsQuery, useGetUserRequestsQuery } from "../../services/teaApi";
import { useAppSelector } from "../../store/hooks"
import { useState } from "react";
import { UserRole } from "../../types/enums";
import PublishRequest from "./RequestItems/PublishRequest";

enum RequestType {
    PublishRequest = "publishRequest"
}

type RequestsViewProps = {
    isViewPending: boolean
}

const RequestsView = (props: RequestsViewProps) => {
    //FOR ADDING NEW REQUEST TYPE
    //Add to enum
    //Add new query -> add it to switch
    //Add what is needed to <Tab>
    //Add case to renderRequests

    const user = useAppSelector((state) => state.auth.user);

    const [activeTab, setActiveTab] = useState<RequestType>(RequestType.PublishRequest);

    const pendingRequestQuery = useGetPendingRequestsQuery(undefined, { skip: activeTab !== RequestType.PublishRequest || !props.isViewPending }); //TODO FUTURE remember to make it more universal

    const userRequestQuery = useGetUserRequestsQuery(undefined, { skip: activeTab !== RequestType.PublishRequest || props.isViewPending })

    const renderRequests = (type: RequestType) => {
        switch (type) {
            case RequestType.PublishRequest:
                const data = props.isViewPending ? pendingRequestQuery.data : userRequestQuery.data;
                const isLoading = pendingRequestQuery.isLoading;
                const isError = pendingRequestQuery.isError;

                if (isLoading) return <Loader />

                if (isError) return <Text c="red">Fetching error</Text>

                if (!data) return <></>;

                return (
                    <>
                        {data.map((request) => {
                            return <PublishRequest key={request.id} publishRequestData={request} isViewPending={props.isViewPending} />
                        })}
                    </>
                );

            default:
                return <></>;
        }
    }

    return (
        <Stack>
            <Title order={3}>{props.isViewPending ? "Rozwiązywanie próśb" : "Moje prośby"}</Title>

            <Tabs defaultValue={RequestType.PublishRequest} variant="default" color="teaGreen">
                <Tabs.List grow>
                    <Tabs.Tab value={RequestType.PublishRequest}>Upublicznienie herbat</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value={RequestType.PublishRequest} pt="lg">
                    <SimpleGrid
                        cols={1}
                        spacing="sm"
                        verticalSpacing="md"
                    >
                        {renderRequests(RequestType.PublishRequest)}
                    </SimpleGrid>
                </Tabs.Panel>
            </Tabs>

        </Stack>
    )
}

export default RequestsView
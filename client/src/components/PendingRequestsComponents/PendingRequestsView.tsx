import { Loader, SimpleGrid, Stack, Tabs, Text, Title } from "@mantine/core";
import { useGetPendingPublishRequestsQuery } from "../../services/teaApi";
import { useAppSelector } from "../../store/hooks"
import { useState } from "react";

enum RequestType {
    PublishRequest = "publishRequest"
}

const PendingRequestsView = () => {
    //FOR ADDING NEW REQUEST TYPE
    //Add to enum
    //Add new query -> add it to switch
    //Add what is needed to <Tab>
    //Add case to renderRequests

    // Choose type of pending fetch - Publish requests for now but make it a Tab
    // GET Pending RequestsList with all data - PublishRequests for now
    // map -> single PublishRequest = RequestPanel -> PublishRequest
    // RequestPanel would be wrapper for requestData, similar to forms
    // 

    const user = useAppSelector((state) => state.auth.user);

    const [activeTab, setActiveTab] = useState<RequestType>(RequestType.PublishRequest);

    const publishRequestQuery = useGetPendingPublishRequestsQuery(undefined, { skip: activeTab !== RequestType.PublishRequest });

    const renderRequests = (type: RequestType) => {
        switch (type) {
            case RequestType.PublishRequest:
                const data = publishRequestQuery.data;
                const isLoading = publishRequestQuery.isLoading;
                const isError = publishRequestQuery.isError;

                if (isLoading) return <Loader />

                if (isError) return <Text c="red">Fetching error</Text>

                if (data === undefined) return null;

                return (
                    data.map((request) => {
                        <Text key={request.id}>{request.teaId}</Text>
                    })
                );

            default:
                return null;
        }
    }

    return (
        <Stack>
            <Title order={3}>Rozwiązywanie requestów</Title>

            <Tabs defaultValue={RequestType.PublishRequest} variant="default" color="teaGreen">
                <Tabs.List grow>
                    <Tabs.Tab value={RequestType.PublishRequest}>Upublicznienie herbat</Tabs.Tab>

                </Tabs.List>
            </Tabs>

            <Tabs.Panel value={RequestType.PublishRequest} pt="lg">
                <SimpleGrid
                    cols={2}
                    spacing="sm"
                    verticalSpacing="md"
                >
                    {/* {renderRequests(RequestType.PublishRequest)} */}
                </SimpleGrid>


            </Tabs.Panel>
        </Stack>
    )
}

export default PendingRequestsView
import { useParams } from "react-router";
import { Loader, Stack, Text } from "@mantine/core";
import TeaDetailsBrewingMethodsSet from "./BrewingMethodComponents/TeaDetailsBrewingMethodsSet";
import TeaDetailsReviewsSet from "./ReviewComponents/TeaDetailsReviewsSet";
import TeaDetailsInfoSection from "./TeaComponents/TeaDetailsInfoSection";
import { useAppSelector } from "../../store/hooks";
import { useGetTeaByIDPrivateQuery, useGetTeaByIDQuery } from "../../services/teaApi";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { isUserAuthorizedToAddReview, isUserAuthorizedToEditTea, isUserAuthorizedToModifyBrewingMethods } from "../../utils/utils";
import styles from "../../Styles/UserNotLoggedInView.module.css"

const TEA_NOT_FOUND_MESSAGE = "Nie znaleziono herbaty.";


type TeaDetailsViewProps = {
    isPublicView: boolean;
}

const TeaDetailsView = (props: TeaDetailsViewProps) => {
    const { id } = useParams<{ id: string }>(); // TODO other way
    const teaID = Number(id);

    const user = useAppSelector((state) => state.auth.user);

    const shouldSkipQuery = !id || !Number.isInteger(teaID) || teaID <= 0;

    const publicTeaQuery = useGetTeaByIDQuery(teaID, { skip: shouldSkipQuery || !props.isPublicView });

    const privateTeaQuery = useGetTeaByIDPrivateQuery(teaID, { skip: shouldSkipQuery || props.isPublicView });

    const {
        data: tea,
        error: fetchingError,
        isLoading
    } = props.isPublicView ? publicTeaQuery : privateTeaQuery;

    if (shouldSkipQuery) {
        return <Text c="red">Nieprawidłowe ID herbaty.</Text>;
    }

    if (isLoading) {
        return <Loader />
    }

    if (fetchingError) {
        return <Text c="red">Błąd: {getApiErrorMessage(fetchingError)}</Text>
    }

    if (!tea) {
        return <Text c="red">{TEA_NOT_FOUND_MESSAGE}</Text>;
    }

    const isUserAuthorized = isUserAuthorizedToEditTea(tea, user);

    const canUserManageBrewingMethods = isUserAuthorizedToModifyBrewingMethods(tea, user);

    const canUserAddReview = isUserAuthorizedToAddReview(tea, user);

    return (
        <>
            <Stack gap="lg" maw={700} className={styles.page}>
                <TeaDetailsInfoSection tea={tea} canModifyTea={isUserAuthorized} isPublicView={props.isPublicView} />
                <TeaDetailsBrewingMethodsSet teaID={teaID} canModifyBrewingMethods={canUserManageBrewingMethods} />
                <TeaDetailsReviewsSet teaID={teaID} canAddReview={canUserAddReview} />
            </Stack>
        </>
    );
}
export default TeaDetailsView;
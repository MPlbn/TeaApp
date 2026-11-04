import { useEffect } from "react";
import { useGetCurrentUserQuery } from "../../services/teaApi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import UserLoggedInView from "./UserLoggedInView";
import UserNotLoggedInView from "./UserNotLoggedInView";
import { setUser } from "../../store/authSlice";
import { Loader, Text } from "@mantine/core";

const UserView = () => {
    const accessToken = useAppSelector((state) => state.auth.accessToken);

    const {
        data: user,
        isLoading,
        isError
    } = useGetCurrentUserQuery(undefined, {
        skip: !accessToken,
        refetchOnMountOrArgChange: true
    });

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (user)
            dispatch(setUser(user));
    }), [user, dispatch];

    if (isLoading)
        return <Loader />

    if (isError)
        return <Text>Nie udało się pobrać danych użytkownika</Text>

    if (accessToken) {
        return (
            <UserLoggedInView />
        )
    }
    else {
        return (
            <UserNotLoggedInView />
        )
    }
}
export default UserView;
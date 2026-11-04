import { Button, Modal, Stack, Text } from "@mantine/core"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { useState } from "react";
import { teaApi, useLogoutUserMutation } from "../../services/teaApi";
import { RefreshTokenRequest } from "../../types/User";
import { clearCredentials } from "../../store/authSlice";
import UserChangePasswordPanel from "./UserChangePasswordPanel";
import UserChangeDataPanel from "./UserChangeDataPanel";
import { openInfoModal } from "../../store/uiSlice";

const LOOGUT_SUCCESS_MESSAGE = "Poprawnie wylogowano!";

const UserLoggedInView = () => {
    const user = useAppSelector((state) => state.auth.user);
    const refreshToken = useAppSelector((state) => state.auth.refreshToken);

    const dispatch = useAppDispatch();

    const [logoutUser, { isLoading: isLoggingOut }] = useLogoutUserMutation();

    const [activeForm, setActiveForm] = useState<"changePassword" | "changeData" | null>(null);
    const closeModal = () => { setActiveForm(null) };


    const renderActiveForm = () => {
        switch (activeForm) {
            case "changePassword":
                return <UserChangePasswordPanel onFinish={closeModal} />
            case "changeData":
                return <UserChangeDataPanel onFinish={closeModal} />
            default:
                return null;
        }
    }

    const handleLogout = async () => {
        try {
            if (refreshToken) {
                const request = { refreshToken: refreshToken } as RefreshTokenRequest;
                await logoutUser(request).unwrap();
            }
            dispatch(openInfoModal({ message: LOOGUT_SUCCESS_MESSAGE }));
        } finally {
            dispatch(clearCredentials());
            dispatch(teaApi.util.resetApiState());
        }
    }

    return (
        <Stack>
            <Stack>
                <Text>Jesteś zalogowany!</Text>
                <Text>ID: {user?.id}</Text>
                <Text>Username: {user?.userName}</Text>
                <Text>Email: {user?.email}</Text>
                {user?.roles.map((role) => { return <Text>Rola: {role}</Text> })}
                <Text></Text>
                <Button onClick={() => setActiveForm("changePassword")}>Zmień hasło</Button>
                <Button onClick={() => setActiveForm("changeData")}>Zmień dane</Button>
                <Button
                    onClick={handleLogout}
                    loading={isLoggingOut}
                >
                    Wyloguj się
                </Button>
            </Stack>

            <Modal
                opened={activeForm !== null}
                onClose={closeModal}
                centered
                size="lg"
            >
                {renderActiveForm()}
            </Modal>
        </Stack>
    )
}

export default UserLoggedInView
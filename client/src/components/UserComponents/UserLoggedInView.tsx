import { Badge, Button, Divider, Group, Modal, Paper, Stack, Text, Title, UnstyledButton } from "@mantine/core"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { useState } from "react";
import { teaApi, useLogoutUserMutation } from "../../services/teaApi";
import { clearCredentials } from "../../store/authSlice";
import UserChangePasswordPanel from "../FormComponents/FormPanels/UserChangePasswordPanel";
import UserChangeDataPanel from "../FormComponents/FormPanels/UserChangeDataPanel";
import styles from '../../Styles/UserLoggedInView.module.css'
import { IconCheck, IconChevronRight, IconLogout } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

const LOGOUT_SUCCESS_MESSAGE = "Poprawnie wylogowano!";

const UserLoggedInView = () => {
    const user = useAppSelector((state) => state.auth.user);

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
            const storedRefreshToken = await window.authStorage.get();

            if (storedRefreshToken) {
                await logoutUser({
                    refreshToken: storedRefreshToken
                }).unwrap();
            }
        }
        catch (uError) {
            console.error('Logout request failed:', uError);
        }
        finally {
            try {
                await window.authStorage.clear();
            }
            catch (uError) {
                console.error('Failed to clear stored refresh token:', uError);
            }

            dispatch(clearCredentials());
            dispatch(teaApi.util.resetApiState());

            notifications.show({
                title: "SUKCES",
                message: LOGOUT_SUCCESS_MESSAGE,
                color: "teaGreen.8",
                icon: <IconCheck />
            });
        }
    }

    return (
        <Stack className={styles.page} gap="lg">
            <Stack gap="xs">
                <Title order={1}>Twoje konto</Title>
                <Text c="dimmed">
                    Witaj ponownie! Oto informacje o Twoim koncie.
                </Text>
            </Stack>

            <Paper className={styles.userInfo} withBorder p="xl" radius="lg">
                <Stack gap="md">
                    <Title order={3}>Dane użytkownika</Title>

                    <Divider color="gray.2" />

                    <Stack gap={3}>
                        <Stack gap={2}>
                            <Text className={styles.fieldLabel}>LOGIN</Text>
                            <Text>{user?.userName}</Text>
                        </Stack>

                        <Stack gap={2}>
                            <Text className={styles.fieldLabel}>ADRES E-MAIL</Text>
                            <Text>{user?.email}</Text>
                        </Stack>

                        <Stack gap={2}>
                            <Text className={styles.fieldLabel}>ROLE</Text>
                            <Group gap="xs">
                                {user?.roles.map((role) => (
                                    <Badge key={role} color="teaGreen">
                                        {role}
                                    </Badge>
                                ))}
                            </Group>
                        </Stack>
                    </Stack>
                </Stack>
            </Paper>

            <Stack gap="sm">
                <Title order={3}>Zarządzanie kontem</Title>

                <Paper withBorder radius="lg" p="xs" className={styles.accountActions}>
                    <UnstyledButton
                        className={styles.accountAction}
                        onClick={() => setActiveForm("changeData")}
                    >
                        <Stack gap={2}>
                            <Text fw={500}>Zmiana danych</Text>
                            <Text size="xs" c="dimmed">
                                Zaktualizuj login i adres e-mail
                            </Text>
                        </Stack>

                        <IconChevronRight size={20} />
                    </UnstyledButton>

                    <Divider color="gray.2" />

                    <UnstyledButton
                        className={styles.accountAction}
                        onClick={() => setActiveForm("changePassword")}
                    >
                        <Stack gap={2}>
                            <Text fw={500}>Zmiana hasła</Text>
                            <Text size="xs" c="dimmed">
                                Zmień hasło do swojego konta
                            </Text>
                        </Stack>

                        <IconChevronRight size={20} />
                    </UnstyledButton>
                </Paper>

                <Group justify="flex-end">
                    <Button
                        variant="subtle"
                        color="red"
                        leftSection={<IconLogout size={16} />}
                        onClick={handleLogout}
                        loading={isLoggingOut}
                    >
                        Wyloguj się
                    </Button>
                </Group>
            </Stack>

            <Modal
                opened={activeForm !== null}
                onClose={closeModal}
                centered
                size="lg"
                radius="lg"
                overlayProps={{
                    backgroundOpacity: 0.45,
                    blur: 2,
                }}
                classNames={{
                    content: styles.modalContent,
                    header: styles.modalHeader,
                    title: styles.modalTitle,
                    body: styles.modalBody,
                }}
            >
                {renderActiveForm()}
            </Modal>
        </Stack>
    )
}

export default UserLoggedInView
import { Anchor, Stack, Text } from "@mantine/core";
import { useState } from "react";
import UserLoginPanel from "../FormComponents/FormPanels/UserLoginPanel";
import UserRegisterPanel from "../FormComponents/FormPanels/UserRegisterPanel";
import styles from '../../Styles/UserNotLoggedInView.module.css'

const UserNotLoggedInView = () => {
    const [isRegistering, setIsRegistering] = useState(false);

    const handleFinish = () => setIsRegistering(false);

    return (
        <Stack className={styles.page} gap="md">

            <div
                key={isRegistering ? "register" : "login"}
                className={styles.formTransition}
            >
                {isRegistering ? (
                    <UserRegisterPanel onFinish={handleFinish} />
                ) : (
                    <UserLoginPanel onFinish={handleFinish} />
                )}
            </div>

            <Text size="sm" c="dimmed" ta="center">
                {isRegistering
                    ? "Masz już konto?"
                    : "Nie masz jeszcze konta?"}{" "}
                <Anchor
                    component="button"
                    type="button"
                    size="sm"
                    onClick={() => setIsRegistering(!isRegistering)}
                    c="teaGreen.7"
                >
                    {isRegistering ? "Zaloguj się" : "Zarejestruj się"}
                </Anchor>
            </Text>
        </Stack>
    );
}

export default UserNotLoggedInView;
import { Button, Modal, Stack, Text } from "@mantine/core";
import { useState } from "react";
import UserLoginPanel from "./UserLoginPanel";
import UserRegisterPanel from "./UserRegisterPanel";

const UserNotLoggedInView = () => {
    const [activeForm, setActiveForm] = useState<"login" | "register" | null>(null);

    const closeModal = () => { setActiveForm(null) };

    const renderActiveForm = () => {
        switch (activeForm) {
            case "login":
                return <UserLoginPanel onFinish={closeModal} />;
            case "register":
                return <UserRegisterPanel onFinish={closeModal} />;
            default:
                return null;
        }
    }

    return (
        <Stack>
            <Text>Nie jesteś zalogowany</Text>
            <Stack>
                <Button
                    onClick={() => setActiveForm("login")}
                >
                    Zaloguj się
                </Button>
                <Button
                    onClick={() => setActiveForm("register")}
                >
                    Zarejestruj się
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

export default UserNotLoggedInView;
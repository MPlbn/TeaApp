import { Button, Stack, Text } from "@mantine/core"

const UserLoggedInView = () => {
    return (
        <Stack>
            <Text>Jesteś zalogowany!</Text>
            <Button>Zmień hasło</Button>
            <Button>Zmień dane</Button>
            <Button>Wyloguj się</Button>
        </Stack>
    )
}

export default UserLoggedInView
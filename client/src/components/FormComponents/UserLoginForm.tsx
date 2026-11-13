import { UserLoginFormData } from "../../types/FormDatas";
import { PasswordInput, Stack, TextInput } from "@mantine/core";

type UserLoginFormProps = {
    formData: UserLoginFormData;
    updateField: <TKey extends keyof UserLoginFormData>(
        key: TKey,
        value: UserLoginFormData[TKey]
    ) => void;
};

const UserLoginForm = (props: UserLoginFormProps) => {
    return (
        <Stack gap="lg">
            <TextInput
                label="Login"
                placeholder="Wpisz email lub nazwę użytkownika"
                value={props.formData.login}
                onChange={(event) => { props.updateField("login", event.currentTarget.value) }}
                required

            />
            <PasswordInput
                label="Hasło"
                placeholder="Wpisz swoje hasło"
                value={props.formData.password}
                onChange={(event) => { props.updateField("password", event.currentTarget.value) }}
                required
            />
        </Stack>

    );
}
export default UserLoginForm;
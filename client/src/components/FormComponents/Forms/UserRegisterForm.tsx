import { UserRegisterFormData } from "../../../types/FormDatas";
import { PasswordInput, Stack, TextInput } from "@mantine/core";


type UserFormProps = {
    formData: UserRegisterFormData;
    updateField: <TKey extends keyof UserRegisterFormData>(
        key: TKey,
        value: UserRegisterFormData[TKey]
    ) => void;
};

const UserRegisterForm = (props: UserFormProps) => {
    return (
        <Stack>
            <TextInput
                label="Nazwa użytkownika"
                placeholder="Wpisz nazwę użytkownika"
                value={props.formData.userName}
                onChange={(event) => { props.updateField("userName", event.currentTarget.value) }}
                required
            />
            <TextInput
                label="Adres email"
                placeholder="name@email.com"
                value={props.formData.email}
                onChange={(event) => { props.updateField("email", event.currentTarget.value) }}
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
export default UserRegisterForm;
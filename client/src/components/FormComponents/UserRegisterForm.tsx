import { UserRegisterFormData } from "../../types/FormDatas";
import { Stack, TextInput } from "@mantine/core";

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
                placeholder=""
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
            <TextInput
                label="Hasło"
                placeholder=""
                type="password"
                value={props.formData.password}
                onChange={(event) => { props.updateField("password", event.currentTarget.value) }}
                required
            />
        </Stack>

    );
}
export default UserRegisterForm;
import { UserLoginFormData } from "../../types/FormDatas";
import { Stack, TextInput } from "@mantine/core";

type UserLoginFormProps = {
    formData: UserLoginFormData;
    updateField: <TKey extends keyof UserLoginFormData>(
        key: TKey,
        value: UserLoginFormData[TKey]
    ) => void;
};

const UserLoginForm = (props: UserLoginFormProps) => {
    return (
        <Stack>
            <TextInput
                label="Login"
                placeholder=""
                value={props.formData.login}
                onChange={(event) => { props.updateField("login", event.currentTarget.value) }}
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
export default UserLoginForm;
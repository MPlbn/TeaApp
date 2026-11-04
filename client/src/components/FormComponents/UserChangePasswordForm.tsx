import { Stack, TextInput } from "@mantine/core";
import { UserChangePasswordFormData } from "../../types/FormDatas";

type UserChangePasswordFormProps = {
    formData: UserChangePasswordFormData;
    updateField: <TKey extends keyof UserChangePasswordFormData>(
        key: TKey,
        value: UserChangePasswordFormData[TKey]
    ) => void;
};

const UserChangePasswordForm = (props: UserChangePasswordFormProps) => {
    return (
        <Stack>
            <TextInput
                label="Stare hasło"
                placeholder=""
                type="password"
                value={props.formData.oldPassword}
                onChange={(event) => { props.updateField("oldPassword", event.currentTarget.value) }}
                required
            />
            <TextInput
                label="Nowe hasło"
                placeholder=""
                type="password"
                value={props.formData.newPassword}
                onChange={(event) => { props.updateField("newPassword", event.currentTarget.value) }}
                required
            />
        </Stack>
    )
}

export default UserChangePasswordForm
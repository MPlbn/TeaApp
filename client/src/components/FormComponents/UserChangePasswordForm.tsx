import { PasswordInput, Stack } from "@mantine/core";
import { UserChangePasswordFormData } from "../../types/FormDatas";
import styles from "../../Styles/Form.module.css"

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
            <PasswordInput
                classNames={{
                    input: styles.input,
                    label: styles.label,
                }}
                size="md"
                radius="md"
                label="Stare hasło"
                placeholder="Wpisz hasło"
                value={props.formData.oldPassword}
                onChange={(event) => { props.updateField("oldPassword", event.currentTarget.value) }}
                required
            />
            <PasswordInput
                classNames={{
                    input: styles.input,
                    label: styles.label,
                }}
                size="md"
                radius="md"
                label="Nowe hasło"
                placeholder="Wpisz hasło"
                value={props.formData.newPassword}
                onChange={(event) => { props.updateField("newPassword", event.currentTarget.value) }}
                required
            />
        </Stack>
    )
}

export default UserChangePasswordForm
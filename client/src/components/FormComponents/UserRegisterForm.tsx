import { UserRegisterFormData } from "../../types/FormDatas";
import { PasswordInput, Stack, TextInput } from "@mantine/core";
import styles from "../../Styles/Form.module.css"


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
                classNames={{
                    input: styles.input,
                    label: styles.label,
                }}
                size="md"
                radius="md"
                label="Nazwa użytkownika"
                placeholder="Wpisz nazwę użytkownika"
                value={props.formData.userName}
                onChange={(event) => { props.updateField("userName", event.currentTarget.value) }}
                required
            />
            <TextInput
                classNames={{
                    input: styles.input,
                    label: styles.label,
                }}
                size="md"
                radius="md"
                label="Adres email"
                placeholder="name@email.com"
                value={props.formData.email}
                onChange={(event) => { props.updateField("email", event.currentTarget.value) }}
                required
            />
            <PasswordInput
                classNames={{
                    input: styles.input,
                    label: styles.label,
                }}
                size="md"
                radius="md"
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
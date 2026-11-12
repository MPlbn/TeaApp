import { Stack, TextInput } from "@mantine/core";
import { UserChangeDataFormData } from "../../types/FormDatas";
import styles from "../../Styles/Form.module.css"

type UserChangeDataFormProps = {
    formData: UserChangeDataFormData;
    updateField: <TKey extends keyof UserChangeDataFormData>(
        key: TKey,
        value: UserChangeDataFormData[TKey]
    ) => void;
};

const UserChangeDataForm = (props: UserChangeDataFormProps) => {
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
                label="Email"
                placeholder="name@email.com"
                value={props.formData.email}
                onChange={(event) => { props.updateField("email", event.currentTarget.value) }}
                required
            />
        </Stack>
    )
}

export default UserChangeDataForm
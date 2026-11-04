import { Stack, TextInput } from "@mantine/core";
import { UserChangeDataFormData } from "../../types/FormDatas";

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
                label="Nazwa użytkownika"
                placeholder=""
                value={props.formData.userName}
                onChange={(event) => { props.updateField("userName", event.currentTarget.value) }}
                required
            />
            <TextInput
                label="Email"
                placeholder=""
                value={props.formData.email}
                onChange={(event) => { props.updateField("email", event.currentTarget.value) }}
                required
            />
        </Stack>
    )
}

export default UserChangeDataForm
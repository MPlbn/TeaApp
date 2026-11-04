import useForm from "../../hooks/useForm";
import { useChangeUserPasswordMutation } from "../../services/teaApi";
import { emptyUserChangePasswordFormData, UserChangePasswordFormData } from "../../types/FormDatas";
import { ChangePasswordRequest } from "../../types/User";
import { userFormValidator } from "../../validators/formValidators";
import FormPanel from "../FormComponents/FormPanel";
import UserChangePasswordForm from "../FormComponents/UserChangePasswordForm";

const CHANGE_PASSWORD_SUCCESS_MESSAGE = "Poprawnie zmieniono hasło!";

type UserChangePasswordPanelProps = {
    onFinish: () => void
}

const UserChangePasswordPanel = (props: UserChangePasswordPanelProps) => {

    const {
        formData,
        updateField,
        isValid,
        getData
    } = useForm<UserChangePasswordFormData>(userFormValidator, emptyUserChangePasswordFormData);

    const [changePassword, { isLoading: isChanging }] = useChangeUserPasswordMutation();

    const handleChangePassword = async () => {
        const requestData = getData();
        const request = {
            currentPassword: requestData.oldPassword,
            newPassword: requestData.newPassword
        } as ChangePasswordRequest;

        await changePassword(request).unwrap();
    }

    return (
        <FormPanel
            title="Zmień hasło"
            description=""
            successMessage={CHANGE_PASSWORD_SUCCESS_MESSAGE}
            submitLabel="Zmień hasło"
            isValid={isValid()}
            isSaving={isChanging}
            onSave={handleChangePassword}
            onFinish={props.onFinish}
        >
            <UserChangePasswordForm
                formData={formData}
                updateField={updateField}
            />
        </FormPanel>
    )
}

export default UserChangePasswordPanel
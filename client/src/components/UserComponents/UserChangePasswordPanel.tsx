import useForm from "../../hooks/useForm";
import { useChangeUserPasswordMutation } from "../../services/teaApi";
import { emptyUserChangeDataFormData, emptyUserChangePasswordFormData, UserChangePasswordFormData } from "../../types/FormDatas";
import { ChangePasswordRequest } from "../../types/User";
import { convertUserRegisterFormDataToRegisterRequest } from "../../utils/utils";
import { userFormValidator } from "../../validators/formValidators";
import FormPanel from "../FormComponents/FormPanel";
import UserChangePasswordForm from "../FormComponents/UserChangePasswordForm";

const CHANGE_PASSWORD_SUCCESS_MESSAGE = "Poprawnie zmieniono hasło!";

const formPanelDetails = {
    title: "Zmień hasło",
    description: "",
    successMessage: CHANGE_PASSWORD_SUCCESS_MESSAGE,
    submitLabel: "Zmień hasło"
}

const converter = (formData: UserChangePasswordFormData) => {
    return {
        currentPassword: formData.oldPassword,
        newPassword: formData.newPassword
    } as ChangePasswordRequest;
}

type UserChangePasswordPanelProps = {
    onFinish: () => void
}

const UserChangePasswordPanel = (props: UserChangePasswordPanelProps) => {

    const {
        formData,
        updateField,
        isValid,
        getData
    } = useForm<UserChangePasswordFormData, ChangePasswordRequest>(userFormValidator, converter, emptyUserChangePasswordFormData, emptyUserChangePasswordFormData);

    const [changePassword, { isLoading: isChanging }] = useChangeUserPasswordMutation();

    const handleChangePassword = async () => {
        const requestData = getData();

        if (requestData === null) return;

        await changePassword(requestData).unwrap();
    }

    return (
        <FormPanel
            details={formPanelDetails}
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
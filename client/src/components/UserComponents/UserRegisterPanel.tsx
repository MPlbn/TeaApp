import useForm from "../../hooks/useForm";
import { useRegisterUserMutation } from "../../services/teaApi";
import { emptyUserRegisterFormData, FormPanelDetails, UserRegisterFormData } from "../../types/FormDatas";
import { UserRegisterRequest } from "../../types/User";
import { convertUserRegisterFormDataToRegisterRequest } from "../../utils/utils";
import { userFormValidator } from "../../validators/formValidators";
import FormPanel from "../FormComponents/FormPanel";
import UserRegisterForm from "../FormComponents/UserRegisterForm";

const REGISTER_SUCCESS_MESSAGE = "Poprawnie zarejestrowano! Można zalogować się na stworzone konto!"

const formPanelDetails = {
    title: "Zarejestruj się",
    description: "Uzupełnij dane do rejestracji",
    successMessage: REGISTER_SUCCESS_MESSAGE,
    submitLabel: "Zarejestruj się"
} as FormPanelDetails;

const converter = (formData: UserRegisterFormData) => {
    return {
        userName: formData.userName,
        email: formData.email,
        password: formData.password
    } as UserRegisterRequest;
}


type UserRegisterPanelProps = {
    onFinish: () => void;
}

const UserRegisterPanel = (props: UserRegisterPanelProps) => {
    const {
        formData,
        updateField,
        isValid,
        getData
    } = useForm<UserRegisterFormData, UserRegisterRequest>(userFormValidator, converter, emptyUserRegisterFormData, emptyUserRegisterFormData);

    const [registerUser, { isLoading: isRegistering }] = useRegisterUserMutation();

    const handleRegister = async () => {
        const userToRegister = getData();

        if (userToRegister === null) return;

        await registerUser(userToRegister).unwrap();
    }

    return (
        <FormPanel
            details={formPanelDetails}
            isValid={isValid()}
            isSaving={isRegistering}
            onSave={handleRegister}
            onFinish={props.onFinish}
        >
            <UserRegisterForm
                formData={formData}
                updateField={updateField}
            />
        </FormPanel>
    )
}

export default UserRegisterPanel;
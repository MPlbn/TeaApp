import useForm from "../../hooks/useForm";
import { useRegisterUserMutation } from "../../services/teaApi";
import { emptyUserRegisterFormData, UserRegisterFormData } from "../../types/FormDatas";
import { convertUserRegisterFormDataToRegisterRequest } from "../../utils/utils";
import { userFormValidator } from "../../validators/formValidators";
import FormPanel from "../FormComponents/FormPanel";
import UserRegisterForm from "../FormComponents/UserRegisterForm";

const REGISTER_SUCCESS_MESSAGE = "Poprawnie zarejestrowano! Można zalogować się na stworzone konto!"

type UserRegisterPanelProps = {
    onFinish: () => void;
}

const UserRegisterPanel = (props: UserRegisterPanelProps) => {
    const {
        formData,
        updateField,
        isValid,
        getData
    } = useForm<UserRegisterFormData>(userFormValidator, emptyUserRegisterFormData);

    const [registerUser, { isLoading: isRegistering }] = useRegisterUserMutation();

    const handleRegister = async () => {
        const userToRegister = convertUserRegisterFormDataToRegisterRequest(getData());
        await registerUser(userToRegister).unwrap();
    }

    return (
        <FormPanel
            title="Zarejestruj się"
            description="Uzupełnij dane do rejestracji"
            successMessage={REGISTER_SUCCESS_MESSAGE}
            submitLabel="Zarejestruj się"
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
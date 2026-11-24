import { userFormValidator } from '../../../validators/formValidators';
import { emptyUserLoginFormData, FormPanelDetails, UserLoginFormData } from '../../../types/FormDatas';
import useForm from '../../../hooks/useForm';
import FormPanel from './FormPanel';
import UserLoginForm from '../Forms/UserLoginForm';
import { useLoginUserMutation } from '../../../services/teaApi';
import { useAppDispatch } from '../../../store/hooks';
import { setCredentials } from '../../../store/authSlice';
import { UserLoginRequest } from '../../../types/User';

const LOGIN_SUCCESS_MESSAGE = "Poprawnie zalogowano!"

const formPanelDetails = {
    title: "Zaloguj się",
    description: "Uzupełnij dane do logowania",
    successMessage: LOGIN_SUCCESS_MESSAGE,
    submitLabel: "Zaloguj się"
} as FormPanelDetails;

type UserLoginPanelProps = {
    onFinish: () => void;
}

const converter = (formData: UserLoginFormData) => {
    return {
        login: formData.login,
        password: formData.password
    } as UserLoginRequest;
}

const UserLoginPanel = (props: UserLoginPanelProps) => {

    const dispatch = useAppDispatch();

    const {
        formData,
        updateField,
        isValid,
        getData
    } = useForm<UserLoginFormData, UserLoginRequest>(userFormValidator, converter, emptyUserLoginFormData, emptyUserLoginFormData);

    const [loginUser, { isLoading: isLoggingIn }] = useLoginUserMutation();

    const handleLogin = async () => {
        const userToLogin = getData();

        if (userToLogin === null) return;

        const response = await loginUser(userToLogin).unwrap()

        await window.authStorage.save(response.refreshToken);

        dispatch(setCredentials({
            accessToken: response.token,
            expiresAt: response.expiresAt
        }));
    }

    return (
        <FormPanel
            details={formPanelDetails}
            isValid={isValid()}
            isSaving={isLoggingIn}
            onSave={handleLogin}
            onFinish={props.onFinish}
        >
            <UserLoginForm
                formData={formData}
                updateField={updateField}
            />
        </FormPanel>
    )
}

export default UserLoginPanel;
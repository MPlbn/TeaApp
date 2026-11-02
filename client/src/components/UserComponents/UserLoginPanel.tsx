import { userFormValidator } from '../../validators/formValidators';
import { emptyUserLoginFormData, UserLoginFormData } from '../../types/FormDatas';
import useForm from '../../hooks/useForm';
import FormPanel from '../FormComponents/FormPanel';
import UserLoginForm from '../FormComponents/UserLoginForm';
import { convertUserLoginFormDataToLoginRequest } from '../../utils/utils';
import { useLoginUserMutation } from '../../services/teaApi';
import { useAppDispatch } from '../../store/hooks';
import { setCredentials } from '../../store/authSlice';

const LOGIN_SUCCESS_MESSAGE = "Poprawnie zalogowano!"

type UserLoginPanelProps = {
    onFinish: () => void;
}

const UserLoginPanel = (props: UserLoginPanelProps) => {

    const dispatch = useAppDispatch();

    const {
        formData,
        updateField,
        isValid,
        getData
    } = useForm<UserLoginFormData>(userFormValidator, emptyUserLoginFormData);

    const [loginUser, { isLoading: isLoggingIn }] = useLoginUserMutation();

    const handleLogin = async () => {
        const userToLogin = convertUserLoginFormDataToLoginRequest(getData());

        const response = await loginUser(userToLogin).unwrap()

        dispatch(setCredentials({
            accessToken: response.token,
            refreshToken: response.refreshToken,
            expiresAt: response.expiresAt
        }));
    }

    return (
        <FormPanel
            title="Zaloguj się"
            description="Uzupełnij dane do logowania"
            successMessage={LOGIN_SUCCESS_MESSAGE}
            submitLabel="Zaloguj się"
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
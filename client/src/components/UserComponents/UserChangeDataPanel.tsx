import useForm from '../../hooks/useForm';
import { userFormValidator } from '../../validators/formValidators';
import { emptyUserChangeDataFormData, FormPanelDetails as formPanelDetails, UserChangeDataFormData } from '../../types/FormDatas';
import { useUpdateUserProfileMutation } from '../../services/teaApi';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import FormPanel from '../FormComponents/FormPanel';
import UserChangeDataForm from '../FormComponents/UserChangeDataForm';
import { UpdateProfileRequest } from '../../types/User';
import { setUser } from '../../store/authSlice';
const UPDATE_PROFILE_SUCCESS_MESSAGE = "Poprawnie zaktualizowano dane!";

const converter = (formData: UserChangeDataFormData) => {
    return {
        userName: formData.userName,
        email: formData.email
    } as UpdateProfileRequest;
}

type UserChangeDataPanelProps = {
    onFinish: () => void
}

const formPanelDetails = {
    title: "Zmień dane",
    description: "Zmień dane konta",
    successMessage: UPDATE_PROFILE_SUCCESS_MESSAGE,
    submitLabel: "Zmień dane konta"
} as formPanelDetails;

const UserChangeDataPanel = (props: UserChangeDataPanelProps) => {

    const user = useAppSelector((state) => state.auth.user);

    const filledData = {
        userName: user?.userName,
        email: user?.email
    } as UserChangeDataFormData;

    const {
        formData,
        updateField,
        isValid,
        getData
    } = useForm<UserChangeDataFormData, UpdateProfileRequest>(userFormValidator, converter, emptyUserChangeDataFormData, filledData);

    const dispatch = useAppDispatch();

    const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

    const handleUpdateProfile = async () => {
        const userDataToUpdate = getData();

        if (userDataToUpdate === null) return;

        const updatedUser = await updateProfile(userDataToUpdate).unwrap();

        if (user) {
            dispatch(setUser({
                ...user,
                ...updatedUser
            }));
        }
    }

    return (
        <FormPanel
            details={formPanelDetails}
            isValid={isValid()}
            isSaving={isUpdating}
            onSave={handleUpdateProfile}
            onFinish={props.onFinish}
        >
            <UserChangeDataForm
                formData={formData}
                updateField={updateField}
            />
        </FormPanel>
    )
}

export default UserChangeDataPanel
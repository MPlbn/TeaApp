import { UserChangeDataFormData, UserChangePasswordFormData, UserLoginFormData, UserRegisterFormData } from "../types/FormDatas";

export function userFormValidator(formData: UserRegisterFormData | UserLoginFormData | UserChangePasswordFormData | UserChangeDataFormData): boolean {
    const areAllFieldsFilled = !Object.values(formData).some((value) => value.trim() === "");
    return areAllFieldsFilled;
}
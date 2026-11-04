import { BrewingMethodFormData, ReviewFormData, TeaFormData, UserChangeDataFormData, UserChangePasswordFormData, UserLoginFormData, UserRegisterFormData } from "../types/FormDatas";

export function teaFormValidator(formData: TeaFormData): boolean {
    const price = Number(formData.price)
    if (formData.name.trim() === '') return false;

    if (formData.type === null) return false;


    if (
        formData.price === '' ||
        price <= 0 ||
        !Number.isFinite(price)
    ) return false;

    return true;
}
export function brewingMethodFormValidator(formData: BrewingMethodFormData): boolean {

    if (formData.method === null) return false;

    if (formData.temperature === "") return false;

    if (formData.brewingTimes.length === 0 || formData.brewingTimes.some((time) => time <= 0)) return false;

    return true;
}

export function reviewFormValidator(formData: ReviewFormData): boolean {
    if (formData.teaId <= 0 || formData.userId <= 0) return false //userId to change, it will be string

    if (formData.review === "") return false;

    if (formData.rating === null) return false;

    return true
}

export function userFormValidator(formData: UserRegisterFormData | UserLoginFormData | UserChangePasswordFormData | UserChangeDataFormData): boolean {
    const areAllFieldsFilled = !Object.values(formData).some((value) => value.trim() === "");
    return areAllFieldsFilled;
}
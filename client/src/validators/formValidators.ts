import { TeaFormData } from "../types/FormDatas";

export function teaFormValidator(formData: TeaFormData): boolean {
    const price = Number(formData.price)
        if (formData.name.trim() === '') {
            return false;
        }

        if (formData.type === null) {
            return false;
        }

        if (
            formData.price === '' ||
            price <= 0 ||
            !Number.isFinite(price)
        ) {
            return false;
        }

        return true;
}
export function brewingMethodFormValidator(): boolean {
    return true;
}
export function reviewFormValidator(): boolean {
    return true;
}
import { BrewingMethodFormData, ReviewFormData, TeaFormData } from "../types/FormDatas";

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
    
    if(formData.teaId === 0 || formData.teaId === null){
        return false;
    }

    if(formData.method === null) return false;

    if(formData.temperature === "") return false;

    if(formData.brewingTimes.length === 0 || formData.brewingTimes.some((time) => time <= 0) ) return false;

    return true;
}
export function reviewFormValidator(formData: ReviewFormData): boolean {
    return true;
}
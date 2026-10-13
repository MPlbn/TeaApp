import { useState } from "react";

function useForm<TFormData extends object>(emptyData: TFormData, initialData: TFormData = emptyData, validationFunction: (data: TFormData) => boolean) {
    const [formData, setFormData] = useState<TFormData>(initialData);

    function clearForm(): void {
        setFormData(emptyData);
    }

    function setFormValues(data: TFormData): void {
        setFormData(data);
    }

    function updateField<TKey extends keyof TFormData>(
        key: TKey,
        value: TFormData[TKey]
    ) : void {
        setFormData((previous) => {return {...previous, [key]: value}});
    }

    function isValid(): boolean {
        return validationFunction(formData);
    }

    function getData(): TFormData {
        return Object.fromEntries(
            Object.entries(formData).map(([key, value]) => [
                key,
                typeof value === "string" ? value.trim() : value
            ])
        ) as TFormData;
    }

    return {
        formData,
        updateField,
        clearForm,
        isValid,
        getData,
        setFormValues
    }
}
export default useForm;
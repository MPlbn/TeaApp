import { useState } from "react";

function useForm<TFormData extends object, TData extends object>(
    validationFunction: (data: TFormData) => boolean,
    converterFunction: (data: TFormData) => TData | null,
    emptyData: TFormData,
    initialData: TFormData = emptyData) {
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
    ): void {
        setFormData((previous) => { return { ...previous, [key]: value } });
    }

    function normalizeData(data: TFormData): TFormData {
        return Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
                key,
                typeof value === "string" ? value.trim() : value
            ])
        ) as TFormData;
    }

    function isValid(): boolean {
        return validationFunction(normalizeData(formData));
    }

    function getData(): TData | null {
        const data = normalizeData(formData);

        if (!validationFunction(data)) return null;

        return converterFunction(data) as TData;
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
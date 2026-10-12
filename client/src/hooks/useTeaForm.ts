import { useState } from "react";
import { TeaFormData } from "../types/TeaFormData";

const INITIAL_FORM_DATA: TeaFormData = {
    name: "",
    type: null,
    origin: "",
    price: "",
    shop: "",
    description: ""
}

const useTeaForm = (initialData: TeaFormData = INITIAL_FORM_DATA) => {
    const [formData, setFormData] = useState<TeaFormData>(initialData);

    function clearForm(): void {
       setFormData(INITIAL_FORM_DATA);
    }

    function setFormValues(data: TeaFormData): void {
        setFormData(data);
    }

    function updateField<TKey extends keyof TeaFormData>(
        uKey: TKey,
        uValue: TeaFormData[TKey]
    ) : void {
        setFormData((uPrevious) => {return {...uPrevious, [uKey]: uValue}});
    }

    function isValid(): boolean {
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

    function getTeaData(): TeaFormData {
        return {
            name: formData.name.trim(),
            type: formData.type,
            origin: formData.origin.trim(),
            price: formData.price,
            shop: formData.shop.trim(),
            description: formData.description.trim()
        };
    }

    return {
        formData,
        updateField,
        clearForm,
        isValid,
        getTeaData,
        setFormValues
    };
}

export default useTeaForm;
import { useState } from "react";
import { TeaAdditionFormData } from "../types/TeaAdditionFormData";

const useAddTeaForm = () => {
    const [formData, setFormData] = useState<TeaAdditionFormData>({
        name: '',
        type: null,
        origin: '',
        price: '',
        shop: '',
        description: ''
    });

    function clearForm(): void {
        setFormData({
            name: '',
            type: null,
            origin: '',
            price: '',
            shop: '',
            description: ''
        });
    }

    function updateField<TKey extends keyof TeaAdditionFormData>(
        uKey: TKey,
        uValue: TeaAdditionFormData[TKey]
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
            price < 0 ||
            !Number.isFinite(price)
        ) {
            return false;
        }

        return true;
    }

    function getTeaData(): TeaAdditionFormData {
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
        getTeaData
    };
}

export default useAddTeaForm;
import { useState } from "react";
import { TeaAdditionFormData } from "../types/TeaAdditionFormData";

export default function useAddTeaForm() {
    const [formData, setFormData] = useState<TeaAdditionFormData>({
        name: '',
        teaType: null,
        origin: '',
        price: '',
        shop: '',
        description: ''
    });

    function clearForm(): void {
        setFormData({
            name: '',
            teaType: null,
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
        if (formData.name.trim() === '') {
            return false;
        }

        if (formData.teaType === null) {
            return false;
        }

        if (formData.price === '' || Number(formData.price) < 0) {
            return false;
        }

        return true;
    }

    function getTeaData(): TeaAdditionFormData {
        return {
            name: formData.name.trim(),
            teaType: formData.teaType,
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
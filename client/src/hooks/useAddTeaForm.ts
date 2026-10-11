import { useState } from "react";
import { AddTeaFormData } from "../types/AddTeaFormData";

export default function useAddTeaForm() {
    const [formData, setFormData] = useState<AddTeaFormData>({
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

    function updateField<TKey extends keyof AddTeaFormData>(
        uKey: TKey,
        uValue: AddTeaFormData[TKey]
    ) : void {
        setFormData(
            function (uPrevious) {
                return {
                    ...uPrevious,
                    [uKey]: uValue
                };
            }
        );
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

    function getTeaData(): AddTeaFormData {
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
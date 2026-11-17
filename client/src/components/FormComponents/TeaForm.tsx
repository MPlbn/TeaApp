import {
    Grid,
    TextInput,
    Select,
    NumberInput,
    Textarea,
    MultiSelect,
    GridCol
} from "@mantine/core";
import { TeaType, FlavorType, UserRole } from "../../types/enums";
import { getTeaTypeStringVersion } from "../../utils/utils";
import { FormMode, FormPanelDetails } from "../../types/FormDatas";
import { flavorOptions } from "../../config/FlavorOptions";
import { User } from "../../types/User";
import { CollectionType } from "../../types/enums";
import { Tea } from "../../types/Tea";
import { NewTea, useAddTeaMutation, useEditTeaMutation } from "../../services/teaApi";
import useForm from "../../hooks/useForm";
import FormPanel from "./FormPanel";

const ADD_FORM_PANEL_DETAILS = {
    title: "Dodaj <Object>",
    description: "Uzupełnij informacje o <Object>",
    successMessage: "Poprawnie dodano <Object>!",
    submitLabel: "Dodaj"
} as FormPanelDetails;

const EDIT_FORM_PANEL_DETAILS = {
    title: "Edytuj <Object>",
    description: "Uzupełnij informacje o <Object>",
    successMessage: "Poprawnie edytowano <Object>!",
    submitLabel: "Zapisz zmiany"
} as FormPanelDetails;

// Add all input returns
type FormData = {
    name: string;
    type: TeaType | null;
    origin: string;
    price: string | number;
    shop: string;
    description: string;
    flavors: FlavorType[];
    isPublic: boolean;
}

// Create empty state
const EMPTY_FORM_DATA = {
    name: "",
    type: null,
    origin: "",
    price: "",
    shop: "",
    description: "",
    flavors: [],
    isPublic: false
} as FormData;

//change <any> to API correct object type
const converter = (formData: FormData): NewTea => {
    return {
        name: formData.name,
        type: formData.type,
        origin: formData.origin,
        price: formData.price,
        shop: formData.shop,
        description: formData.description,
        flavors: formData.flavors,
        isPublic: formData.isPublic
    } as NewTea;
}

const convertToFormData = (tea: Tea): FormData => {
    return {
        name: tea.name,
        type: tea.type,
        origin: tea.origin,
        price: tea.price ?? "",
        shop: tea.shop,
        description: tea.description,
        flavors: [...tea.flavors],
        isPublic: tea.isPublic
    } as FormData;
}

//Validate if the fields are true - assume normalized data
const validator = (formData: FormData): boolean => {
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

const teaTypeOptions = Object.values(TeaType)
    .filter((value): value is TeaType => typeof value === 'number')
    .map((teaType) => ({
        value: String(teaType),
        label: getTeaTypeStringVersion(teaType)
    }));

type TeaFormProps = {
    onFinish?: () => void;
    initialTea?: Tea;
    additionalArgs?: {
        user: User;
    }
};

const TeaForm = (props: TeaFormProps) => {
    const [addTea, { isLoading: isAdding }] = useAddTeaMutation();
    const [editTea, { isLoading: isEditing }] = useEditTeaMutation();

    const formMode = props.initialTea ? FormMode.Edit : FormMode.Add

    const {
        formData,
        updateField,
        clearForm,
        isValid,
        getData
    } = useForm<FormData, NewTea>(validator, converter, EMPTY_FORM_DATA, props.initialTea ? convertToFormData(props.initialTea) : EMPTY_FORM_DATA);

    const handleSave = async () => {
        const teaToSave = getData();

        if (teaToSave === null) return;

        switch (formMode) {
            case FormMode.Add:
                await addTea(teaToSave).unwrap();
                break;
            case FormMode.Edit:
                await editTea({ teaId: props.initialTea!.id, tea: teaToSave }).unwrap();
                break;
            default:
                break;
        }
    }

    const getDetails = (): FormPanelDetails => {
        switch (formMode) {
            case FormMode.Add:
                return ADD_FORM_PANEL_DETAILS;
            case FormMode.Edit:
                return EDIT_FORM_PANEL_DETAILS;
        }
    }

    const getIsSaving = () => {
        switch (formMode) {
            case FormMode.Add:
                return isAdding;
            case FormMode.Edit:
                return isEditing;
        }
    }

    const renderSelection = () => {
        if (!props.additionalArgs || !props.additionalArgs.user.roles.includes(UserRole.Admin)) return;

        const data = [
            { value: true, label: "Publiczna" },
            { value: false, label: "Prywatna" }
        ];

        return (
            <Grid.Col span={{ base: 12, sm: 6 }}>
                <Select
                    label="Rodzaj kolekcji"
                    placeholder="Wybierz rodzaj"
                    data={data}
                    value={formData.isPublic}
                    onChange={(value) => {
                        if (value !== null) {
                            updateField("isPublic", value)
                        }
                    }}
                    clearable
                />
            </Grid.Col>
        )
    }

    return (
        <FormPanel
            details={getDetails()}
            isValid={isValid()}
            isSaving={getIsSaving()}
            onSave={handleSave}
            onFinish={props.onFinish ?? clearForm}
            onClear={formMode === FormMode.Add ? clearForm : undefined}
        >

            <Grid gap="md">
                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                        label="Nazwa herbaty"
                        placeholder="np. Huoshan Huang Ya"
                        value={formData.name}
                        onChange={(event) => { updateField("name", event.currentTarget.value) }}
                        required
                    />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Select
                        label="Rodzaj herbaty"
                        placeholder="Wybierz rodzaj"
                        data={teaTypeOptions}
                        value={formData.type === null ? null : String(formData.type)}
                        onChange={
                            (value) => { updateField("type", value === null ? null : Number(value) as TeaType) }}
                        required
                    />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                        label="Pochodzenie"
                        placeholder="np. Chiny, Yunnan"
                        value={formData.origin}
                        onChange={(event) => { updateField("origin", event.currentTarget.value) }}
                    />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <NumberInput
                        label="Cena PLN/50g"
                        placeholder="45.45 zł"
                        value={formData.price}
                        onChange={(value) => { updateField("price", value) }}
                        min={0}
                        decimalScale={2}
                        fixedDecimalScale={false}
                        suffix=" zł"
                        required
                    />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                        label="Sklep"
                        placeholder="Nazwa sklepu, np. e-herbata"
                        value={formData.shop}
                        onChange={(event) => { updateField("shop", event.currentTarget.value) }}
                    />
                </Grid.Col>

                <Grid.Col span={12}>
                    <MultiSelect
                        label="Nuty smakowe"
                        placeholder="Wybierz nuty smakowe"
                        data={flavorOptions.map((option) => ({
                            value: String(option.value),
                            label: option.label,
                        }))}
                        value={formData.flavors.map(String)}
                        onChange={(values) => {
                            updateField(
                                "flavors",
                                values.map((value) => Number(value) as FlavorType)
                            );
                        }}
                        searchable
                        clearable
                        hidePickedOptions
                    />
                </Grid.Col>

                <Grid.Col span={12}>
                    <Textarea
                        label="Opis"
                        placeholder="Krótki opis herbaty..."
                        value={formData.description}
                        onChange={(event) => { updateField('description', event.currentTarget.value) }}
                    />
                </Grid.Col>

                {renderSelection()}
            </Grid>
        </FormPanel>
    );
}
export default TeaForm;
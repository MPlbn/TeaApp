export type UserRegisterFormData = {
    userName: string;
    email: string;
    password: string;
};

export const emptyUserRegisterFormData = {
    userName: "",
    email: "",
    password: "",
};

export type UserLoginFormData = {
    login: string;
    password: string;
}

export const emptyUserLoginFormData = {
    login: "",
    password: ""
}

export type UserChangePasswordFormData = {
    oldPassword: string;
    newPassword: string;
}

export const emptyUserChangePasswordFormData = {
    oldPassword: "",
    newPassword: ""
}

export type UserChangeDataFormData = {
    userName: string;
    email: string;
}

export const emptyUserChangeDataFormData = {
    userName: "",
    email: ""
}

export enum FormMode {
    Add,
    Edit
}

export type FormPanelDetails = {
    title: string;
    description: string;
    successMessage: string;
    submitLabel: string;
}
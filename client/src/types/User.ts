export type UserRegisterRequest = {
    userName: string;
    email: string;
    password: string;
};

export type UserLoginRequest = {
    login: string;
    password: string;
}

export type AuthResponse = {
    token: string;
    refreshToken: string;
    expiresAt: string;
}

export type RefreshTokenRequest = {
    refreshToken: string;
}

export type ChangePasswordRequest = {
    currentPassword: string;
    newPassword: string;
}

export type UpdateProfileRequest = {
    userName?: string;
    email?: string;
}

export type UpdateProfileResponse = {
    id: string;
    userName: string;
    email: string;
}

export type User = {
    id: string;
    userName: string;
    email: string;
    roles: string[];
}
import { FlavorType, MethodType, UserRole, ViewType } from "../types/enums";
import { TeaType } from "../types/enums";
import { UserLoginFormData, UserRegisterFormData } from "../types/FormDatas";
import { Tea } from "../types/Tea";
import { Review } from "../types/Review";
import { flavorOptions } from "../config/FlavorOptions";
import { User, UserLoginRequest, UserRegisterRequest } from "../types/User";

export function getTeaDetailsPath(teaID: number | string, isPublic: boolean): string {
    const path = isPublic ? `${ViewType.TeaListView}/${teaID}` : `${ViewType.PrivateTeaListView}/${teaID}`
    return path;
}

export function getTeaTypeStringVersion(teaType: TeaType): string {
    switch (teaType) {
        case TeaType.White: return 'Biała';
        case TeaType.Green: return 'Zielona';
        case TeaType.Yellow: return 'Żółta';
        case TeaType.Oolong: return 'Oolong';
        case TeaType.Black: return 'Czarna';
        case TeaType.Heicha: return 'Heicha';
        default: return 'Nieznany typ';
    }
}

export function getTeaTypeColor(teaType: TeaType): string {
    switch (teaType) {
        case TeaType.White: return "#8C9299";
        case TeaType.Green: return "#63865F";
        case TeaType.Yellow: return "#C49A36";
        case TeaType.Oolong: return "#9276B5";
        case TeaType.Black: return "#B96B68";
        case TeaType.Heicha: return "#997451";
        default: return "#8C9299";
    }
}

export function getMethodTypeStringVersion(methodType: MethodType): string {
    switch (methodType) {
        case MethodType.Gongfu: return "Gongfu";
        case MethodType.Western: return "Klasyczne";
        case MethodType.Alternative: return "Alternatywne";
        default: return "Nieznany typ parzenia";
    }
}

export function getFlavorTypeStringVersion(flavor: FlavorType): string {
    return flavorOptions.find((option) => option.value === flavor)?.label ?? "Nieznana nuta";
}

export function convertUserLoginFormDataToLoginRequest(formData: UserLoginFormData): UserLoginRequest {
    return {
        login: formData.login,
        password: formData.password
    } as UserLoginRequest;
}

export function convertUserRegisterFormDataToRegisterRequest(formData: UserRegisterFormData): UserRegisterRequest {
    return {
        userName: formData.userName,
        email: formData.email,
        password: formData.password
    } as UserRegisterRequest;
}

export function isUserAuthorizedToEditTea(tea: Tea, user: User | null): boolean {
    if (!user) return false;

    if (tea.ownerId === null && user.roles.includes(UserRole.Admin)) return true;
    else if (tea.ownerId === user.id) return true;

    return false;
}

export function isUserAuthorizedToAddReview(tea: Tea, user: User | null): boolean {
    return user !== null && (tea.ownerId === null || tea.ownerId === user.id);
}

export function doesUserOwnReviewInSet(reviews: Review[], user: User | null): boolean {
    return user === null || reviews.some(review => review.userId === user.id);
}

export function isUserAuthorizedToModifyReview(review: Review, user: User | null): boolean {
    return user !== null && review.userId === user.id;
}
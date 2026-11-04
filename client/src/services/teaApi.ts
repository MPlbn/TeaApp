import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BrewingMethod } from "../types/BrewingMethod";
import { Review } from "../types/Review";
import { Tea, ShortTea } from "../types/Tea";
import { AuthResponse, ChangePasswordRequest, RefreshTokenRequest, UpdateProfileRequest, UpdateProfileResponse, User, UserLoginRequest, UserRegisterRequest } from "../types/User";
import { RootState } from "../store/store";

const BASE_URL = "http://localhost:8080/api";
const TEA_URL = "Tea/public";
const BREWING_METHOD_URL = "BrewingMethod";
const REVIEW_URL = "TeaReview";
const AUTH_URL = "auth";

const TAG_TEA = "Tea"
const TAG_BREWING_METHOD = "BrewingMethod"
const TAG_REVIEW = "TeaReview"
const TAG_USER = "User";


export type NewTea = Omit<Tea, "id">
export type NewBrewingMethod = Omit<BrewingMethod, "id">
export type NewReview = Omit<Review, "id">

export const teaApi = createApi({
    reducerPath: "teaApi",

    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const state = getState() as RootState
            const token = state.auth.accessToken;

            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }

            return headers;
        }
    }),

    tagTypes: [TAG_TEA, TAG_BREWING_METHOD, TAG_REVIEW, TAG_USER],

    endpoints: (build) => ({
        //Tea
        getAllTeasForList: build.query<ShortTea[], void>({
            query: () => TEA_URL,
            providesTags: [TAG_TEA]
        }),

        getTeaByID: build.query<Tea, number>({
            query: (teaId) => `${TEA_URL}/${teaId}`,
            providesTags: (_result, _error, teaId) => [
                { type: TAG_TEA, id: teaId }
            ]
        }),

        addTea: build.mutation<Tea, NewTea>({
            query: (tea) => ({
                url: TEA_URL,
                method: "POST",
                body: tea
            }),
            invalidatesTags: [TAG_TEA]
        }),

        editTea: build.mutation<void, { teaId: number; tea: NewTea }>({
            query: ({ teaId: teaId, tea: tea }) => ({
                url: `${TEA_URL}/${teaId}`,
                method: "PUT",
                body: tea
            }),
            invalidatesTags: (_result, _error, argument) => [
                TAG_TEA,
                { type: TAG_TEA, id: argument.teaId }
            ]
        }),

        deleteTea: build.mutation<void, number>({
            query: (id) => ({
                url: `${TEA_URL}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [TAG_TEA]
        }),

        //BrewingMethod
        getBrewingMethodsByTeaID: build.query<BrewingMethod[], number>({
            query: (teaId) => `${BREWING_METHOD_URL}/?teaId=${teaId}`,
            providesTags: [TAG_BREWING_METHOD]
        }),

        addBrewingMethod: build.mutation<BrewingMethod, NewBrewingMethod>({
            query: (brewingMethod) => ({
                url: BREWING_METHOD_URL,
                method: "POST",
                body: brewingMethod
            }),
            invalidatesTags: [TAG_BREWING_METHOD]
        }),

        editBrewingMethod: build.mutation<void, { brewingMethodId: number; brewingMethod: NewBrewingMethod }>({
            query: ({ brewingMethodId: id, brewingMethod: brewingMethod }) => ({
                url: `${BREWING_METHOD_URL}/${id}`,
                method: "PUT",
                body: brewingMethod
            }),
            invalidatesTags: (_result, _error, argument) => [
                TAG_BREWING_METHOD,
                { type: TAG_BREWING_METHOD, id: argument.brewingMethodId }
            ]
        }),

        deleteBrewingMethod: build.mutation<void, number>({
            query: (id) => ({
                url: `${BREWING_METHOD_URL}/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: [TAG_BREWING_METHOD]
        }),

        //Review
        getReviewsByTeaID: build.query<Review[], number>({
            query: (teaId) => `${REVIEW_URL}/?teaId=${teaId}`,
            providesTags: [TAG_REVIEW]
        }),

        addReview: build.mutation<Review, NewReview>({
            query: (review) => ({
                url: REVIEW_URL,
                method: "POST",
                body: review
            }),
            invalidatesTags: [TAG_REVIEW]
        }),

        editReview: build.mutation<void, { reviewId: number; review: NewReview }>({
            query: ({ reviewId: id, review: review }) => ({
                url: `${REVIEW_URL}/${id}`,
                method: "PUT",
                body: review
            }),
            invalidatesTags: (_result, _error, argument) => [
                TAG_REVIEW,
                { type: TAG_REVIEW, id: argument.reviewId }
            ]
        }),

        deleteReview: build.mutation<void, number>({
            query: (id) => ({
                url: `${REVIEW_URL}/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: [TAG_REVIEW]
        }),

        //User / AUTH
        registerUser: build.mutation<void, UserRegisterRequest>({
            query: (userData) => ({
                url: `${AUTH_URL}/register`,
                method: "POST",
                body: userData
            })
        }),

        loginUser: build.mutation<AuthResponse, UserLoginRequest>({
            query: (loginData) => ({
                url: `${AUTH_URL}/login`,
                method: "POST",
                body: loginData
            })
        }),

        logoutUser: build.mutation<void, RefreshTokenRequest>({
            query: (request) => ({
                url: `${AUTH_URL}/logout`,
                method: "POST",
                body: request
            })
        }),

        getCurrentUser: build.query<User, void>({
            query: () => "auth/me"
        }),

        changeUserPassword: build.mutation<string, ChangePasswordRequest>({
            query: (request) => ({
                url: `${AUTH_URL}/change-password`,
                method: "POST",
                body: request
            })
        }),

        updateUserProfile: build.mutation<UpdateProfileResponse, UpdateProfileRequest>({
            query: (request) => ({
                url: `${AUTH_URL}/me`,
                method: "PUT",
                body: request
            })
        }),

        refreshToken: build.mutation<AuthResponse, RefreshTokenRequest>({
            query: (request) => ({
                url: `${AUTH_URL}/refresh`,
                method: "POST",
                body: request
            })
        }),
    }),
});

export const {
    useGetAllTeasForListQuery,
    useGetTeaByIDQuery,
    useAddTeaMutation,
    useEditTeaMutation,
    useDeleteTeaMutation,

    useGetBrewingMethodsByTeaIDQuery,
    useAddBrewingMethodMutation,
    useEditBrewingMethodMutation,
    useDeleteBrewingMethodMutation,

    useGetReviewsByTeaIDQuery,
    useAddReviewMutation,
    useEditReviewMutation,
    useDeleteReviewMutation,

    useRegisterUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useGetCurrentUserQuery,
    useChangeUserPasswordMutation,
    useUpdateUserProfileMutation,
    useRefreshTokenMutation,
} = teaApi;
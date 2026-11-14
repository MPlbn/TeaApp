import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BrewingMethod } from "../types/BrewingMethod";
import { Review } from "../types/Review";
import { Tea, ShortTea } from "../types/Tea";
import { AuthResponse, ChangePasswordRequest, RefreshTokenRequest, UpdateProfileRequest, UpdateProfileResponse, User, UserLoginRequest, UserRegisterRequest } from "../types/User";
import { RootState } from "../store/store";
import { Mutex } from "async-mutex";
import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { clearCredentials, setCredentials } from "../store/authSlice";

const BASE_URL = "http://localhost:8080/api";
const PUBLIC_TEA_URL = "Tea/public";
const PRIVATE_TEA_URL = "Tea/private";
const TEA_URL = "Tea";
const BREWING_METHOD_URL = "BrewingMethod";
const REVIEW_URL = "TeaReview";
const AUTH_URL = "auth";

const TAG_TEA_PUBLIC = "Tea";
const TAG_TEA_PRIVATE = "TeaPrivate";
const TAG_BREWING_METHOD = "BrewingMethod";
const TAG_REVIEW = "TeaReview";
const TAG_USER = "User";


export type NewTea = Omit<Tea, "id">
export type NewBrewingMethod = Omit<BrewingMethod, "id">
export type NewReview = Omit<Review, "id">

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
        const state = getState() as RootState
        const token = state.auth.accessToken;

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        return headers;
    }
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    await mutex.waitForUnlock();

    let result = await baseQuery(args, api, extraOptions);

    const requestUrl = typeof args === "string" ? args : args.url;
    const isLoginRequest = requestUrl.endsWith("auth/login");

    if (result.error?.status === 401 && !isLoginRequest) {
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();

            try {
                const state = api.getState() as RootState;
                const refreshToken = state.auth.refreshToken;

                if (refreshToken) {
                    const refreshResult = await baseQuery(
                        {
                            url: `${AUTH_URL}/refresh`,
                            method: "POST",
                            body: { refreshToken }
                        },
                        api,
                        extraOptions
                    )

                    if (refreshResult.data) {
                        const data = refreshResult.data as {
                            accessToken: string;
                            refreshToken: string;
                            expiresAt: string;
                        };

                        api.dispatch(setCredentials({
                            accessToken: data.accessToken,
                            refreshToken: data.refreshToken,
                            expiresAt: data.expiresAt
                        }));

                        result = await baseQuery(args, api, extraOptions);
                    }
                    else {
                        api.dispatch(clearCredentials());
                    }
                }
                else {
                    api.dispatch(clearCredentials());
                }
            } finally {
                release();
            }
        }
        else {
            await mutex.waitForUnlock();
            result = await baseQuery(args, api, extraOptions);
        }
    }

    return result;
};


export const teaApi = createApi({
    reducerPath: "teaApi",

    baseQuery: baseQueryWithReauth,

    tagTypes: [TAG_TEA_PUBLIC, TAG_BREWING_METHOD, TAG_REVIEW, TAG_USER, TAG_TEA_PRIVATE],

    endpoints: (build) => ({
        //Tea
        getAllTeasForList: build.query<ShortTea[], void>({
            query: () => PUBLIC_TEA_URL,
            providesTags: [TAG_TEA_PUBLIC]
        }),

        getAllTeasPrivateForList: build.query<ShortTea[], void>({
            query: () => PRIVATE_TEA_URL,
            providesTags: [TAG_TEA_PRIVATE]
        }),

        getTeaByID: build.query<Tea, number>({
            query: (teaId) => `${PUBLIC_TEA_URL}/${teaId}`,
            providesTags: (_result, _error, teaId) => [
                { type: TAG_TEA_PUBLIC, id: teaId }
            ]
        }),

        getTeaByIDPrivate: build.query<Tea, number>({
            query: (teaId) => `${PRIVATE_TEA_URL}/${teaId}`,
            providesTags: (_result, _error, teaId) => [
                { type: TAG_TEA_PRIVATE, id: teaId }
            ]
        }),

        addTea: build.mutation<Tea, NewTea>({
            query: (tea) => ({
                url: TEA_URL,
                method: "POST",
                body: tea
            }),
            invalidatesTags: [TAG_TEA_PUBLIC, TAG_TEA_PRIVATE]
        }),

        editTea: build.mutation<void, { teaId: number; tea: NewTea }>({
            query: ({ teaId: teaId, tea: tea }) => ({
                url: `${TEA_URL}/${teaId}`,
                method: "PUT",
                body: tea
            }),
            invalidatesTags: (_result, _error, argument) => [
                TAG_TEA_PUBLIC,
                { type: TAG_TEA_PUBLIC, id: argument.teaId },
                TAG_TEA_PRIVATE,
                { type: TAG_TEA_PRIVATE, id: argument.teaId }
            ]
        }),

        deleteTea: build.mutation<void, number>({
            query: (id) => ({
                url: `${TEA_URL}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [TAG_TEA_PUBLIC, TAG_TEA_PRIVATE]
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
    useGetAllTeasPrivateForListQuery,
    useGetTeaByIDQuery,
    useGetTeaByIDPrivateQuery,
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
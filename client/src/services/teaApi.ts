import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BrewingMethod } from "../types/BrewingMethod";
import { Review } from "../types/Review";
import { Tea, ShortTea, TeaListQueryParams } from "../types/Tea";
import { AuthResponse, ChangePasswordRequest, RefreshTokenRequest, UpdateProfileRequest, UpdateProfileResponse, User, UserLoginRequest, UserRegisterRequest } from "../types/User";
import { RootState } from "../store/store";
import { Mutex } from "async-mutex";
import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { clearCredentials, setCredentials } from "../store/authSlice";
import { RequestResponse, ResolveRequestDTO } from "../types/PublishRequestTypes";
import { TeaWare } from "../types/TeaWare";
import { RequestCreationData } from "../types/RequestCreationData";
import { RequestType } from "../types/enums";
import { PaginatedResponse } from "../types/PaginatedResponse";

const BASE_URL = "http://localhost:8080/api";
const PUBLIC_TEA_URL = "Tea/public";
const PRIVATE_TEA_URL = "Tea/private";
const TEA_URL = "Tea";
const BREWING_METHOD_URL = "BrewingMethod";
const REVIEW_URL = "TeaReview";
const AUTH_URL = "auth";
const REQUEST_URL = "Request";
const TEAWARE_URL = "TeaWare";

const TAG_TEA_PUBLIC = "Tea";
const TAG_TEA_PRIVATE = "TeaPrivate";
const TAG_BREWING_METHOD = "BrewingMethod";
const TAG_REVIEW = "TeaReview";
const TAG_USER = "User";
const TAG_REQUEST_PENDING = "RequestPending";
const TAG_REQUEST_USER = "RequestUser";
const TAG_TEAWARE = "TeaWare";
const TAG_REQUEST_PRESENT = "RequestPresent";


export type NewTea = Omit<Tea, "id">
export type NewBrewingMethod = Omit<BrewingMethod, "id">
export type NewReview = Omit<Review, "id">
export type NewTeaWare = Omit<TeaWare, "id">

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
    const isRefreshRequest = requestUrl.endsWith("auth/refresh");

    if (result.error?.status === 401 && !isLoginRequest && !isRefreshRequest) {
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();

            try {
                const refreshToken = await window.authStorage.get();

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

                        await window.authStorage.save(data.refreshToken);

                        api.dispatch(setCredentials({
                            accessToken: data.accessToken,
                            expiresAt: data.expiresAt
                        }));

                        result = await baseQuery(args, api, extraOptions);
                    }
                    else {
                        await window.authStorage.clear();
                        api.dispatch(clearCredentials());
                    }
                }
                else {
                    api.dispatch(clearCredentials());
                }
            } catch (error) {
                api.dispatch(clearCredentials());

                try {
                    await window.authStorage.clear();
                } catch {
                    //ignore
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

    tagTypes: [TAG_TEA_PUBLIC, TAG_BREWING_METHOD, TAG_REVIEW, TAG_USER, TAG_TEA_PRIVATE, TAG_REQUEST_PENDING, TAG_REQUEST_USER, TAG_TEAWARE, TAG_REQUEST_PRESENT],

    endpoints: (build) => ({
        //Tea
        getAllTeasForList: build.query<PaginatedResponse<ShortTea>, TeaListQueryParams>({
            query: ({ page, pageSize, type }) => ({
                url: PUBLIC_TEA_URL,
                params: {
                    page,
                    pageSize,
                    type: type ?? undefined
                }
            }),
            providesTags: [TAG_TEA_PUBLIC]
        }),

        getAllTeasPrivateForList: build.query<PaginatedResponse<ShortTea>, TeaListQueryParams>({
            query: ({ page, pageSize, type }) => ({
                url: PRIVATE_TEA_URL,
                params: {
                    page,
                    pageSize,
                    type: type ?? undefined
                }
            }),
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

        unpublishTea: build.mutation<void, number>({
            query: (id) => ({
                url: `${TEA_URL}/${id}/unpublish`,
                method: "PATCH"
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

        // Requests
        getPendingRequests: build.query<RequestResponse[], void>({
            query: () => `${REQUEST_URL}/pending`,
            providesTags: [TAG_REQUEST_PENDING]
        }),

        getUserRequests: build.query<RequestResponse[], void>({
            query: () => `${REQUEST_URL}/mine`,
            providesTags: [TAG_REQUEST_USER]
        }),

        createRequest: build.mutation<void, RequestCreationData>({
            query: (requestData) => ({
                url: REQUEST_URL,
                method: "POST",
                body: requestData
            }),
            invalidatesTags: [TAG_REQUEST_PENDING, TAG_REQUEST_USER, TAG_REQUEST_PRESENT, TAG_TEA_PRIVATE, TAG_TEA_PUBLIC]
        }),

        resolveRequest: build.mutation<void, { publishRequestId: number, request: ResolveRequestDTO }>({
            query: ({ publishRequestId: id, request: request }) => ({
                url: `${REQUEST_URL}/resolve/${id}`,
                method: "PATCH",
                body: request
            }),
            invalidatesTags: [TAG_REQUEST_PENDING, TAG_REQUEST_USER, TAG_TEA_PUBLIC, TAG_TEA_PRIVATE, TAG_REQUEST_PRESENT]
        }),

        isPendingRequestPresent: build.query<boolean, { type: RequestType, targetId: string }>({
            query: ({ type, targetId }) => ({
                url: `${REQUEST_URL}/pending/is-present-check/${type}/${targetId}`
            }),
            providesTags: [TAG_REQUEST_PRESENT]
        }),

        cancelRequest: build.mutation<void, number>({
            query: (id) => ({
                url: `${REQUEST_URL}/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: [TAG_REQUEST_PENDING, TAG_REQUEST_USER, TAG_REQUEST_PRESENT]
        }),

        //TeaWare
        getTeaWareList: build.query<TeaWare[], void>({
            query: () => TEAWARE_URL,
            providesTags: [TAG_TEAWARE]
        }),

        addTeaWare: build.mutation<void, NewTeaWare>({
            query: (teaWare) => ({
                url: TEAWARE_URL,
                method: "POST",
                body: teaWare
            }),
            invalidatesTags: [TAG_TEAWARE]
        }),

        editTeaWare: build.mutation<void, { id: number, teaWare: NewTeaWare }>({
            query: ({ id: id, teaWare: teaWare }) => ({
                url: `${TEAWARE_URL}/${id}`,
                method: "PUT",
                body: teaWare
            }),
            invalidatesTags: [TAG_TEAWARE]
        }),

        deleteTeaWare: build.mutation<void, number>({
            query: (id) => ({
                url: `${TEAWARE_URL}/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: [TAG_TEAWARE]
        })

    })
});

export const {
    useGetAllTeasForListQuery,
    useGetAllTeasPrivateForListQuery,
    useGetTeaByIDQuery,
    useGetTeaByIDPrivateQuery,
    useAddTeaMutation,
    useEditTeaMutation,
    useDeleteTeaMutation,
    useUnpublishTeaMutation,

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
    useLazyGetCurrentUserQuery,
    useChangeUserPasswordMutation,
    useUpdateUserProfileMutation,
    useRefreshTokenMutation,

    useGetPendingRequestsQuery,
    useGetUserRequestsQuery,
    useCreateRequestMutation,
    useResolveRequestMutation,
    useIsPendingRequestPresentQuery,
    useCancelRequestMutation,

    useGetTeaWareListQuery,
    useAddTeaWareMutation,
    useEditTeaWareMutation,
    useDeleteTeaWareMutation
} = teaApi;
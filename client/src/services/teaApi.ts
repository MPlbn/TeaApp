import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { BrewingMethod } from "../types/BrewingMethod";
import { Review } from "../types/Review";
import { Tea, ShortTea } from "../types/Tea";

const BASE_URL = "http://localhost:8080/api";
const TEA_URL = "Tea";
const BREWING_METHOD_URL = "BrewingMethod";
const REVIEW_URL = "TeaReview";

const TAG_TEA = "Tea"
const TAG_BREWING_METHOD = "BrewingMethod"
const TAG_REVIEW = "TeaReview"


export type NewTea = Omit<Tea, "id">
export type NewBrewingMethod = Omit<BrewingMethod, "id">
export type NewReview = Omit<Review, "id">

export const teaApi = createApi({
    reducerPath: "teaApi",

    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL
    }),

    tagTypes: [TAG_TEA, TAG_BREWING_METHOD, TAG_REVIEW],

    endpoints: (build) => ({
        getAllTeasForList: build.query<ShortTea[], void>({
            query: () => TEA_URL,
            providesTags: [TAG_TEA]
        }),

        //GETs
        getTeaByID: build.query<Tea, number>({
            query: (teaId) => `${TEA_URL}/${teaId}`,
            providesTags: (_result, _error, teaId) => [
                {type: TAG_TEA, id: teaId}
            ]
        }),

        getBrewingMethodsByTeaID: build.query<BrewingMethod[], number>({
            query: (teaId) => `${BREWING_METHOD_URL}/?teaId=${teaId}`,
            providesTags: [TAG_BREWING_METHOD]
        }),
        
        getReviewsByTeaID: build.query<Review[], number>({
            query: (teaId) => `${REVIEW_URL}/?teaId=${teaId}`,
            providesTags: [TAG_REVIEW]
        }),

        //POSTs
        addTea: build.mutation<Tea, NewTea>({
            query: (tea) => ({
                url: TEA_URL,
                method: "POST",
                body: tea
            }),
            invalidatesTags: [TAG_TEA]
        }),

        addBrewingMethod: build.mutation<BrewingMethod, NewBrewingMethod>({
            query: (brewingMethod) => ({
                url: BREWING_METHOD_URL,
                method: "POST",
                body: brewingMethod
            }),
            invalidatesTags: [TAG_BREWING_METHOD]
        }),

        addReview: build.mutation<Review, NewReview>({
            query: (review) => ({
                url: REVIEW_URL,
                method: "POST",
                body: review
            }),
            invalidatesTags: [TAG_REVIEW]
        }),

        //PUTs
        editTea: build.mutation<void, {teaId: number; tea: NewTea}>({
            query: ({teaId: teaId, tea: tea}) => ({
                url: `${TEA_URL}/${teaId}`,
                method: "PUT",
                body: tea
            }),
            invalidatesTags: (_result, _error, argument) => [
                TAG_TEA,
                {type: TAG_TEA, id: argument.teaId}
            ]
        }),

        editBrewingMethod: build.mutation<void, {brewingMethodId: number; brewingMethod: NewBrewingMethod}>({
            query: ({brewingMethodId: id, brewingMethod: brewingMethod}) => ({
                url: `${BREWING_METHOD_URL}/${id}`,
                method: "PUT",
                body: brewingMethod
            }),
            invalidatesTags: (_result, _error, argument) => [
                TAG_BREWING_METHOD,
                {type: TAG_BREWING_METHOD, id: argument.brewingMethodId}
            ]
        }),

        editReview: build.mutation<void, {reviewId: number; review: NewReview}>({
            query: ({reviewId: id, review: review}) => ({
                url: `${REVIEW_URL}/${id}`,
                method: "PUT",
                body: review
            }),
            invalidatesTags: (_result, _error, argument) => [
                TAG_REVIEW,
                {type: TAG_REVIEW, id: argument.reviewId}
            ]
        }),

        //DELETEs
        deleteTea: build.mutation<void, number>({
            query: (id) => ({
                url: `${TEA_URL}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [TAG_TEA]
        }),

        deleteBrewingMethod: build.mutation<void, number>({
            query: (id) => ({
                url: `${BREWING_METHOD_URL}/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: [TAG_BREWING_METHOD]
        }),

        deleteReview: build.mutation<void, number>({
            query: (id) => ({
                url: `${REVIEW_URL}/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: [TAG_REVIEW]
        })
    }),
});

export const {
    useGetAllTeasForListQuery,
    useGetTeaByIDQuery,
    useGetBrewingMethodsByTeaIDQuery,
    useGetReviewsByTeaIDQuery,

    useAddTeaMutation,
    useAddBrewingMethodMutation,
    useAddReviewMutation,

    useEditTeaMutation,
    useEditBrewingMethodMutation,
    useEditReviewMutation,

    useDeleteTeaMutation,
    useDeleteBrewingMethodMutation,
    useDeleteReviewMutation
} = teaApi;
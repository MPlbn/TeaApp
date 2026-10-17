import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const UNKNOWN_ERROR = "Wystąpił nieznany błąd.";

type ApiError = FetchBaseQueryError | {message: string};

export const getApiErrorMessage = (error: unknown): string => {
    if(error == null){
        return UNKNOWN_ERROR
    }

    if(typeof error === "object" && "status" in error){
        const apiError = error as FetchBaseQueryError;
        if("data" in apiError){
            const data = apiError.data
            if(
                typeof data === "object" &&
                data !== null &&
                "message" in data &&
                typeof data.message === "string"
            ){
                return data.message;
            }
            
            if(
                typeof data === "object" &&
                data !== null &&
                "title" in data &&
                typeof data.title === "string"
            ){
                return data.title;
            }

            return `Błąd HTTP: ${apiError.status}`;
        }

        return apiError.error;
    }

    if(error instanceof Error){
        return error.message;
    }

    if(
        typeof error === "object" &&
        "message" in error &&
        typeof error.message === "string"
    ){
        return error.message;
    }

    return UNKNOWN_ERROR;
}

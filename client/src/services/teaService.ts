import { BrewingMethod } from "../types/BrewingMethod";
import { Review } from "../types/Review";
import type { ShortTea, Tea } from "../types/Tea";

const API_URL_TEA = "http://localhost:8080/api/Tea";
const API_URL_BREWING_METHOD = "http://localhost:8080/api/BrewingMethod";
const API_URL_REVIEW = "http://localhost:8080/api/TeaReview";



export type NewTea = Omit<Tea, "id">;
export type NewBrewingMethod = Omit<BrewingMethod, "id">;

export const getAllTeasForList = async (): Promise<ShortTea[]> => {
    const response = await fetch(API_URL_TEA);

    if(!response.ok) {
        throw new Error(`Błąd API: ${response.status}`);
    }

    return await response.json() as ShortTea[];
};

export const getTeaByID = async (teaID: number): Promise<Tea> => {
    const response = await fetch(`${API_URL_TEA}/${teaID}`);

    if(!response.ok){
        throw new Error(`Błąd API: ${response.status}`);
    }

    return await response.json() as Tea;
}

export const getReviewsByTeaID = async (teaID: number): Promise<Review[]> => {
    const response = await fetch(`${API_URL_REVIEW}/?TeaID=${teaID}`);

    if(!response.ok){
        throw new Error(`Błąd API: ${response.status}`)
    }

    return await response.json() as Review[];
}

export const getBrewingMethodsByTeaID = async (teaID: number): Promise<BrewingMethod[]> => {
    const response = await fetch(`${API_URL_BREWING_METHOD}/?TeaID=${teaID}`);

    if(!response.ok){
        throw new Error(`Błąd API: ${response.status}`)
    }

    return await response.json() as BrewingMethod[];
}

export const addTea = async (tea: NewTea): Promise<Tea> => {
    const response = await fetch(API_URL_TEA, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tea)
    });

    if(!response.ok) {
        throw new Error(`Błąd API: ${response.status}`); 
    }

    return await response.json() as Tea;
}

export const addBrewing = async (brewingMethod: NewBrewingMethod): Promise<BrewingMethod> => {
    const response = await fetch(API_URL_BREWING_METHOD, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(brewingMethod)
    });

    if(!response.ok) {
        throw new Error(`Błąd API: ${response.status}`);
    }

    return await response.json() as BrewingMethod;
};

export const addReview = null;

export const editTea = async (teaID: number, tea: NewTea): Promise<void> => {
    const response = await fetch(`${API_URL_TEA}/${teaID}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tea)
    });

    if(!response.ok) {
        throw new Error(`Błąd API: ${response.status}`);
    }
}

export const editBrewingMethod = async (brewingMethodID: number, brewingMethod: NewBrewingMethod): Promise<void> => {
    const response = await fetch(`${API_URL_BREWING_METHOD}/${brewingMethodID}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(brewingMethod)
    });

    if(!response.ok){
        throw new Error(`Błąd API: ${response.status}`);
    }
}

export const deleteTea = async (teaID: number): Promise<void> => {
    const response = await fetch(`${API_URL_TEA}/${teaID}`, {
        method: "DELETE"
    });

    if(!response.ok) {
        throw new Error(`Błąd API: ${response.status}`);
    }
}

export const deleteBrewingMethod = async (brewingMethodID: number): Promise<void> => {
    const response = await fetch(`${API_URL_BREWING_METHOD}/${brewingMethodID}`, {
        method: "DELETE"
    });

    if(!response.ok){
        throw new Error(`Błąd API: ${response.status}`);
    }
}
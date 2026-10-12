import type { Tea } from "../types/Tea";

const API_URL = "http://localhost:8080/api/Tea";

export const getAllTeas = async (): Promise<Tea[]> => {
    const response = await fetch(API_URL);

    if(!response.ok) {
        throw new Error(`Błąd API: ${response.status}`);
    }

    return await response.json() as Tea[];
};

export const getTeaByID = async (teaID: number): Promise<Tea> => {
    const response = await fetch(`${API_URL}/${teaID}`);

    if(!response.ok){
        throw new Error(`Błąd API: ${response.status}`);
    }

    return await response.json() as Tea;
}
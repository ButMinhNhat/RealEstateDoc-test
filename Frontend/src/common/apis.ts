import axios from "axios";

import { AuthReqDto, ItemFormDataDto } from "./entity";

// Axios config
const apiClient = axios.create({
  baseURL: process.env.API_URL || "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// APIs
export const signIn = async (body: AuthReqDto) => {
    try {
        const response = await apiClient.post(`/users/sign-in`, body)
        const { accessToken, ...user } = response.data 

        localStorage.setItem("accessToken", accessToken)
        localStorage.setItem("user", JSON.stringify(user))
        return user
    } catch (error) {
        throw error;
    }
}

export const signUp = async (body: AuthReqDto) => {
    try {
        const response = await apiClient.post(`/users/sign-up`, body)
        const { accessToken, ...user } = response.data 

        localStorage.setItem("accessToken", accessToken)
        localStorage.setItem("user", user)
        return user
    } catch (error) {
        throw error;
    }
}

export const getPaginationItems = async (queryString: string='') => {
    try {
        const response = await apiClient.get(`/items?${queryString}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createItem = async (body: ItemFormDataDto) => {
    try {
        const response = await apiClient.post(`/items`, body);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateItem = async (id: string, body: ItemFormDataDto) => {
    try {
        const response = await apiClient.put(`/items/${id}`, body);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteItems = async (ids: string[]) => {
    try {
        const response = await apiClient.delete(`/items`, { data: ids });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getCategories = async () => {
    try {
        const response = await apiClient.get(`/categories`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const batchUpdateCategories = async (body: any) => {
    try {
        const response = await apiClient.post(`/categories`, { data: body });
        return response.data;
    } catch (error) {
        throw error;
    }
}
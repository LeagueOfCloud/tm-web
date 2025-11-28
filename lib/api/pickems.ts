import axios from "axios";
import { API_URL } from "./common";
import { PickEmResponse } from "@/types/db";

async function updatePickem(id: string, value: string, token: string) {
    return new Promise((resolve, reject) => {
        axios.put(`${API_URL}/pickems`, JSON.stringify({ id, value }), { headers: { Authorization: token } })
            .then(res => {
                const data = res.data;

                resolve(data);
            })
            .catch(err => reject(err.response?.data));
    })
}

async function getPickems(id: number): Promise<PickEmResponse[]> {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/pickems/${id}`)
            .then(res => {
                const data = res.data;

                resolve(data);
            })
            .catch(err => reject(err.response?.data));
    })
}

export default {
    updatePickem,
    getPickems
} as const
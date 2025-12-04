import axios from "axios";
import { API_URL } from "./common";
import { DreamDraftResponse } from "@/types/db";

async function getDreamDraft(id: number): Promise<DreamDraftResponse> {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/dream-draft/${id}`)
            .then(res => {
                const data = res.data;

                resolve(data);
            })
            .catch(err => reject(err.response?.data.message));
    })
}

async function updateDreamDraft(playerIds: number[], token: string): Promise<string> {
    return new Promise((resolve, reject) => (
        axios.put(`${API_URL}/dream-draft`, JSON.stringify({
            "selection_1": playerIds[0],
            "selection_2": playerIds[1],
            "selection_3": playerIds[2],
            "selection_4": playerIds[3],
            "selection_5": playerIds[4]
        }), { headers: { Authorization: token } })
            .then(res => resolve(res.data.message))
            .catch(err => reject(err.data?.message))
    ))
}

export default {
    getDreamDraft,
    updateDreamDraft
} as const
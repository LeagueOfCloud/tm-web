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

export default {
    getDreamDraft
} as const
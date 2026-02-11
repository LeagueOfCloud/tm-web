import axios from "axios";
import { API_URL } from "./common";

export async function getAdminStats(token: string): Promise<{ [key: string]: unknown }> {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/admin/stats`, { headers: { Authorization: token } })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => reject(err.response));
    })
}

export async function runDreamDraftEvaluation(token: string): Promise<Record<string, unknown>> {
    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/dream-draft/evaluate`, {}, { headers: { Authorization: token } })
            .then(res => {
                resolve(res.data)
            })
            .catch(err => reject(err))
    })
}

export default {
    getAdminStats,
    runDreamDraftEvaluation
} as const
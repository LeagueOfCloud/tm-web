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

export default {
    getAdminStats
} as const
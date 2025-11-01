import { ProfileResponse } from "@/types/db";
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL

async function getProfileTotal(token: string): Promise<number> {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/profiles?limit=1`, { headers: { Authorization: token } })
            .then(res => resolve(res.data.total))
            .catch(err => reject(err.response));
    })
}

async function getProfiles(token: string): Promise<ProfileResponse[]> {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/profiles`, { headers: { Authorization: token } })
            .then(res => resolve(res.data.items))
            .catch(err => reject(err.response));
    })
}

async function postTeams(token: string, payload: object) {
    console.log(payload)
    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/teams`, JSON.stringify(payload), { headers: { Authorization: token } })
            .then(res => resolve(res.data))
            .catch(err => reject(err.response.data));
    })
}

const api = {
    getProfiles,
    getProfileTotal,
    postTeams
}

export default api;
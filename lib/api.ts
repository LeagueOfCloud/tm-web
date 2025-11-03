import { ProfileResponse, TeamResponse } from "@/types/db";
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL

type Query = {
    [key: string]: string
}

/*
* RESORUCE GET METHODS
*/

async function getTotal(table: string, token: string): Promise<number> {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/${table}?limit=1`, { headers: { Authorization: token } })
            .then(res => resolve(res.data.total))
            .catch(err => reject(err.response));
    })
}

async function getAll(table: string, token: string, query?: Query): Promise<ProfileResponse[] | TeamResponse[]> {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/${table}${query ? "?" + Object.keys(query).map(key => `${key}=${query[key]}`) : ""}`, { headers: { Authorization: token } })
            .then(res => resolve(res.data.items))
            .catch(err => reject(err.response));
    })
}

async function getSpecific(table: string, id: number, token: string): Promise<ProfileResponse[] | TeamResponse[]> {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/${table}/${id}`, { headers: { Authorization: token } })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => reject(err.response));
    })
}


/*
* TEAMS METHODS
*/

async function postTeams(token: string, payload: object, logoFile: File, bannerFile: File) {
    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/teams`, JSON.stringify(payload), { headers: { Authorization: token } })
            .then(res => {
                const { logo_presigned_data, banner_presigned_data, message } = res.data;

                const logoFormData = new FormData();
                Object.entries(logo_presigned_data.fields).forEach(([k, v]) => logoFormData.append(k, v as string))
                logoFormData.append("file", logoFile)

                const bannerFormData = new FormData();
                Object.entries(banner_presigned_data.fields).forEach(([k, v]) => bannerFormData.append(k, v as string))
                bannerFormData.append("file", bannerFile)

                Promise.all([
                    axios.post(logo_presigned_data.url, logoFormData, { headers: { "Content-Type": "multipart/form-data" } }),
                    axios.post(banner_presigned_data.url, bannerFormData, { headers: { "Content-Type": "multipart/form-data" } })
                ])
                    .then(() => {
                        resolve(message);
                    })
                    .catch((err) => reject(`${err}`));
            })
            .catch(err => reject(err.response?.data));
    })
}

async function deleteTeams(token: string, teamId: number) {
    return new Promise((resolve, reject) => {
        axios.delete(`${API_URL}/teams`, { headers: { Authorization: token }, data: JSON.stringify({ team_id: teamId }) })
            .then(res => resolve(res.data))
            .catch(err => reject(err.response?.data));
    })
}

async function patchTeams(token: string, payload: object, logoFile?: File, bannerFile?: File) {
    return new Promise((resolve, reject) => {
        axios.patch(`${API_URL}/teams`, JSON.stringify(payload), { headers: { Authorization: token } })
            .then(res => {
                const { upload: { logo_presigned_data, banner_presigned_data }, message } = res.data;

                if (logo_presigned_data && logoFile) {
                    const logoFormData = new FormData();
                    Object.entries(logo_presigned_data.fields).forEach(([k, v]) => logoFormData.append(k, v as string))
                    logoFormData.append("file", logoFile)

                    axios.post(logo_presigned_data.url, logoFormData, { headers: { "Content-Type": "multipart/form-data" } })
                }

                if (banner_presigned_data && bannerFile) {
                    const bannerFormData = new FormData();
                    Object.entries(banner_presigned_data.fields).forEach(([k, v]) => bannerFormData.append(k, v as string))
                    bannerFormData.append("file", bannerFile)

                    axios.post(banner_presigned_data.url, bannerFormData, { headers: { "Content-Type": "multipart/form-data" } })
                }

                resolve(message);
            })
            .catch(err => reject(err.response?.data.error));
    })
}

async function deleteTeamsMultiple(token: string, teamIds: number[]) {
    const successes: number[] = [];
    const errors: number[] = [];

    for (const teamId of teamIds) {
        try {
            await deleteTeams(token, teamId)
            successes.push(teamId);
        } catch {
            errors.push(teamId);
        }
    }

    return {
        successes,
        errors
    }
}

const api = {
    getTotal,
    getAll,
    getSpecific,
    postTeams,
    deleteTeams,
    deleteTeamsMultiple,
    patchTeams,
}

export default api;
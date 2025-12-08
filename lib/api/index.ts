import { ProfileResponse, TeamResponse } from "@/types/db";
import axios from "axios"
import { API_URL, Query } from "./common";
import pickems from "./pickems";
import dreamdraft from "./dreamdraft";
import leaderboard from "./leaderboard";

/*
* RESOURCE GET METHODS
*/

async function getTotal(table: string, token: string): Promise<number> {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/${table}?limit=1`, { headers: { Authorization: token } })
            .then(res => resolve(res.data.total))
            .catch(err => reject(err.response));
    })
}

async function getAll(table: string, token: string, query?: Query): Promise<object[]> {
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

async function getConfig(token: string): Promise<{ [key: string]: string }> {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/config`, { headers: { Authorization: token } })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => reject(err.response));
    })
}

async function getSettings(): Promise<{ [key: string]: string }> {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/settings`)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => reject(err.response));
    })
}

async function getPublic<T>(path: string): Promise<T> {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/${path}`)
            .then(res => {
                resolve(res.data.items);
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

/*
* PLAYERS METHODS
*/

async function postPlayers(token: string, payload: object, avatarFile: File) {
    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/players`, JSON.stringify(payload), { headers: { Authorization: token } })
            .then(res => {
                const { avatar_presigned_data, message } = res.data;

                const avatarFormData = new FormData();
                Object.entries(avatar_presigned_data.fields).forEach(([k, v]) => avatarFormData.append(k, v as string))
                avatarFormData.append("file", avatarFile)

                axios.post(avatar_presigned_data.url, avatarFormData, { headers: { "Content-Type": "multipart/form-data" } })
                    .then(() => {
                        resolve(message);
                    })
                    .catch((err) => reject(`${err}`));
            })
            .catch(err => reject(err.response?.data));
    })
}

async function patchPlayers(token: string, payload: object, avatarFile?: File) {
    return new Promise((resolve, reject) => {
        axios.patch(`${API_URL}/players`, JSON.stringify(payload), { headers: { Authorization: token } })
            .then(res => {
                const { upload: { avatar_presigned_data }, message } = res.data;

                if (avatar_presigned_data && avatarFile) {
                    const avatarFormData = new FormData();
                    Object.entries(avatar_presigned_data.fields).forEach(([k, v]) => avatarFormData.append(k, v as string))
                    avatarFormData.append("file", avatarFile)

                    axios.post(avatar_presigned_data.url, avatarFormData, { headers: { "Content-Type": "multipart/form-data" } })
                }

                resolve(message);
            })
            .catch(err => reject(err.response?.data.error));
    })
}

async function deletePlayers(token: string, playerId: number) {
    return new Promise((resolve, reject) => {
        axios.delete(`${API_URL}/players`, { headers: { Authorization: token }, data: JSON.stringify({ player_id: playerId }) })
            .then(res => resolve(res.data))
            .catch(err => reject(err.response?.data));
    })
}


async function deletePlayersMultiple(token: string, playerIds: number[]) {
    const successes: number[] = [];
    const errors: number[] = [];

    for (const playerId of playerIds) {
        try {
            await deletePlayers(token, playerId)
            successes.push(playerId);
        } catch {
            errors.push(playerId);
        }
    }

    return {
        successes,
        errors
    }
}

/*
* RIOT ACCOUNTS METHODS
*/

async function postRiotAccounts(token: string, payload: object) {
    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/riot-accounts`, JSON.stringify(payload), { headers: { Authorization: token } })
            .then(res => {
                const { message } = res.data;

                resolve(message);
            })
            .catch(err => reject(err.response?.data));
    })
}

async function patchRiotAccounts(token: string, payload: object) {
    return new Promise((resolve, reject) => {
        axios.patch(`${API_URL}/riot-accounts`, JSON.stringify(payload), { headers: { Authorization: token } })
            .then(res => {
                const { message } = res.data;

                resolve(message);
            })
            .catch(err => reject(err.response?.data.error));
    })
}

async function deleteRiotAccounts(token: string, riotAccountId: number) {
    return new Promise((resolve, reject) => {
        axios.delete(`${API_URL}/riot-accounts`, { headers: { Authorization: token }, data: JSON.stringify({ account_id: riotAccountId }) })
            .then(res => resolve(res.data))
            .catch(err => reject(err.response?.data));
    })
}


async function deleteRiotAccountsMultiple(token: string, riotAccountIds: number[]) {
    const successes: number[] = [];
    const errors: number[] = [];

    for (const riotAccountId of riotAccountIds) {
        try {
            await deleteRiotAccounts(token, riotAccountId)
            successes.push(riotAccountId);
        } catch {
            errors.push(riotAccountId);
        }
    }

    return {
        successes,
        errors
    }
}

/*
* CONFIG CREATE-UPDATE METHOD
*/
async function updateConfig(token: string, payload: object) {
    return new Promise((resolve, reject) => {
        axios.put(`${API_URL}/config`, JSON.stringify(payload), { headers: { Authorization: token } })
            .then(res => {
                const { message } = res.data;

                resolve(message);
            })
            .catch(err => reject(err.response?.data.error));
    })
}

const api = {
    getTotal,
    getAll,
    getSpecific,
    getConfig,
    getSettings,
    getPublic,
    postTeams,
    deleteTeams,
    deleteTeamsMultiple,
    patchTeams,
    postPlayers,
    patchPlayers,
    deletePlayers,
    deletePlayersMultiple,
    postRiotAccounts,
    patchRiotAccounts,
    deleteRiotAccounts,
    deleteRiotAccountsMultiple,
    updateConfig,
    ...pickems,
    ...dreamdraft,
    ...leaderboard
}

export default api;
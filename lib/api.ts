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
            .then(res => resolve(res.data))
            .catch(err => reject(err.response));
    })
}


/*
* TEAMS METHODS
*/

async function postTeams(token: string, payload: object) {
    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/teams`, JSON.stringify(payload), { headers: { Authorization: token } })
            .then(res => resolve(res.data))
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

async function patchTeams(token: string, payload: object) {
    return new Promise((resolve, reject) => {
        axios.patch(`${API_URL}/teams`, JSON.stringify(payload), { headers: { Authorization: token } })
            .then(res => resolve(res.data.message))
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
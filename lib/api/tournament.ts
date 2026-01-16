import axios from "axios";
import { API_URL } from "./common";

async function createTournamentLobby(id: number, payload: object, token?: string): Promise<string> {
    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/tournament/create-lobby/${id}`, payload, { headers: { Authorization: token } })
            .then(res => {
                const data = res.data;

                resolve(data.message);
            })
            .catch(err => reject(err.response?.data.message));
    })
}

async function postTournamentMatch(payload: object, token?: string): Promise<string> {
    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/tournament-matches`, payload, { headers: { Authorization: token } })
            .then(res => {
                const data = res.data;

                resolve(data.message);
            })
            .catch(err => reject(err.response?.data));
    })
}

async function patchTournamentMatch(payload: object, token?: string): Promise<string> {
    return new Promise((resolve, reject) => {
        axios.patch(`${API_URL}/tournament-matches`, payload, { headers: { Authorization: token } })
            .then(res => {
                const data = res.data

                resolve(data)
            })
            .catch(err => {
                reject(err.response?.data)
            })
    })
}

async function deleteTournamentMatch(matchId: number, token?: string): Promise<string> {
    return new Promise((resolve, reject) => {
        axios.delete(`${API_URL}/tournament-matches`, { headers: { Authorization: token }, data: JSON.stringify({ id: matchId }) })
            .then(res => {
                const data = res.data;

                resolve(data);
            })
            .catch(err => reject(err.response?.data));
    })
}

async function deleteTournamentMatchMultiple(matchIds: number[], token?: string) {
    const successes: number[] = [];
    const errors: number[] = [];

    for (const matchId of matchIds) {
        try {
            await deleteTournamentMatch(matchId, token)
            successes.push(matchId);
        } catch {
            errors.push(matchId);
        }
    }

    return {
        successes,
        errors
    }
}

export default {
    createTournamentLobby,
    postTournamentMatch,
    patchTournamentMatch,
    deleteTournamentMatch,
    deleteTournamentMatchMultiple
} as const

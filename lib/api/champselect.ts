import axios from "axios";
import { API_URL } from "./common";
import { LobbiesResponse, LobbyResponse } from "@/types/ws";

async function postChampSelectLobby(token?: string): Promise<LobbyResponse> {
    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/champ-select-lobby`, {}, { headers: { Authorization: token } })
            .then(res => {
                const data = res.data;

                resolve(data);
            })
            .catch(err => reject(err.response?.data.message));
    })
}

export async function getChampSelectLobbies(token?: string): Promise<LobbiesResponse> {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/champ-select-lobby`, { headers: { Authorization: token } })
            .then(res => {
                const data = res.data;

                resolve(data);
            })
            .catch(err => reject(err.response?.data.message));
    })
}


export default {
    postChampSelectLobby,
    getChampSelectLobbies
} as const
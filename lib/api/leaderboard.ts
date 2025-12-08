import { LeaderboardResponse } from "@/types/db";
import axios from "axios";
import { API_URL } from "./common";

async function getPickemsLeaderboard(page: number = 1): Promise<LeaderboardResponse> {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/leaderboard/pickems?page=${page}`)
            .then(res => {
                const data = res.data;

                resolve(data);
            })
            .catch(err => reject(err.response?.data.message));
    })
}

async function getDreamDraftLeaderboard(page: number = 1): Promise<LeaderboardResponse> {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/leaderboard/pickems?page=${page}`)
            .then(res => {
                const data = res.data;

                resolve(data);
            })
            .catch(err => reject(err.response?.data.message));
    })
}

export default {
    getPickemsLeaderboard,
    getDreamDraftLeaderboard
} as const
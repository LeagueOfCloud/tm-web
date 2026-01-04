export default class LobbyWebsocket {
    private websocket: WebSocket
    private lobbyId: string

    constructor(lobbyId: string, team: string | null) {
        this.lobbyId = lobbyId
        this.websocket = new WebSocket(`${process.env.NEXT_PUBLIC_WSS_CONNECTION_URL}?lobbyid=${lobbyId}${team !== null ? "&teamtype=" + team : ""}`)

        this.websocket.addEventListener("open", () => {
            this.sendMessage({ action: "Sync" })
        })
    }

    public sendMessage(payload: Record<string, unknown>) {
        this.websocket.send(JSON.stringify({
            ...payload,
            LobbyId: this.lobbyId
        }))
    }

    public getSocket() {
        return this.websocket
    }
}
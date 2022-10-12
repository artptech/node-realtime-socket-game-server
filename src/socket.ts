import { Server as SocketServer, Socket as ClientSocket } from 'socket.io'
import { Server as HttpServer } from 'http'

import gameWorldManager from './managers/game-world-manager';

export default class SocketWrapper {
    private socketServer: SocketServer;

    constructor(httpServer: HttpServer) {
        this.socketServer = new SocketServer(httpServer)

        this.socketServer.on('connection', this.handleNewConnection.bind(this))

        setInterval(this.gameLoop.bind(this), 1000 / 10)
    }

    private handleNewConnection(client: ClientSocket) {
        console.log(`User with id ${client.id} connected`)

        // Attach client events
        client.on('disconnect', () => this.handleDisconnection(client))
        client.on('player:move', (args) => this.handlePlayerMovement(client, args))

        const newPlayerPacket = gameWorldManager.getNewPlayerPayload(client.id);
        client.emit('player:connection_accepted', newPlayerPacket)
    }

    private handlePlayerMovement(client: ClientSocket, packet: { x: number, y: number }) {
        gameWorldManager.handlePlayerMovement(client.id, packet.x, packet.y)
    }

    private handleDisconnection(client: ClientSocket) {
        console.log(`User with id ${client.id} disconnected`)

        gameWorldManager.disconnectPlayer(client.id)
    }

    private gameLoop() {
        const playerMap = gameWorldManager.getPlayerMap()
        this.socketServer.emit('game:loop', playerMap)
    }
}
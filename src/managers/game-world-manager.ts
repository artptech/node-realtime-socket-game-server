class GameWorldManager {
    private MAP_BOUNDS = {
        MIN_X: 0,
        MIN_Y: 0,
        MAX_X: 400,
        MAX_Y: 400
    }
    private PLAYER_MOVEMENT_SPEED = 5

    private playerMap: {
        [key: string]: {
            color: string,
            x: number,
            y: number
        }
    } = {}

    private INITIAL_PLAYER_POSITION = { x: 50, y: 35 }
    private colorMap = [
        { color: '#1E8449', used: false, id: '' },
        { color: '#E74C3C', used: false, id: '' },
        { color: '#E74C3C', used: false, id: '' }
    ]

    public getPlayerMap() {
        return this.playerMap
    }

    public getNewPlayerPayload(playerId: string) {
        const colorIndex = this.colorMap.findIndex(color => color.used === false)
        if (colorIndex === -1) {
            throw new Error('Game is full')
        }

        this.colorMap[colorIndex].used = true
        this.colorMap[colorIndex].id = playerId

        this.playerMap[playerId] = {
            color: this.colorMap[colorIndex].color,
            ...this.INITIAL_PLAYER_POSITION
        }

        return {
            color: this.colorMap[colorIndex].color,
            ...this.INITIAL_PLAYER_POSITION
        }
    }

    public handlePlayerMovement(playerId: string, x: number, y: number) {
        const moveX = this.PLAYER_MOVEMENT_SPEED * x
        const moveY = this.PLAYER_MOVEMENT_SPEED * y

        const player = this.playerMap[playerId]
        if (!player) {
            return
        }

        const currentX = player.x
        const currentY = player.y

        // checks collision with world borders
        if (50 + moveX + currentX > this.MAP_BOUNDS.MAX_X || 
            moveX + currentX < this.MAP_BOUNDS.MIN_X ||
            50 + moveY + currentY > this.MAP_BOUNDS.MAX_Y ||
            moveY + currentY < this.MAP_BOUNDS.MIN_Y) {
            return
        }

        this.playerMap[playerId] = {
            ...player,
            x: currentX + moveX,
            y: currentY + moveY
        }

        return this.playerMap
    }

    public disconnectPlayer(playerId: string) {
        const playerColorIndex = this.colorMap.findIndex(color => color.id === playerId)
        if (playerColorIndex === -1) {
            throw new Error('This player is not in the game')
        }

        this.colorMap[playerColorIndex].used = false
        this.colorMap[playerColorIndex].id = ''
        delete this.playerMap[playerId]
    }
}

export default new GameWorldManager()
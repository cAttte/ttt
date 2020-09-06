const boxen = require("boxen")
const chalk = require("chalk")

module.exports = class Game {
    status = null
    cursor = { 0: 4, 1: 4 }
    turn = 0
    symbols = { 0: null, 1: null }
    board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ]

    constructor(playerOneSymbol) {
        this.symbols[0] = playerOneSymbol
        this.symbols[1] = playerOneSymbol === "X" ? "O" : "X"
    }

    displaySymbol(symbol, position) {
        if (!symbol) symbol = " "
        if (this.cursor[0] === position && this.turn === 0) return chalk.bgRed(symbol)
        if (this.cursor[1] === position && this.turn === 1) return chalk.bgBlue(symbol)
        return symbol
    }

    displayBoard() {
        let i = 0
        const board = this.board
            .map(row => row.map(symbol => this.displaySymbol(symbol, i++)).join(" │ "))
            .join("\n──│───│──\n")
        return boxen(board, { padding: 1, borderStyle: "bold" })
    }

    getBoardIndices(pos) {
        return [(pos - (pos % 3)) / 3, pos % 3]
    }

    end(status) {
        this.status = status
        this.cursor = { 0: null, 1: null }
        this.turn = null
    }

    setSymbol(player, position) {
        const [a, b] = this.getBoardIndices(position)
        if (!this.board[a][b]) this.board[a][b] = player
    }

    handleMovement(player, direction) {
        if (this.turn !== player) return

        let [row, column] = this.getBoardIndices(this.cursor[player])
        if (direction === "up") row--
        else if (direction === "down") row++
        else if (direction === "left") column--
        else if (direction === "right") column++

        const absoluteIndex = row * 3 + column
        if (absoluteIndex < 0 || absoluteIndex > 8) return

        this.cursor[player] = absoluteIndex
    }

    handleConfirm() {
        const player = this.turn
        const symbol = this.symbols[player]
        const otherPlayer = player === 0 ? 1 : 0
        const cursor = this.cursor[player]
        const [a, b] = this.getBoardIndices(cursor)
        if (this.board[a][b]) return

        this.board[a][b] = symbol

        const { board } = this
        for (const i in [0, 1, 2])
            if (
                board[i].every(s => s === symbol) ||
                board.map(row => row[i]).every(s => s === symbol)
            )
                return this.end("win")

        if (board.flat().every(s => s !== null)) return this.end("tie")

        this.turn = otherPlayer
    }
}

#!/usr/bin/env node
const log = require("log-update")
const chalk = require("chalk")
const Game = require("./Game")
const game = new Game("X")
process.stdin.setRawMode(true)

log()
updateBoard(game)

process.stdin.on("data", key => {
    const stringKey = key.toString().toUpperCase()
    if (stringKey === "Q") process.exit()

    if (key.length === 3 && key.readInt16BE() === 7003) {
        const directions = { 65: "up", 66: "down", 67: "right", 68: "left" }
        const direction = directions[key.readInt8(2)]
        if (direction) game.handleMovement(0, direction)
    } else if (["W", "A", "S", "D"].includes(stringKey)) {
        const directions = { W: "up", A: "left", S: "down", D: "right" }
        game.handleMovement(1, directions[stringKey])
    } else if (key.toString() === " ") {
        game.handleConfirm()
    }

    updateBoard(game)
    if (game.status) process.exit()
})

function updateBoard(game) {
    const color = player => (game.turn === player ? chalk.reset : chalk.gray)
    const board = game.displayBoard().split("\n")
    const space = "Spacebar to confirm."
    board[1] += color(0)(` ${chalk.red("Player 1:")} Use ↑, ←, ↓, → to select, ` + space)
    board[2] += color(1)(` ${chalk.blue("Player 2:")} Use W, A, S, D to select, ` + space)
    if (game.status === "win") board[4] += chalk.green(` Player ${game.turn + 1} wins!`)
    else if (game.status === "tie") board[4] += chalk.yellow(" It's a tie!")
    else board[4] += chalk.gray(` Press ${chalk.green("Q")} to exit.`)

    log.clear()
    log(board.join("\n"))
}

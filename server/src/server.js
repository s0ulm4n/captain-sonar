import express from "express";
import http from "http";
import { Server } from "socket.io";
import { SocketEvents } from "../../shared/constants.mjs";
import GameState from "./GameState.js";

/* Setup the server and init socket.io */
const port = process.env.APP_PORT || 4000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    origin: "http://localhost:3010",
    methods: ["GET", "POST"],
});

/* Initialize game state */
const gameState = new GameState();

io.on("connection", (socket) => {
    console.log("User connected: ", socket.id);

    socket.on(SocketEvents.tryMoveSub, (dx, dy) => {
        console.log("caught tryMoveSub event!");
        const result = gameState.tryMoveSub(dx, dy);
        if (result.success) {
            console.log("Emitting new game state!");
            io.emit(SocketEvents.updateGameState, gameState);
        } else {
            console.log(result.message);
        }
    });

    socket.on(SocketEvents.submerge, () => {
        const result = gameState.submerge();
        if (result) {
            console.log("Emitting new game state!");
            io.emit(SocketEvents.updateGameState, gameState);
        }
    });

    socket.on(SocketEvents.surface, () => {
        const result = gameState.surface();
        if (result) {
            console.log("Emitting new game state!");
            io.emit(SocketEvents.updateGameState, gameState);
        }
    });

    io.emit(SocketEvents.updateGameState, gameState);

    socket.on("disconnect", () => {
        console.log("User disconnected");
    })
});

server.listen(port, () => {
    console.log("Server listening on port", port);
});

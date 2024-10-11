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

const players = {};
const teamSizes = [0, 0];

/* Initialize game state */
const gameState = new GameState();

io.on("connection", (socket) => {
    console.log("User connected: ", socket.id);

    // Put the player into one of the teams 
    // based on which one has more active players
    const team = teamSizes[0] > teamSizes[1] ? 1 : 0;
    teamSizes[team]++;

    const newPlayer = {
        id: socket.id,
        teamId: team,
    };
    players[socket.id] = newPlayer;
    console.log("Players:");
    console.log(players);

    // Emit the "updateTeamId" and "updateGameState" events 
    // only to the player who just joined
    io.to(socket.id).emit(SocketEvents.updateTeamId, newPlayer.teamId);
    io.to(socket.id).emit(SocketEvents.updateGameState, gameState);

    socket.on(SocketEvents.tryMoveSub, (teamId, dx, dy) => {
        console.log("Received trySubMove event from team " + teamId);
        const result = gameState.tryMoveSub(teamId, dx, dy);
        if (result.success) {
            io.emit(SocketEvents.updateGameState, gameState);
        } else {
            console.log(result.message);
        }
    });

    socket.on(SocketEvents.submerge, (teamId) => {
        console.log("Received submerge event from team " + teamId);
        const result = gameState.submerge(teamId);
        if (result) {
            io.emit(SocketEvents.updateGameState, gameState);
        }
    });

    socket.on(SocketEvents.surface, (teamId) => {
        console.log("Received surface event from team " + teamId);
        const result = gameState.surface(teamId);
        if (result) {
            io.emit(SocketEvents.updateGameState, gameState);
        }
    });

    socket.on("disconnect", () => {
        const player = players[socket.id];
        if (player) {
            const teamId = player.teamId;
            teamSizes[teamId]--;
        }
        delete players[socket.id];
        console.log("User disconnected: ", socket.id);
        console.log("Players:");
        console.log(players);
    });
});

server.listen(port, () => {
    console.log("Server listening on port", port);
});

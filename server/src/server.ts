import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Ability, Direction, PlayerRole, SocketEvents } from "../../shared/enums.mjs";
import GameState from "./game/GameState.js";
import { IPlayerState } from "../../shared/interfaces.mjs";

/* Setup the server and init socket.io */
const port = process.env.APP_PORT || 4000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3010",
        methods: ["GET", "POST"],
    }
});

const players: { [id: string]: IPlayerState; } = {};
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
        // For now just assign the DEV_MODE role to everyone!
        role: PlayerRole.DEV_MODE,
    };
    players[socket.id] = newPlayer;
    console.log("Players:");
    console.log(players);

    // Emit the "updatePlayerState" and "updateGameState" events 
    // only to the player who just joined
    io.to(socket.id).emit(SocketEvents.updatePlayerState, newPlayer);
    io.to(socket.id).emit(SocketEvents.updateGameState, gameState);

    socket.on(SocketEvents.tryMoveSub, (teamId: number, dir: Direction) => {
        console.log("Received trySubMove event from team " + teamId);
        const team = gameState.teams[teamId];

        if (team) {
            const result = team.tryMoveSub(gameState.grid, dir);
            if (result.success) {
                io.emit(SocketEvents.updateGameState, gameState);
            } else {
                console.log(result.message);
            }
        }
    });

    socket.on(SocketEvents.submerge, (teamId: number) => {
        console.log("Received submerge event from team " + teamId);
        const team = gameState.teams[teamId];

        if (team) {
            const result = team.submerge();
            if (result) {
                io.emit(SocketEvents.updateGameState, gameState);
            }
        }
    });

    socket.on(SocketEvents.surface, (teamId: number) => {
        console.log("Received surface event from team " + teamId);
        const team = gameState.teams[teamId];

        if (team) {
            const result = team.surface();
            if (result) {
                io.emit(SocketEvents.updateGameState, gameState);
            }
        }
    });

    socket.on(SocketEvents.breakSystemNode, (
        teamId: number,
        dir: Direction,
        systemNodeId: number
    ) => {
        console.log("Received break system node event from team " + teamId);
        const team = gameState.teams[teamId];

        if (team) {
            const result = team.breakSystemNode(dir, systemNodeId);
            if (result.success) {
                if (
                    team.pendingMove &&
                    team.pendingMove.engineerAck && team.pendingMove.firstMateAck
                ) {
                    team.moveSub();
                }
                io.emit(SocketEvents.updateGameState, gameState);
            } else {
                console.log(result.message);
            }
        }
    });

    socket.on(SocketEvents.chargeAbility, (teamId: number, ability: Ability) => {
        console.log("Received charge ability (" + ability + ") event from team " + teamId);
        const team = gameState.teams[teamId];

        if (team) {
            team.chargeAbility(ability);
            if (
                team.pendingMove &&
                team.pendingMove.engineerAck && team.pendingMove.firstMateAck
            ) {
                team.moveSub();
            }
            io.emit(SocketEvents.updateGameState, gameState);
        }
    });

    socket.on(SocketEvents.activateAbility, (teamId: number, ability: Ability) => {
        console.log("Received activate ability (" + ability + ") event from team " + teamId);
        const team = gameState.teams[teamId];

        if (team) {
            team.activateAbility(ability);
            io.emit(SocketEvents.updateGameState, gameState);
        }
    });

    socket.on("disconnect", () => {
        const player = players[socket.id];
        if (player) {
            teamSizes[player.teamId]--;
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

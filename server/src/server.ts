import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Ability, Direction, PlayerRole, SocketEvents } from "../../shared/enums.mjs";
import GameState from "./game/GameState.js";
import { IPlayerState } from "../../shared/interfaces.mjs";
import RadioMessages from "./game/RadioMessages.js";
import { ChatMessage, Point } from "../../shared/types.mjs";
import { GLOBAL_CHAT_MESSAGES_LIMIT } from "../../shared/constants.mjs";

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
const teamCompositions: {
    [teamId: number]: {
        [role: string]: {
            socketId: string,
        };
    };
} = {
    0: {},
    1: {},
};
const teamSizes = [0, 0];

/* Initialize game state */
const gameState = new GameState();
const radioMessages: { [teamId: number]: RadioMessages; } = {
    0: new RadioMessages(),
    1: new RadioMessages(),
};
const globalChat: ChatMessage[] = [];

io.on("connection", (socket) => {
    console.log("User connected: ", socket.id);

    // Put the player into one of the teams 
    // based on which one has more active players
    const teamId = teamSizes[0] > teamSizes[1] ? 1 : 0;
    teamSizes[teamId]++;

    const newPlayer = {
        id: socket.id,
        teamId: teamId,
        // For now just assign the DEV_MODE role to everyone!
        role: PlayerRole.DEV_MODE,
    };
    // Add the player's socket ID to the list of currently connected players.
    players[socket.id] = newPlayer;
    console.log("Players:");
    console.log(players);

    // Map the player's socket ID to the role he has on the team.
    teamCompositions[teamId][newPlayer.role] = { socketId: socket.id };

    // Emit some update events only to the player who just joined
    io.to(socket.id).emit(SocketEvents.updatePlayerState, newPlayer);
    io.to(socket.id).emit(SocketEvents.updateGameState, gameState);
    io.to(socket.id).emit(SocketEvents.updateGlobalChat, globalChat);

    socket.on(SocketEvents.tryMoveSub, (teamId: number, dir: Direction) => {
        console.log("Received trySubMove event from team " + teamId);
        const team = gameState.teams[teamId];

        if (team) {
            const result = team.tryMoveSub(
                gameState.grid,
                dir,
                () => {
                    console.log("Radio callback executed");
                    radioMessages[1 - teamId].addMovementMessage(dir);
                    // Send the radio message to the OPPOSITE team
                    _sendUpdatedRadioMessagesToEnemyTeam(teamId);
                }
            );
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
                radioMessages[1 - teamId].addSubmergedMessage();
                io.emit(SocketEvents.updateGameState, gameState);
                // Send the radio message to the OPPOSITE team
                _sendUpdatedRadioMessagesToEnemyTeam(teamId);
            }
        }
    });

    socket.on(SocketEvents.surface, (teamId: number) => {
        console.log("Received surface event from team " + teamId);
        const team = gameState.teams[teamId];

        if (team) {
            const result = team.surface();
            if (result) {
                radioMessages[1 - teamId].addSurfacedMessage();
                io.emit(SocketEvents.updateGameState, gameState);
                // Send the radio message to the OPPOSITE team
                _sendUpdatedRadioMessagesToEnemyTeam(teamId);
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

    socket.on(SocketEvents.deployMine, (teamId: number) => {
        console.log("Received deploy mine event from team " + teamId);
        const team = gameState.teams[teamId];

        if (team && team.isAbilityReady(Ability.Mines)) {
            const result = team.deployMine();
            if (result.success) {
                team.resetAbility(Ability.Mines);
                io.emit(SocketEvents.updateGameState, gameState);
            }
        }
    });

    socket.on(SocketEvents.launchTorpedo, (teamId: number, target: Point) => {
        console.log("Received launch torpedo event from team " + teamId);
        const team = gameState.teams[teamId];

        if (team && team.isAbilityReady(Ability.Torpedo)) {
            const otherTeam = gameState.teams[1 - teamId];

            // Both submarines can be damaged by a torpedo!
            team.handleExplosion(target);
            otherTeam.handleExplosion(target);

            team.resetAbility(Ability.Torpedo);
            io.emit(SocketEvents.updateGameState, gameState);
        }
    });

    // TODO: this is placeholder and needs to be removed
    socket.on(
        SocketEvents.activateAbility,
        (teamId: number, ability: Ability, target: Point | number | null) => {
            console.log("Received activate ability (" + ability + ") event from team " + teamId);
            // const team = gameState.teams[teamId];

            // if (team) {
            //     const result = team.activateAbility(ability, target);
            //     if (result.success) {
            //         io.emit(SocketEvents.updateGameState, gameState);
            //     }
            // }
        });

    socket.on(SocketEvents.sendMessageToChat, (from: string, message: string, timestamp: number) => {
        console.log("New chat message");
        console.log("From:", from, "; Message:", message);

        globalChat.push({
            from: from,
            message: message,
            timestamp: timestamp,
        });

        if (globalChat.length > GLOBAL_CHAT_MESSAGES_LIMIT) {
            globalChat.shift();
        }

        io.emit(SocketEvents.updateGlobalChat, globalChat);
    });

    socket.on(SocketEvents.launchTorpedo, (launchCoordinates: Point) => {
        console.log("Torpedo launch triggered! Target:", launchCoordinates);
    });

    socket.on("disconnect", () => {
        const player = players[socket.id];
        if (player) {
            teamSizes[player.teamId]--;
        }
        delete players[socket.id];
        delete teamCompositions[player.teamId][player.role];

        console.log("User disconnected: ", socket.id);
        console.log("Players:");
        console.log(players);
    });
});

server.listen(port, () => {
    console.log("Server listening on port", port);
});

// TODO: "backup role" logic for radio operator.
function _sendUpdatedRadioMessagesToEnemyTeam(currentTeamId: number) {
    console.log("_sendUpdatedRadioMessagesToEnemyTeam");
    const enemyTeamId = 1 - currentTeamId;

    const enemyTeamRoles = Object.keys(teamCompositions[enemyTeamId]);
    console.log("enemyTeamRoles: ", enemyTeamRoles);

    let receivingPlayer: { socketId: string; } | null = null;
    if (enemyTeamRoles.includes(PlayerRole.RadioOperator)) {
        // If the team has a radio operator, send the messages to them.
        receivingPlayer = teamCompositions[enemyTeamId][PlayerRole.RadioOperator];
    } else if (enemyTeamRoles.includes(PlayerRole.DEV_MODE)) {
        // If not, check for the DEV_MODE role
        receivingPlayer = teamCompositions[enemyTeamId][PlayerRole.DEV_MODE];
    }

    if (receivingPlayer) {
        io.to(receivingPlayer.socketId).emit(
            SocketEvents.updateRadioMessages,
            radioMessages[enemyTeamId].messages
        );
    }
}

import { useState, useEffect } from "react";
import './App.css';
import { IGameState, IPlayerState } from "../../shared/interfaces.mts";
import Grid from "./components/movement/Grid";
import MovementControls from "./components/movement/MovementControls";
import { Ability, Direction, PlayerRole, SocketEvents } from "../../shared/enums.mts";
import SurfacingControls from "./components/movement/SurfacingControls";
import { socket } from "./main";
import EngineerBoard from "./components/engineer/EngineerBoard";
import SubAbilitiesBoard from "./components/abilities/SubAbilitiesBoard";
import RadioMessages from "./components/RadioMessages";
import { ChatMessage } from "../../shared/types";
import GlobalChat from "./components/GlobalChat";

const App = () => {
  const [gameState, setGameState] = useState<IGameState>({
    grid: [],
    teams: [],
  });
  const [playerState, setPlayerState] = useState<IPlayerState>({
    id: "",
    teamId: -1,
    role: PlayerRole.NONE,
  })
  const [radioMessages, setRadioMessages] = useState<string[]>([]);
  const [globalChatMessages, setGlobalChatMessages] = useState<ChatMessage[]>([
    {
      from: "test",
      message: "test message",
    },
    {
      from: "test 2",
      message: "la la la la la",
    }
  ]);

  // This will run once after the main component mounts.
  // In dev mode, the main component is mounted, unmounted, then mounted again.
  // So this will effectively run twice, but since we disconnect on unmount,
  // only one connection will be maintained.
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    // This will run once the main component is unmounted, ensuring that we
    // close the connection.
    return () => {
      console.log("Disconnecting from server");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const onUpdatePlayerState = (newPlayerState: IPlayerState) => {
      console.log("Client received player state:");
      console.log(newPlayerState);
      setPlayerState(newPlayerState);
    }
    const onUpdateGameState = (newGameState: IGameState) => {
      console.log("Client received game state:");
      console.log(newGameState);
      setGameState(newGameState);
    };
    const onUpdateRadioMessages = (messages: string[]) => {
      console.log("Client received updated radio messages");
      console.log(messages);
      setRadioMessages(messages);
    }
    const onUpdateGlobalChat = (chatMessages: ChatMessage[]) => {
      console.log("Client received updated global chat");
      setGlobalChatMessages(chatMessages);
    }

    socket.on(SocketEvents.updatePlayerState, onUpdatePlayerState);
    socket.on(SocketEvents.updateGameState, onUpdateGameState);
    socket.on(SocketEvents.updateRadioMessages, onUpdateRadioMessages);
    socket.on(SocketEvents.updateGlobalChat, onUpdateGlobalChat);

    return () => {
      socket.off(SocketEvents.updatePlayerState, onUpdatePlayerState);
      socket.off(SocketEvents.updateGameState, onUpdateGameState);
      socket.off(SocketEvents.updateRadioMessages, onUpdateRadioMessages);
      socket.off(SocketEvents.updateGlobalChat, onUpdateGlobalChat);
    };
  }, []);

  return (
    <>
      <div className="main-div">
        <div 
          className="ability-board" 
          hidden={playerState.role !== PlayerRole.FirstMate && playerState.role !== PlayerRole.DEV_MODE}
        >
          <div>
            {
              gameState.teams[playerState.teamId] && 
              gameState.teams[playerState.teamId].pendingMove !== null 
              ? "Active" : "Inactive"
            }
          </div>
          {
            gameState.teams[playerState.teamId] ?
              <SubAbilitiesBoard 
                abilities={gameState.teams[playerState.teamId].abilities}
                systemBreakages={gameState.teams[playerState.teamId].systemBreakages}
                onChargeClick={
                  (ability: Ability) => 
                    socket.emit(SocketEvents.chargeAbility, playerState.teamId, ability)
                }
                onActivateClick={
                  (ability: Ability) => 
                    socket.emit(SocketEvents.activateAbility, playerState.teamId, ability)
                }
              />
              :
              null
          }
        </div>
        <div 
          className="eng-board"
          hidden={playerState.role !== PlayerRole.Engineer && playerState.role !== PlayerRole.DEV_MODE}
        >
          <div>
            {
              gameState.teams[playerState.teamId] && 
              gameState.teams[playerState.teamId].pendingMove !== null 
              ? "Active" : "Inactive"
            }
          </div>
          {
            gameState.teams[playerState.teamId] ?
              <EngineerBoard
                nodeGroups={gameState.teams[playerState.teamId].engSystemNodeGroups}
                onClick={
                  (dir: Direction, id: number) =>
                    socket.emit(SocketEvents.breakSystemNode, playerState.teamId, dir, id)
                }
              />
              :
              null
          }
        </div>
        <div 
          className="move-grid"
          hidden={playerState.role !== PlayerRole.Captain && playerState.role !== PlayerRole.DEV_MODE}
        >
          <div>
            {
              gameState.teams[playerState.teamId] && 
              gameState.teams[playerState.teamId].pendingMove === null 
              ? "Active" : "Inactive"
            }
          </div>
          <div>You&apos;re on team {playerState.teamId + 1}</div>
          {
            gameState.teams[playerState.teamId] ?
              <Grid
                grid={gameState.grid}
                subPosition={gameState.teams[playerState.teamId].subPosition}
                subRoute={gameState.teams[playerState.teamId].subRoute}
              />
              :
              null
          }
          <MovementControls onClick={(dir: Direction) => {
            socket.emit(SocketEvents.tryMoveSub, playerState.teamId, dir);
          }} />
          <SurfacingControls
            isSurfaced={
              gameState.teams[playerState.teamId] 
              ? gameState.teams[playerState.teamId].isSurfaced 
              : false
            }
            onSurfaceClick={() => socket.emit(SocketEvents.surface, playerState.teamId)}
            onSubmergeClick={() => socket.emit(SocketEvents.submerge, playerState.teamId)}
          />
        </div>
        <div className="radio">
          <RadioMessages messages={radioMessages} />
        </div>
      </div>
      <div>
        <GlobalChat 
          messages={globalChatMessages} 
          sendMessageHandler={(message: string) => 
            socket.emit(SocketEvents.sendMessageToChat, playerState.id, message)
          }
        />
      </div>
    </>
  );
};

export default App;

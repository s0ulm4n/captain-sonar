import { useState, useEffect } from "react";
import "./App.css";
import { IGameState, IPlayerState } from "../../shared/interfaces.mts";
import MovementControls from "./components/movement/MovementControls";
import { Ability, Direction, PlayerRole, SocketEvents } from "../../shared/enums.mts";
import SurfacingControls from "./components/movement/SurfacingControls";
import { socket } from "./main";
import EngineerBoard from "./components/engineer/EngineerBoard";
import SubAbilitiesBoard from "./components/abilities/SubAbilitiesBoard";
import RadioMessages from "./components/RadioMessages";
import { ChatMessage, Point } from "../../shared/types.mts";
import GlobalChat from "./components/chat/GlobalChat";
import TorpedoLaunchDialog from "./components/modals/TorpedoLaunchDialog";
import RoleSwitcher from "./components/RoleSwitcher";
import GridV2 from "./components/grid/GridV2";

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
  // This is different from playerState.role
  const [devModeSelectedRole, setDevModeSelectedRole] = 
    useState<PlayerRole>(PlayerRole.NONE);
  const [radioMessages, setRadioMessages] = useState<string[]>([]);
  const [globalChatMessages, setGlobalChatMessages] = useState<ChatMessage[]>([]);

  // Ability-related modal dialogs
  const [isTorpedoLaunchDialogOpen, setIsTorpedoLaunchDialogOpen] = useState<boolean>(false);

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
      if (newPlayerState.role === PlayerRole.DEV_MODE) {
        setDevModeSelectedRole(PlayerRole.Captain);
      }
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

  const isAbilityReady = (ability: Ability): boolean => {
    const abilityData = gameState.teams[playerState.teamId].abilities[ability];
    return abilityData.readiness === abilityData.readinessThreshold;
  }

  const onActivateAbilityClick = (ability: Ability) => {
    console.log("poof");
    if (isAbilityReady(ability)) {
      console.log("ready");
      switch(ability) {
        case Ability.Mines:
          // When activating the mine ability, we just need to send a signal
          // to the server. The server will handle checking if we are able to
          // place the mine and actually doing so.
          socket.emit(SocketEvents.deployMine, playerState.teamId);
          break;
        case Ability.Torpedo:
          // When activating the torpedo ability, we need to open the torpedo
          // modal dialog. The dialog will then handle sending the message to the
          // server.
          setIsTorpedoLaunchDialogOpen(true);
          break;
        default:
          socket.emit(SocketEvents.activateAbility, playerState.teamId, ability);
      }
    }
  }

  return (
    <>
      <div>
        <RoleSwitcher selectedRole={devModeSelectedRole} setRole={setDevModeSelectedRole} />
      </div>
      <div className="main-div">
        <div 
          className="ability-board" 
          hidden={
            playerState.role !== PlayerRole.FirstMate && 
            !(playerState.role === PlayerRole.DEV_MODE && devModeSelectedRole === PlayerRole.FirstMate)
          }
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
                onActivateClick={onActivateAbilityClick}
              />
              :
              null
          }
        </div>
        <div 
          className="eng-board"
          hidden={
            playerState.role !== PlayerRole.Engineer && 
            !(playerState.role === PlayerRole.DEV_MODE && devModeSelectedRole === PlayerRole.Engineer)
          }
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
          hidden={
            playerState.role !== PlayerRole.Captain && 
            !(playerState.role === PlayerRole.DEV_MODE && devModeSelectedRole === PlayerRole.Captain)
          }
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
              // <Grid
              //   grid={gameState.grid}
              //   subPosition={gameState.teams[playerState.teamId].subPosition}
              //   subRoute={gameState.teams[playerState.teamId].subRoute}
              //   mines={gameState.teams[playerState.teamId].mines}
              // />
              <GridV2
                  grid={gameState.grid}
                subPosition={gameState.teams[playerState.teamId].subPosition}
                subRoute={gameState.teams[playerState.teamId].subRoute}
                mines={gameState.teams[playerState.teamId].mines}
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
        <div>
          <GlobalChat 
            messages={globalChatMessages} 
            sendMessageHandler={(message: string) => 
              socket.emit(SocketEvents.sendMessageToChat, playerState.role, message, Date.now())
            }
          />
        </div>
        <div 
          className="radio"
          hidden={
            playerState.role !== PlayerRole.RadioOperator && 
            !(playerState.role === PlayerRole.DEV_MODE && devModeSelectedRole === PlayerRole.RadioOperator)
          }
        >
          <RadioMessages messages={radioMessages} />
        </div>
      </div>

      <TorpedoLaunchDialog 
        isOpen={isTorpedoLaunchDialogOpen}
        onSubmit={(launchCoordinates: Point) => {
          socket.emit(SocketEvents.launchTorpedo, playerState.teamId, launchCoordinates);
          setIsTorpedoLaunchDialogOpen(false);
        }}
        onClose={() => setIsTorpedoLaunchDialogOpen(false)}
      />
    </>
  );
};

export default App;

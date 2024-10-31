import { useState, useEffect } from "react";
import './App.css';
import { IGameState } from "../../shared/interfaces.mts";
import Grid from "./components/Grid";
import MovementControls from "./components/MovementControls";
import { Direction, SocketEvents } from "../../shared/enums.mts";
import SurfacingControls from "./components/SurfacingControls";
import { socket } from "./main";
import EngineerBoard from "./components/EngineerBoard";

const App = () => {
  const [gameState, setGameState] = useState<IGameState>({
    grid: [],
    teams: [],
  });
  const [teamId, setTeamId] = useState<number>(-1);

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
    const onUpdateTeamId = (teamId: 0 | 1) => {
      console.log("Client received teamId: " + teamId);
      setTeamId(teamId);
    };
    const onUpdateGameState = (gameState: IGameState) => {
      console.log("Client received game state:");
      console.log(gameState);
      setGameState(gameState);
    };

    socket.on(SocketEvents.updateTeamId, onUpdateTeamId);
    socket.on(SocketEvents.updateGameState, onUpdateGameState);

    return () => {
      socket.off(SocketEvents.updateTeamId, onUpdateTeamId);
      socket.off(SocketEvents.updateGameState, onUpdateGameState);
    };
    // }, [teamId, gameState]);
  }, []);

  return (
    <div className="main-div">
      <div className="eng-board">
        {
          gameState.teams[teamId] ?
            <EngineerBoard
              nodeGroups={gameState.teams[teamId].engSystemNodeGroups}
              onClick={
                (dir: Direction, id: number) =>
                  socket.emit(SocketEvents.breakSystemNode, teamId, dir, id)
              }
            />
            :
            null
        }
      </div>
      <div className="move-grid">
        <div>You&apos;re on team {teamId + 1}</div>
        {
          gameState.teams[teamId] ?
            <Grid
              grid={gameState.grid}
              subPosition={gameState.teams[teamId].subPosition}
              subRoute={gameState.teams[teamId].subRoute}
            />
            :
            null
        }
        <MovementControls onClick={(dir: Direction) => {
          socket.emit(SocketEvents.tryMoveSub, teamId, dir);
        }} />
        <SurfacingControls
          isSurfaced={gameState.teams[teamId] ? gameState.teams[teamId].isSurfaced : false}
          onSurfaceClick={() => socket.emit(SocketEvents.surface, teamId)}
          onSubmergeClick={() => socket.emit(SocketEvents.submerge, teamId)}
        />
      </div>
    </div>
  );
};

export default App;

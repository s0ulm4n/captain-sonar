import { useState, useEffect } from "react";
import './App.css'
import Grid from "./components/Grid";
import MovementControls from "./components/MovementControls";
import { SocketEvents } from "../../shared/constants.mjs";
import SurfacingControls from "./components/SurfacingControls";
import { socket } from "./socket.js";

const App = () => {
  const [gameState, setGameState] = useState({
    grid: null,
    teams: [],
  });
  const [teamId, setTeamId] = useState(-1);

  // This will run once after the main component mounts.
  // In dev mode, the main component is mounted, unmounted, then mounted again.
  // So this will effectively run twice, but since we disconnect on unmount,
  // only one connection will be maintained.
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to server");
    })

    // This will run once the main component is unmounted, ensuring that we
    // close the connection.
    return () => {
      console.log("Disconnecting from server");
      socket.disconnect();
    }
  }, []);

  useEffect(() => {
    const onUpdateTeamId = (teamId) => {
      console.log("Client received teamId: " + teamId);
      setTeamId(teamId);
    }
    const onUpdateGameState = (gameState) => {
      console.log("Client received game state:");
      console.log(gameState);
      setGameState(gameState);
    }

    socket.on(SocketEvents.updateTeamId, onUpdateTeamId);
    socket.on(SocketEvents.updateGameState, onUpdateGameState);

    return () => {
      socket.off(SocketEvents.updateTeamId, onUpdateTeamId);
      socket.off(SocketEvents.updateGameState, onUpdateGameState);
    };
  }, [teamId, gameState]);

  return (
    <>
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
      <MovementControls onClick={(dx, dy) => {
        socket.emit(SocketEvents.tryMoveSub, teamId, dx, dy)
      }} />
      <SurfacingControls
        isSurfaced={gameState.teams[teamId] ? gameState.teams[teamId].isSurfaced : false}
        onSurfaceClick={() => socket.emit(SocketEvents.surface, teamId)}
        onSubmergeClick={() => socket.emit(SocketEvents.submerge, teamId)}
      />
    </>
  );
}

export default App;

import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import './App.css'
import Grid from "./components/Grid";
import MovementControls from "./components/MovementControls";
import { SocketEvents } from "../../shared/constants.mjs";
import SurfacingControls from "./components/SurfacingControls";

let socket = null;

const App = () => {
  const [gameState, setGameState] = useState({
    grid: null,
    isSurfaced: false,
    subPosition: null
  });

  useEffect(() => {
    // If I leave this inside the App component, it will connect a new user
    // on EVERY RENDER. We don't want that.
    socket = io("http://localhost:4000", { transports: ['websocket'] });
  }, []);

  useEffect(() => {
    const onUpdateGameState = (newState) => {
      setGameState(newState);
    }

    socket.on(SocketEvents.updateGameState, onUpdateGameState);

    return () => {
      socket.off(SocketEvents.updateGameState, onUpdateGameState);
    };
  }, [gameState]);

  return (
    <>
      <Grid grid={gameState.grid} subPosition={gameState.subPosition} />
      <MovementControls onClick={(dx, dy) => {
        socket.emit(SocketEvents.tryMoveSub, dx, dy)
      }} />
      <SurfacingControls
        isSurfaced={gameState.isSurfaced}
        onSurfaceClick={() => socket.emit(SocketEvents.surface)}
        onSubmergeClick={() => socket.emit(SocketEvents.submerge)}
      />
    </>
  );
}

export default App;

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { io } from "socket.io-client";
import App from './App.js';

export const socket = io(
  "http://localhost:4000",
  {
    autoConnect: false,
    transports: ['websocket'],
  });

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

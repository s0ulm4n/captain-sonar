import { SocketEvents } from "../../shared/enums.mts";
import { socket } from "./main";

class DebugUtils {
    static resolveMove(teamId: number): void {
        console.log("DEBUG: resolving pending move");
        socket.emit(SocketEvents.DEBUG_moveSub, teamId);
    }
}

export default DebugUtils;

import { RADIO_MESSAGES_LIMIT } from "../../../shared/constants.mjs";
import { Direction } from "../../../shared/enums.mjs";

class RadioMessages {
    messages: string[];

    constructor() {
        this.messages = [];
    }

    addMovementMessage(dir: Direction) {
        this._addMessage(`Enemy moved ${dir}`);
    }

    addSurfacedMessage() {
        this._addMessage(`Enemy surfaced!`);
    }

    addSubmergedMessage() {
        this._addMessage(`Enemy submerged`);
    }

    private _addMessage(newMessage: string) {
        this.messages.push(newMessage);
        if (this.messages.length > RADIO_MESSAGES_LIMIT) {
            this.messages.shift();
        }
    }
}

export default RadioMessages;

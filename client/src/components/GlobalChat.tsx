import { FormEvent, useRef } from "react";
import { ChatMessage } from "../../../shared/types";

type Props = {
    messages: ChatMessage[],
    sendMessageHandler: (message: string) => void,
};

const GlobalChat = ({ messages, sendMessageHandler }: Props) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (inputRef && inputRef.current && inputRef.current.value.trim().length > 0) {
            sendMessageHandler(inputRef.current.value);
            inputRef.current.value = "";
        }
    }

    const messageElements = messages.map((message) => <div>
        <strong>{message.from}: </strong>
        <span>{message.message}</span>
    </div>);

    return (
        <div className="global-chat">
            <div className="global-chat-messages">
                {messageElements}
            </div>
            <form onSubmit={handleSubmit}>
                <input ref={inputRef} type="text" />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default GlobalChat;

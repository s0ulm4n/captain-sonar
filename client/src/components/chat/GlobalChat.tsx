import "./GlobalChat.css";
import { useRef } from "react";
import { ChatMessage } from "../../../../shared/types.mts";

type Props = {
    messages: ChatMessage[],
    sendMessageHandler: (message: string) => void,
};

const GlobalChat = ({ messages, sendMessageHandler }: Props) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (inputRef && inputRef.current && inputRef.current.value.trim().length > 0) {
            sendMessageHandler(inputRef.current.value);
            inputRef.current.value = "";
        }
    };

    const messageElements = messages.map((message) => <div>
        <strong>{message.from}: </strong>
        <span>{message.message}</span>
        <span className="timestamp">
            {
                new Date(message.timestamp).toLocaleTimeString(
                    "en-US", 
                    {hour: "numeric", minute: "numeric"}
                )
            }
        </span>
    </div>);

    return (
        <div className="bordered-panel global-chat">
            <div className="global-chat-messages">
                {messageElements}
            </div>
            <hr />
            <form onSubmit={handleSubmit}>
                <input className="message-input" ref={inputRef} type="text" />
                <button className="animated-button light-button-theme send-button" type="submit">Send</button>
            </form>
        </div>
    );
};

export default GlobalChat;

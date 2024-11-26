type Props = {
    messages: string[],
};

const RadioMessages = ({ messages }: Props) => {
    return (
        <>
            {
                messages.map((message: string) => <p>{message}</p>)
            }
        </>
    )
}

export default RadioMessages;

import "./Modal.css";
import { useEffect, useRef, useState } from "react";

type Props = {
    children: React.ReactNode,
    isOpen: boolean,
    canCancel?: boolean,
    onClose?: () => void,
};

const Modal = ({children, isOpen, canCancel, onClose}: Props) => {
    const [isModalOpen, setIsOpen] = useState<boolean>(isOpen);
    const modalRef = useRef<HTMLDialogElement | null>(null);

    useEffect(() => {
        setIsOpen(isOpen)
    }, [isOpen]);

    useEffect(() => {
        const element = modalRef.current;

        if (element) {
            if (isModalOpen) {
                element.showModal();
            } else {
                element.close();
            }
        }
    }, [isModalOpen]);

    const handleCloseModal = () => {
        if (onClose) {
            onClose();
        }
        setIsOpen(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
        if (event.key === "Escape") {
          handleCloseModal();
        }
      };

    return (
        <dialog ref={modalRef} onKeyDown={handleKeyDown} className="modal">
            {canCancel && (
                <button className="close-button" onClick={handleCloseModal}>&times;</button>
            )}
            {children}
        </dialog>
    );
}

export default Modal;

import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { Point } from "../../../../shared/types";
import { GRID_SIZE } from "../../../../shared/constants.mts";

type Props = {
    isOpen: boolean;
    onSubmit: (launchCoordinates: Point) => void;
    onClose: () => void;
};

const TorpedoLaunchDialog = ({isOpen, onSubmit, onClose}: Props) => {
    const focusInputRef = useRef<HTMLInputElement | null>(null);
    const [launchCoordinates, setLaunchCoordinates] = useState<Point>({x: 0, y: 0});

    useEffect(() => {
        if (isOpen && focusInputRef.current) {
            // This makes sure that the modal is fully rendered before
            // focusing on the input.
            setTimeout(() => {
                focusInputRef.current!.focus();
            }, 0);
        }
      }, [isOpen]);

      const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
      ): void => {
        const { name, value } = event.target;
        setLaunchCoordinates((prevCoords) => ({
          ...prevCoords,
          [name]: value,
        }));
      };
      
      const handleSubmit = (event: React.FormEvent): void => {
        event.preventDefault();
        onSubmit(launchCoordinates);
        setLaunchCoordinates({x: 0, y: 0});
      };

    return (
        <Modal isOpen={isOpen} canCancel={true} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="modal-header">
                    <label>Set target coordinates</label>
                </div>
                <div className="modal-form-element">
                    <label htmlFor="x-coord">X coord: </label>
                    <input
                        className="modal-form-input"
                        type="number"
                        min="0"
                        max={GRID_SIZE - 1}
                        id="x-coord"
                        name="x"
                        value={launchCoordinates.x}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="modal-form-element">
                    <label htmlFor="y-coord">Y coord: </label>
                    <input
                        className="modal-form-input"
                        type="number"
                        id="y-coord"
                        min="0"
                        max={GRID_SIZE - 1}
                        name="y"
                        value={launchCoordinates.y}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <button className="animated-button modal-action-button" type="submit">Launch</button>
                </div>
            </form>
        </Modal>
    );
}

export default TorpedoLaunchDialog;

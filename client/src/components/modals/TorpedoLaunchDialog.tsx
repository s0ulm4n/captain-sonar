import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { Point } from "../../../../shared/types.mts";
import { GRID_SIZE } from "../../../../shared/constants.mts";

type Props = {
    isOpen: boolean;
    onSubmit: (launchCoordinates: Point) => void;
    onClose: () => void;
};

// TODO: you shouldn't be able to launch a torpedo at a target more than 4
// spaces away (doesn't have to be in a straight line, but the spaces aren't
// counted diagonally).
const TorpedoLaunchDialog = ({isOpen, onSubmit, onClose}: Props) => {
    const focusInputRef = useRef<HTMLInputElement | null>(null);
    const [launchCoordinates, setLaunchCoordinates] = useState<Point>(new Point(0, 0));

    useEffect(() => {
        if (isOpen && focusInputRef.current) {
            // This makes sure that the modal is fully rendered before
            // focusing on the input.
            setTimeout(() => {
                focusInputRef.current!.focus();
            }, 0);
        }
      }, [isOpen]);

      const handleXCoordChange = (
        event: React.ChangeEvent<HTMLInputElement>
      ): void => {
        const newCoord = Number(event.target.value)
        if (newCoord) {
            setLaunchCoordinates(
                (prevCoords) =>  new Point(newCoord, prevCoords.y)
            );
        }
      };

      const handleYCoordChange = (
        event: React.ChangeEvent<HTMLInputElement>
      ): void => {
        const newCoord = Number(event.target.value)
        if (newCoord) {
            setLaunchCoordinates(
                (prevCoords) =>  new Point(prevCoords.x, newCoord)
            );
        }
      };
      
      const handleSubmit = (event: React.FormEvent): void => {
        event.preventDefault();
        onSubmit(launchCoordinates);
        setLaunchCoordinates(new Point(0, 0));
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
                        onChange={handleXCoordChange}
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
                        onChange={handleYCoordChange}
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

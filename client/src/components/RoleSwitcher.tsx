import { PlayerRole } from "../../../shared/enums.mts";

type Props = {
    selectedRole: PlayerRole,
    setRole: (role: PlayerRole) => void,
};

// I could make this more extensible by dynamically constructing the components
// from the PlayerRole enum, but this will do.
const RoleSwitcher = ({ selectedRole, setRole }: Props) => {
    return (
        <div>
            <input
                type="radio"
                name="role"
                value={PlayerRole.Captain}
                id="captain"
                checked={selectedRole === PlayerRole.Captain}
                onChange={(event) => setRole(event.target.value as PlayerRole)}
            />
            <label onClick={() => setRole(PlayerRole.Captain)}>Captain</label>
            <input
                type="radio"
                name="role"
                value={PlayerRole.Engineer}
                id="engineer"
                checked={selectedRole === PlayerRole.Engineer}
                onChange={(event) => setRole(event.target.value as PlayerRole)}
            />
            <label onClick={() => setRole(PlayerRole.Engineer)}>Engineer</label>
            <input
                type="radio"
                name="role"
                value={PlayerRole.FirstMate}
                id="first-mate"
                checked={selectedRole === PlayerRole.FirstMate}
                onChange={(event) => setRole(event.target.value as PlayerRole)}
            />
            <label onClick={() => setRole(PlayerRole.FirstMate)}>First Mate</label>
            <input
                type="radio"
                name="role"
                value={PlayerRole.RadioOperator}
                id="radio-operator"
                checked={selectedRole === PlayerRole.RadioOperator}
                onChange={(event) => setRole(event.target.value as PlayerRole)}
            />
            <label onClick={() => setRole(PlayerRole.RadioOperator)}>Radio Operator</label>
        </div>
    );
}

export default RoleSwitcher;

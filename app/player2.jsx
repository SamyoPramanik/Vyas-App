import PlayerScreen from "./PlayerScreen";

// Wrapper for backward compatibility; always passes player=player2
const Player2 = (props) => <PlayerScreen {...props} player="player2" />;

export default Player2;

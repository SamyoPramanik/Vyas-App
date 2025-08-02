import PlayerScreen from "./PlayerScreen";

// Wrapper for backward compatibility; always passes player=player1
const Player1 = (props) => <PlayerScreen {...props} player="player1" />;

export default Player1;

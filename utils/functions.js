import { actionCards, powerCards } from "./constants";
import useSecureStorage from "./store";

export const randomActionCard = () => {
    const idx = Math.floor(Math.random() * 1009) % 4;
    return actionCards[idx];
};

export const randomPowerCard = () => {
    const idx = Math.floor(Math.random() * 1009) % 7;
    return powerCards[idx];
};

export const isValidMove = (move) => {
    return true;
};

const store = useSecureStorage.getState();

export const findAction = (player, card1, card2) => {
    if (card1 === "block" || card1 === "ban") {
        return card2;
    }
    if (card1 === "forward") {
        return "forward";
    }
    if (card1 === "backward") {
        return "backward";
    }
    if (card1 === "left") {
        return "left";
    }
    if (card1 === "right") {
        return "right";
    }
    if (card1 === "wild") {
        const action = randomActionCard();
        return action;
    }
    if (card1 === "echo") {
        if (player === "player1") {
            return store.player1Moves[store.player1Moves.length - 1];
        }
        if (player === "player2") {
            return store.player2Moves[store.player2Moves.length - 1];
        }
    }
    if (card1 === "copycat") {
        return store.recentMoves[store.recentMoves.length - 1];
    }
};

export const genNewCard = (card1) => {
    if (
        card1 === "hack" ||
        card1 === "wild" ||
        card1 === "echo" ||
        card1 === "copycat" ||
        card1 === "skip" ||
        card1 === "ban" ||
        card1 === "block"
    ) {
        return randomPowerCard();
    }

    if (
        card1 === "forward" ||
        card1 === "backward" ||
        card1 === "left" ||
        card1 === "right"
    ) {
        return randomActionCard();
    }
};

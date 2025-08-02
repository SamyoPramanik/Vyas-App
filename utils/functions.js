import {
    actionCards,
    allowedMoves,
    nextJunction,
    powerCards,
} from "./constants";
import useSecureStorage from "./store";
import { ToastAndroid } from "react-native";

export const randomActionCard = (junction = null) => {
    if (junction == null) {
        const len = allowedMoves[0].length;
        const idx = Math.floor(Math.random() * 1009) % len;
        return allowedMoves[0][idx];
    }
    const moveOptions = [];
    const possibleNextJunctions = [...Object.values(nextJunction[junction])];
    for (const nextjunction of possibleNextJunctions) {
        moveOptions.push(...allowedMoves[nextjunction]);
    }

    if (moveOptions.length === 0) {
        console.warn("No valid action cards available for junction", junction);
        return null;
    }

    const idx = Math.floor(Math.random() * 1009) % moveOptions.length;
    return moveOptions[idx];
};

export const randomActionCardCurrentJunction = () => {
    const store = useSecureStorage.getState();
    const currentJunction = parseInt(store.currentJunction);
    const len = allowedMoves[currentJunction].length;
    const idx = Math.floor(Math.random() * 1009) % len;
    return allowedMoves[currentJunction][idx];
};

export const randomPowerCard = () => {
    const idx = Math.floor(Math.random() * 1009) % 6;
    return powerCards[idx];
};
const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
};
export const isValidMove = (move, player, verbose) => {
    // verbose lets decide whether states should be changed and whether outputs are shown
    const store = useSecureStorage.getState();
    if (store.bannedCard === move && store.bannedByPlayer !== player) {
        if (verbose) {
            showToast("You cannot use this card, it is banned.");
        }
        return false;
    }
    if (move === "") {
        if (verbose) {
            showToast("Invalid move, please select a valid card.");
        }
        return false;
    }
    let validMove = false;
    allowedMoves[parseInt(store.currentJunction)].forEach((element) => {
        if (element === move) {
            validMove = true;
        }
    });
    if (!validMove) {
        if (move != undefined) {
            if (verbose) {
                showToast("there is no " + move + " from this junction.");
            }
        } else {
            if (verbose) {
                showToast("there is no move to apply.");
            }
        }
        return false;
    }
    if (verbose) {
        updateJunction(move);
        store.setBannedCard("");
        store.setBannedByPlayer("");
    }
    return true;
};

export const findAction = (player, card1, card2, junction) => {
    const store = useSecureStorage.getState();
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
        const action = randomActionCard(junction);
        return action;
    }
    if (card1 === "echo") {
        try {
            if (player === "player1") {
                return store.player1Moves[store.player1Moves.length - 1];
            }
            if (player === "player2") {
                return store.player2Moves[store.player2Moves.length - 1];
            }
        } catch (error) {
            console.error("You have no recent moves");
            return "";
        }
    }
    if (card1 === "copycat") {
        console.log(`size: ${store.recentMoves.length}`);
        try {
            return store.recentMoves[store.recentMoves.length - 1];
        } catch (error) {
            console.error("No recent moves found");
            return "";
        }
    }
};

export const genNewCard = (card1) => {
    const store = useSecureStorage.getState();
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

export const addAction = (player, card1, card2, action) => {
    const store = useSecureStorage.getState();

    if (
        card1 === "forward" ||
        card1 === "backward" ||
        card1 === "left" ||
        card1 === "right" ||
        card1 === "wild"
    ) {
        if (player === "player1") {
            store.addPlayer1Move(action);
        }
        if (player === "player2") {
            store.addPlayer2Move(action);
        }
        store.addRecentMove(action);
    } else if (card1 === "block" || card1 === "ban") {
        if (player === "player1") {
            store.addPlayer1Move(action);
        }
        if (player === "player2") {
            store.addPlayer2Move(action);
        }
        store.addRecentMove(action);
    }

    if (card1 === "ban") {
        store.setBannedCard(card2);
        store.setBannedByPlayer(player);
    }
    if (card1 === "block") {
        store.setIsBlocked(true);
        store.setBlockedBy(player);
    }
};

export const updateJunction = (move) => {
    const store = useSecureStorage.getState();
    const currentJunction = parseInt(store.currentJunction);
    const nextJunc = nextJunction[currentJunction][move];
    console.log("nextJunc " + nextJunc);
    store.setCurrentJunction(nextJunc);
};

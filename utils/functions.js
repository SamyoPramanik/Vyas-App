import { actionCards, powerCards } from "./constants";
import useSecureStorage from "./store";

export const randomActionCard = (currentCard = "") => {
    const idx = Math.floor(Math.random() * 1009) % 4;
    const newCard = actionCards[idx];
    if (newCard === currentCard) {
        return randomActionCard(currentCard);
    }
    return newCard;
};

export const randomPowerCard = () => {
    const idx = Math.floor(Math.random() * 1009) % 6;
    return powerCards[idx];
};

export const isValidMove = (move) => {
    const store = useSecureStorage.getState();
    if (store.bannedCard === move) {
        console.log("You cannot use this card, it is banned.");
        return false;
    }
    if (move === "") return false;
    const currentJunction = parseInt(store.currentJunction);
    updateJunction(currentJunction + 1);
    store.setBannedCard("");
    return true;
};

export const findAction = (player, card1, card2) => {
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
        const action = randomActionCard();
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

export const addAction = (player, card1, card2) => {
    const store = useSecureStorage.getState();
    store.addRecentMove(card1);
    if (
        card1 === "forward" ||
        card1 === "backward" ||
        card1 === "left" ||
        card1 === "right"
    ) {
        if (player === "player1") {
            store.addPlayer1Move(card1);
        }
        if (player === "player2") {
            store.addPlayer2Move(card1);
        }
    } else if (card1 === "block" || card1 === "ban") {
        if (player === "player1") {
            store.addPlayer1Move(card2);
        }
        if (player === "player2") {
            store.addPlayer2Move(card2);
        }
    }

    if (card1 === "ban") {
        store.setBannedCard(card2);
    }
};

export const updateJunction = (junction) => {
    const store = useSecureStorage.getState();
    store.setCurrentJunction(junction);
};

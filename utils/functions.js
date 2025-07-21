import { actionCards, powerCards } from "./constants";

export const randomActionCard = () => {
    const idx = Math.floor(Math.random() * 1009) % 4;
    return actionCards[idx];
};

export const randomPowerCard = () => {
    const idx = (Math.floor(Math.random() * 1009) % 7) + 4;
    return powerCards[idx];
};

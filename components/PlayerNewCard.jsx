import { View, Text, ToastAndroid, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack } from "expo-router";
import Toolbar from "../components/Toolbar";
import useSecureStorage from "../utils/store";
import SingleCard from "../components/SingleCard";
import {
    addAction,
    findAction,
    genNewCard,
    isValidMove,
    randomActionCard,
} from "../utils/functions";
import * as SecureStore from "expo-secure-store";

const PlayerNewCard = ({
    player,
    otherPlayer,
    playerName,
    playerRoute,
    otherPlayerRoute,
    playerCurrentCards,
    setPlayerCurrentCards,
    updateMyMoves,
}) => {
    const store = useSecureStorage();
    const [validAction, setValidAction] = useState(false);
    const [newCard1, setNewCard1] = useState("");
    const [newCard2, setNewCard2] = useState("");
    const [action, setAction] = useState("");
    const [currentCardId, setCurrentCardId] = useState(4);
    const [currentCard2Id, setCurrentCard2Id] = useState(4);
    const [currentCard, setCurrentCard] = useState(store.currentCard || "");
    const [currentCard2, setCurrentCard2] = useState(store.currentCard2 || "");

    const showToast = (message) => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    };

    const sendCommand = async (command) => {
        showToast(`Sending command: ${command}`);
        if (store.connectedDevice && command) {
            try {
                await store.connectedDevice.write(command + "\n");
                showToast(`Sent: ${command}`);
            } catch (err) {
                showToast(`Send failed: ${err}`);
            }
        }
    };

    useEffect(() => {
        const currentCard = store.currentCard;
        const currentCard2 = store.currentCard2;
        setCurrentCard(currentCard);
        setCurrentCard2(currentCard2);
        setCurrentCard2Id(store.currentCard2Id);
        setCurrentCardId(store.currentCardId);
        let tempaction = "";

        if (currentCard !== "hack")
            tempaction = findAction(player, currentCard, currentCard2);
        else tempaction = "forward";
        if (!isValidMove(tempaction)) {
            showToast("Invalid move, please select a valid card.");
            setTimeout(() => {
                router.replace(playerRoute, { key: playerName }); // back to camera screen
            }, 300); // 200–300ms gives time for focus lifecycle to catch up
            return;
        }
        addAction(player, currentCard, currentCard2);
        setAction(tempaction);
        setValidAction(true);
    }, []);

    useEffect(() => {
        if (validAction) {
            const card1 = genNewCard(currentCard);
            setNewCard1(card1);

            const updated = playerCurrentCards;
            updated[currentCardId] = card1;

            if (currentCard === "block" || currentCard === "ban") {
                const card2 = randomActionCard(
                    playerCurrentCards[(currentCard2Id + 1) % 2]
                );
                setNewCard2(card2);
                updated[currentCard2Id] = card2;
            }

            setPlayerCurrentCards(updated);
        }
    }, [validAction]);

    const getCommand = async (commandName) => {
        if (commandName === "forward")
            return await SecureStore.getItemAsync("forwardCommand");
        if (commandName === "backward")
            return await SecureStore.getItemAsync("backwardCommand");
        if (commandName === "left")
            return await SecureStore.getItemAsync("leftCommand");
        if (commandName === "right")
            return await SecureStore.getItemAsync("rightCommand");
        return "";
    };

    const confirmMove = async () => {
        const command = await getCommand(action);

        if (currentCard !== "block") {
            store.setPlayerToMove(otherPlayer);
        }

        if (currentCard !== "skip") {
            sendCommand(command);
            store.setInJunction(false);
            store.setCurrentCard("");
            store.setCurrentCard2("");
            store.setCurrentCardId(4);
            store.setCurrentCard2Id(4);
            router.replace("/waiting");
        } else {
            showToast("You skipped this turn.");
            store.setPlayerToMove(otherPlayer);
            store.setCurrentCard("");
            store.setCurrentCard2("");
            store.setCurrentCardId(4);
            store.setCurrentCard2Id(4);
            router.replace(otherPlayerRoute, { key: playerName });
        }

        store.setCurrentCard("");
        store.setCurrentCard2("");
        store.setCurrentCardId(4);
        store.setCurrentCard2Id(4);
    };

    return (
        <View>
            <View className="flex items-center">
                <Text className="text-xl">
                    <Text className="font-bold">{`${playerName}`}</Text>
                    {` new card`}
                </Text>
            </View>
            <View className="flex flex-row justify-center gap-2">
                {currentCardId < 4 && (
                    <View className="flex w-1/5">
                        <SingleCard
                            id={currentCardId + 1}
                            name={newCard1}
                            currentCard={currentCardId}
                            currentCard2={currentCard2Id}
                        />
                    </View>
                )}
                {currentCard2Id < 4 && (
                    <View className="flex w-1/5">
                        <SingleCard
                            id={currentCard2Id + 1}
                            name={newCard2}
                            currentCard={currentCardId}
                            currentCard2={currentCard2Id}
                        />
                    </View>
                )}
            </View>
            <View className="flex items-center">
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={confirmMove}
                    className="flex items-center p-4 w-1/2 bg-blue-500 rounded-lg"
                >
                    <Text className="text-white font-bold">Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default PlayerNewCard;

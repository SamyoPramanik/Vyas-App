import { View, Text, ToastAndroid, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack } from "expo-router";
import Toolbar from "../components/Toolbar";
import useSecureStorage from "../utils/store";
import SingleCard from "../components/SingleCard";
import {
    findAction,
    genNewCard,
    isValidMove,
    randomActionCard,
} from "../utils/functions";
import * as SecureStore from "expo-secure-store";

const Player1 = () => {
    const store = useSecureStorage();
    const [validAction, setValidAction] = useState(false);
    const [newCard1, setNewCard1] = useState("");
    const [newCard2, setNewCard2] = useState("");
    const [action, setAction] = useState("");

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
        showToast(`Command sent: ${command}`);
    };

    useEffect(() => {
        const currentCard = store.currentCard;
        const currentCard2 = store.currentCard2;
        const currentCardId = store.currentCardId;
        const currentCard2Id = store.currentCard2Id;
        let tempaction = "";

        if (currentCard !== "hack")
            tempaction = findAction("player1", currentCard, currentCard2);
        if (!isValidMove(action)) {
            store.setCurrentCard("");
            store.setCurrentCard2("");
            store.setCurrentCardId(4);
            store.setCurrentCard2Id(4);
            showToast("Invalid move, please select a valid card.");
            router.replace("/player1");
            return;
        }
        setValidAction(true);
        setAction(tempaction);
    }, []);

    useEffect(() => {
        if (validAction) {
            const currentCard = store.currentCard;
            const card1 = genNewCard(currentCard);
            setNewCard1(card1);

            if (currentCard === "block" || currentCard === "ban") {
                const card2 = randomActionCard();
                setNewCard2(card2);
            }
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

        const currentCard = store.currentCard;
        if (currentCard !== "block") {
            store.setPlayerToMove("player2");
        }

        if (currentCard !== "skip") {
            sendCommand(command);
            router.replace("/waiting");
        } else {
            showToast("You skipped this turn.");
            store.setPlayerToMove("player2");
            router.replace("/player2");
        }
    };

    return (
        <SafeAreaView className="flex-1 px-2 box-border">
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <Toolbar />
            <View className="flex items-center">
                <Text className="text-xl">
                    <Text className="font-bold">{`${store.player1Name}`}</Text>
                    {` new card`}
                </Text>
            </View>
            <View className="flex flex-row justify-between">
                {store.currentCardId < 4 && (
                    <View className="flex w-1/5">
                        <SingleCard
                            id={store.currentCardId + 1}
                            name={newCard1}
                            currentCard={store.currentCardId}
                            currentCard2={store.currentCard2Id}
                        />
                    </View>
                )}
                {store.currentCardId2 < 4 && (
                    <View className="flex w-1/5">
                        <SingleCard
                            id={store.currentCardId2 + 1}
                            name={newCard2}
                            currentCard={store.currentCardId}
                            currentCard2={store.currentCard2Id}
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
        </SafeAreaView>
    );
};

export default Player1;

import { View, Text, TextInput, ToastAndroid } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import useSecureStorage from "../utils/store";
import { router, Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import Toolbar from "../components/Toolbar";
import { randomActionCard, randomPowerCard } from "../utils/functions";

const NamesPage = () => {
    const [player1Name, setPlayer1Name] = useState("");
    const [player2Name, setPlayer2Name] = useState("");
    const [initialized, setInitialized] = useState(false);
    const store = useSecureStorage();

    const showToast = useCallback((message) => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    }, []);

    useEffect(() => {
        if (initialized) {
            showToast("Game starting...");
            router.replace("/bothcards");
        }
    }, [initialized]);

    const distributeCards = () => {
        // Clear existing cards first
        store.setPlayer1CurrentCards([]);
        store.setPlayer2CurrentCards([]);

        const player1Cards = [];
        const player2Cards = [];
        for (let i = 0; i < 2; i++) {
            const card1 = randomActionCard();
            const card2 = randomActionCard();
            player1Cards.push(card1);
            player2Cards.push(card2);
        }
        for (let i = 0; i < 2; i++) {
            const card1 = randomPowerCard();
            const card2 = randomPowerCard();
            // const card1 = "wild";
            // const card2 = "ban";
            player1Cards.push(card1);
            player2Cards.push(card2);
        }
        store.setPlayer1CurrentCards((prev) => player1Cards);
        store.setPlayer2CurrentCards((prev) => player2Cards);
        setInitialized(true);
    };

    const initializeGame = () => {
        store.setPlayer1Moves([]);
        store.setPlayer2Moves([]);
        store.setRecentMoves([]);
        store.setIsGameFinished(false);
        store.setWinner("");
        store.setInJunction(false);
        store.setCurrentJunction(0);
        store.setCardVisible(false);
        (async () => {
            const forwardCommand =
                (await SecureStore.getItemAsync("forwardCommand")) || "f";
            const backwardCommand =
                (await SecureStore.getItemAsync("backwardCommand")) || "b";
            const leftCommand =
                (await SecureStore.getItemAsync("leftCommand")) || "l";
            const rightCommand =
                (await SecureStore.getItemAsync("rightCommand")) || "r";
            const junctionCommand =
                (await SecureStore.getItemAsync("junctionCommand")) ||
                "junction";
            const finishCommand =
                (await SecureStore.getItemAsync("finishCommand")) || "finish";
            const cameraFacing =
                (await SecureStore.getItemAsync("cameraFacing")) || "front";

            const cardVisible =
                (await SecureStore.getItemAsync("cardVisible")) === "true";

            store.setForwardCommand(forwardCommand);
            store.setBackwardCommand(backwardCommand);
            store.setLeftCommand(leftCommand);
            store.setRightCommand(rightCommand);
            store.setJunctionCommand(junctionCommand);
            store.setFinishCommand(finishCommand);
            store.setPlayerToMove("player1");
            store.setCardVisible(cardVisible);
            store.setCurrentJunction(0);
            store.setCameraFacing(cameraFacing);

            await SecureStore.setItemAsync("forwardCommand", forwardCommand);
            await SecureStore.setItemAsync("backwardCommand", backwardCommand);
            await SecureStore.setItemAsync("leftCommand", leftCommand);
            await SecureStore.setItemAsync("rightCommand", rightCommand);
            await SecureStore.setItemAsync("junctionCommand", junctionCommand);
            await SecureStore.setItemAsync("finishCommand", finishCommand);
            await SecureStore.setItemAsync(
                "cardVisible",
                cardVisible.toString()
            );
            await SecureStore.setItemAsync("cameraFacing", cameraFacing);
        })();
    };

    const handleStartGame = () => {
        if (player1Name.trim() === "" || player2Name.trim() === "") {
            alert("Please enter names for both players.");
            return;
        }
        store.setPlayer1Name(player1Name);
        store.setPlayer2Name(player2Name);
        store.setIsGameFinished(false);
        store.setWinner("");
        store.setPlayer1CurrentCards([]);
        store.setPlayer2CurrentCards([]);
        store.setPlayer1Moves([]);
        store.setPlayer2Moves([]);
        store.setRecentMoves([]);
        store.setInJunction(false);
        store.setCurrentJunction(0);
        store.setCurrentCard("");
        store.setCurrentCard2("");
        store.setCurrentCardId(40);
        store.setCurrentCard2Id(40);

        distributeCards();
        initializeGame();
    };

    return (
        <SafeAreaView className="flex-1 px-6 box-border">
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <Toolbar />
            <View className="flex gap-1">
                <View className="items-center p-1">
                    <Text className="text-6xl font-bold">Vyas</Text>
                </View>
                <View className="flex gap-1">
                    <Text className="font-bold">Enter Player1 Name</Text>
                    <TextInput
                        onChangeText={(text) => setPlayer1Name(text)}
                        value={player1Name}
                        className="border border-gray-300 p-3 rounded-md mb-4"
                        placeholder="Player 1"
                    />
                </View>
                <View className="flex gap-1">
                    <Text className="font-bold">Enter Player2 Name</Text>
                    <TextInput
                        onChangeText={(text) => setPlayer2Name(text)}
                        value={player2Name}
                        className="border border-gray-300 p-3 rounded-md mb-4"
                        placeholder="Player 2"
                    />
                </View>
                <View>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={handleStartGame}
                        className="flex items-center p-4 bg-blue-500 rounded-lg"
                    >
                        <Text className="text-white font-bold">Start Game</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default NamesPage;

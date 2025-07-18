import {
    View,
    Text,
    ToastAndroid,
    TouchableOpacity,
    Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack } from "expo-router";
import Toolbar from "../components/Toolbar";
import useSecureStorage from "../utils/store";
import SingleCard from "../components/SingleCard";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";

const Player2 = () => {
    const store = useSecureStorage();
    const [myCards, setMyCards] = useState([]);
    const [currentCard, setCurrentCard] = useState("");
    const [currentCard2, setCurrentCard2] = useState("");
    const [permission, requestPermission] = useCameraPermissions();
    const [cameraFacing, setCameraFacing] = useState("back");
    const [inJunction, setInJunction] = useState(false);
    const [currentCardId, setCurrentCardId] = useState(0);
    const [currentCard2Id, setCurrentCard2Id] = useState(0);
    const [inFinish, setInFinish] = useState(false);
    const isFocused = useIsFocused();
    const [cameraKey, setCameraKey] = useState(0);

    // Force remount camera when screen gets focused
    useEffect(() => {
        if (isFocused) {
            setCameraKey((prev) => prev + 1);
        }
    }, [isFocused]);

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

    const sendCurrentCard2 = () => {
        if (currentCard2 === "forward") sendCommand(store.forwardCommand);
        else if (currentCard2 === "backward")
            sendCommand(store.backwardCommand);
        else if (currentCard2 === "left") sendCommand(store.leftCommand);
        else if (currentCard2 === "right") sendCommand(store.rightCommand);
    };

    const saveMoveAndChangePlayer = (move) => {
        store.setPlayer1Moves((prev) => [...prev, move]);
        store.setRecentMoves((prev) => [...prev, move]);
        store.setPlayerToMove("player1");
        setCurrentCard("");
        setCurrentCard2("");
    };

    const sendMyLastCard = () => {
        const lastCard = store.player2Moves[store.player2Moves.length - 1];
        if (lastCard === "forward") sendCommand(store.forwardCommand);
        else if (lastCard === "backward") sendCommand(store.backwardCommand);
        else if (lastCard === "left") sendCommand(store.leftCommand);
        else if (lastCard === "right") sendCommand(store.rightCommand);
        else if (lastCard === "wild") sendRandomCommand();

        store.setPlayerToMove("player1");
        router.replace("/waiting");
    };

    const sendLastCard = () => {
        const lastCard = store.player2Moves[store.player2Moves.length - 1];
        if (lastCard === "forward") sendCommand(store.forwardCommand);
        else if (lastCard === "backward") sendCommand(store.backwardCommand);
        else if (lastCard === "left") sendCommand(store.leftCommand);
        else if (lastCard === "right") sendCommand(store.rightCommand);
        else if (lastCard === "wild") sendRandomCommand();

        store.setPlayerToMove("player1");
        router.replace("/waiting");
    };

    const sendRandomCommand = () => {
        const randomIndex = Math.floor(Math.random() * 1000) % 4;
        if (randomIndex === 0) {
            sendCommand(store.forwardCommand);
        } else if (randomIndex === 1) {
            sendCommand(store.backwardCommand);
        } else if (randomIndex === 2) {
            sendCommand(store.leftCommand);
        } else if (randomIndex === 3) {
            sendCommand(store.rightCommand);
        }
    };

    useEffect(() => {
        // Set myCards from store
        setMyCards(store.player2CurrentCards || []);
        setCameraFacing(store.cameraFacing || "back");
        setCurrentCard("");
        setCurrentCard2("");
        setCurrentCardId(4);
        setCurrentCard2Id(4);
        setInJunction(false);

        if (!permission?.granted) {
            requestPermission();
        }
    }, []);

    useEffect(() => {
        setCameraFacing(store.cameraFacing || "back");
    }, [store.cameraFacing]);

    useEffect(() => {
        if (
            inJunction === true &&
            store.inJunction === true &&
            store.playerToMove === "player2"
        ) {
            switch (currentCard) {
                case "forward":
                    sendCommand(store.forwardCommand);
                    saveMoveAndChangePlayer("forward");
                    router.replace("/waiting");
                    break;
                case "backward":
                    sendCommand(store.backwardCommand);
                    saveMoveAndChangePlayer("backward");
                    router.replace("/waiting");
                    break;
                case "left":
                    sendCommand(store.leftCommand);
                    saveMoveAndChangePlayer("left");
                    router.replace("/waiting");
                    break;
                case "right":
                    sendCommand(store.rightCommand);
                    saveMoveAndChangePlayer("right");
                    router.replace("/waiting");
                    break;
                case "block":
                    sendCurrentCard2();
                    saveMoveAndChangePlayer("block");
                    store.setPlayerToMove("player1");
                    router.replace("/waiting");
                    break;
                case "wild":
                    sendRandomCommand();
                    saveMoveAndChangePlayer("wild");
                    router.replace("/waiting");
                    break;
                case "echo":
                    sendMyLastCard();
                    break;
                case "copycat":
                    sendLastCard();
                    break;
                case "skip":
                    store.setPlayerToMove("player1");
                    router.replace("/waiting");
                    break;
                case "ban":
                    router.replace("/waiting");
                    break;
                case "hack":
                    router.replace("/waiting");
                    break;
            }
            setInJunction(false);
            store.setInJunction(false);
            setCurrentCard("");
            setCurrentCard2("");
            setCurrentCardId(4);
            setCurrentCard2Id(4);
        }
    }, [inJunction]);

    const handleQrCode = (data) => {
        if (parseInt(data) < 4 || parseInt(data) > 7) {
            showToast("Invalid card selected");
            setCurrentCard("");
            setCurrentCard2("");
            setCurrentCardId(4);
            setCurrentCard2Id(4);
            return;
        }
        const cardIndex = parseInt(data) % 4; // Adjust index to match myCards array
        const card = myCards[parseInt(cardIndex)];

        if (card === undefined) {
            showToast("Invalid card selected");
            return;
        }

        if (
            currentCard === "block" &&
            (card === "forward" ||
                card === "backward" ||
                card === "left" ||
                card === "right")
        ) {
            setCurrentCard2(card);
            setCurrentCard2Id(cardIndex);
            setInJunction(true);
        } else {
            setCurrentCard(card);
            setCurrentCard2("");
            setCurrentCardId(cardIndex);
            setCurrentCard2Id(4);
            setInJunction(true);
        }
    };

    return (
        <SafeAreaView className="flex-1 p-6 box-border">
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <Toolbar />
            <View className="flex h-12 items-center justify-center">
                <Text className="text-xl">
                    <Text className="font-bold">{`${store.player2Name}`}</Text>
                    {`'s turn`}
                </Text>
            </View>
            <View className="flex-row items-center justify-between">
                {myCards.map((card, index) => (
                    <SingleCard
                        key={index}
                        id={index + 1}
                        name={card}
                        currentCard={currentCardId}
                        currentCard2={currentCard2Id}
                    />
                ))}
            </View>
            <View className="flex-1">
                <CameraView
                    className="flex"
                    key={cameraKey}
                    facing={cameraFacing}
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr"],
                    }}
                    onBarcodeScanned={({ data }) => {
                        handleQrCode(data);
                    }}
                >
                    <View className="flex h-full"></View>
                </CameraView>
            </View>
        </SafeAreaView>
    );
};

export default Player2;

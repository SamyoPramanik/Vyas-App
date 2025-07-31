import { View, Text, ToastAndroid, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { router, Stack } from "expo-router";
import useSecureStorage from "../utils/store";
import SingleCard from "../components/SingleCard";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
import Toolbar from "./Toolbar";
import { randomActionCardCurrentJunction } from "../utils/functions";
import { allowedMoves } from "../utils/constants";

const Player = ({
    storeMyCards,
    playerName,
    playerToMove,
    playerNewCardRoute,
    cameraKey,
    key = "",
}) => {
    const store = useSecureStorage();
    const [myCards, setMyCards] = useState([]);
    const [currentCard, setCurrentCard] = useState("");
    const [currentCard2, setCurrentCard2] = useState("");
    const [permission, requestPermission] = useCameraPermissions();
    const [cameraFacing, setCameraFacing] = useState("back");
    const [inJunction, setInJunction] = useState(false);
    const [currentCardId, setCurrentCardId] = useState(0);
    const [currentCard2Id, setCurrentCard2Id] = useState(0);
    const isFocused = useIsFocused();
    const [cameraKeyState, setCameraKey] = useState(cameraKey || 0);

    useEffect(() => {
        if (isFocused) {
            setCameraKey((prev) => prev + 1);
        }
    }, [isFocused]);

    const showToast = (message) => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    };

    useEffect(() => {
        // Set myCards from store
        setMyCards(storeMyCards || []);
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
            inJunction &&
            store.inJunction &&
            store.playerToMove === playerToMove
        ) {
            store.setCurrentCard(currentCard);
            store.setCurrentCard2(currentCard2);
            store.setCurrentCardId(currentCardId);
            store.setCurrentCard2Id(currentCard2Id);
            router.replace(playerNewCardRoute);
        }
    }, [inJunction]);

    const handleQrCode = (data) => {
        if (parseInt(data) > 3) {
            showToast("Invalid QR code");
            setCurrentCard("");
            setCurrentCard2("");
            setCurrentCardId(4);
            setCurrentCard2Id(4);
            return;
        }
        const card = myCards[parseInt(data)];
        console.log("Scanned card:", card);

        if (card === undefined) {
            showToast("Invalid card selected");
            return;
        }

        if (card === "block" || card === "ban") {
            setCurrentCard(card);
            setCurrentCardId(parseInt(data));
            setCurrentCard2("");
            setCurrentCard2Id(4);
            setInJunction(false);
        } else if (
            (currentCard === "block" || currentCard === "ban") &&
            (card === "forward" ||
                card === "backward" ||
                card === "left" ||
                card === "right")
        ) {
            setCurrentCard2(card);
            setCurrentCard2Id(parseInt(data));
            setInJunction(true);
        } else {
            setCurrentCard(card);
            setCurrentCard2("");
            setCurrentCardId(parseInt(data));
            setCurrentCard2Id(4);
            setInJunction(true);
        }
    };

    const handleNoValidMove = () => {
        showToast("No valid move available");
        const card = randomActionCardCurrentJunction();
        if (card) {
            if (playerToMove === "player1") {
                store.setPlayer1CurrentCards((prev) => {
                    const updated = [...myCards];
                    updated[0] = card;
                    return updated;
                });
                store.setPlayerToMove("player2");
                router.replace("/temproute2");
            }

            if (playerToMove === "player2") {
                store.setPlayer2CurrentCards((prev) => {
                    const updated = [...myCards];
                    updated[0] = card;
                    return updated;
                });
                store.setPlayerToMove("player1");
                router.replace("/temproute1");
            }
        }
    };

    return (
        <View className="flex-1 flex-row" key={key}>
            <View className="flex px-2 py-4 w-[30%]">
                <Toolbar />
                <View className="flex h-fit items-center">
                    <Text className="text-xl text-sky-600">
                        <Text className="font-bold">{`${playerName}`}</Text>
                        {`'s turn`}
                    </Text>
                </View>
                <View className="flex flex-wrap h-fit mt-2 flex-row justify-between z-10">
                    {store.cardVisible &&
                        myCards?.map((card, index) => (
                            <View key={index} className="flex w-1/2 mb-6">
                                <SingleCard
                                    id={index + 1}
                                    name={card}
                                    height="h-80"
                                    currentCard={currentCardId + 1 || 4}
                                    currentCard2={currentCard2Id + 1 || 4}
                                />
                            </View>
                        ))}
                </View>
                <Text className="text-sm text-slate-400">
                    {store.currentJunction}
                </Text>
                <View className="flex items-center mt-4">
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={handleNoValidMove}
                        className="flex items-center p-4 w-1/2 bg-slate-900 rounded-lg"
                    >
                        <Text className="text-slate-400 font-bold">
                            No valid move
                        </Text>
                    </TouchableOpacity>
                </View>
                {/* <View className="flex-1 flex-row gap-2 items-center justify-center">
                    {currentCardId < 4 && (
                        <View className="flex w-1/5 opacity-50 animate-pulse">
                            <SingleCard
                                id={currentCardId + 1}
                                name={myCards[currentCardId]}
                                height="h-96"
                            />
                        </View>
                    )}
                    {currentCard2Id < 4 && (
                        <View className="flex w-1/5 opacity-50 animate-pulse">
                            <SingleCard
                                id={currentCard2Id + 1}
                                name={myCards[currentCard2Id]}
                                height="h-96"
                            />
                        </View>
                    )}
                </View> */}
            </View>
            <CameraView
                style={{ flex: 1 }}
                key={cameraKeyState}
                facing={cameraFacing}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
                onBarcodeScanned={({ data }) => {
                    handleQrCode(data);
                }}
            >
                <View className="flex-1"></View>
            </CameraView>
        </View>
    );
};

export default Player;

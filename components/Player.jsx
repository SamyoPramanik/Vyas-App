import { View, Text, ToastAndroid, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { router, Stack } from "expo-router";
import useSecureStorage from "../utils/store";
import SingleCard from "../components/SingleCard";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";

const Player = ({
    storeMyCards,
    playerName,
    playerToMove,
    playerNewCardRoute,
    cameraKey,
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

    return (
        <View>
            <View className="flex items-center">
                <Text className="text-xl">
                    <Text className="font-bold">{`${playerName}`}</Text>
                    {`'s turn`}
                </Text>
            </View>
            <View className="flex flex-row justify-between">
                {myCards?.map((card, index) => (
                    <Text key={index} className="text-sm">
                        {card}
                    </Text>
                ))}
            </View>
            <View className="flex flex-row justify-between">
                {store.cardVisible && currentCardId < 4 && (
                    <View className="flex w-1/5 animate-pulse">
                        <SingleCard
                            id={currentCardId + 1}
                            name={myCards[currentCardId]}
                            currentCard={currentCardId}
                            currentCard2={currentCard2Id}
                        />
                    </View>
                )}
                {store.cardVisible && currentCard2Id < 4 && (
                    <View className="flex w-1/5">
                        <SingleCard
                            id={currentCard2Id + 1}
                            name={myCards[currentCard2Id]}
                            currentCard={currentCardId}
                            currentCard2={currentCard2Id}
                        />
                    </View>
                )}
                {currentCardId >= 4 && currentCard2Id >= 4 && (
                    <View className="flex w-1/5"></View>
                )}
                <View className="flex w-1/2 h-5/6">
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
            </View>
        </View>
    );
};

export default Player;

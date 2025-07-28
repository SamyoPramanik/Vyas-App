import { View, Text, ToastAndroid, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { router, Stack } from "expo-router";
import useSecureStorage from "../utils/store";
import SingleCard from "../components/SingleCard";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
import Toolbar from "./Toolbar";

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
        <View style={{ flex: 1 }} key={key}>
            <CameraView
                style={{ flex: 1 }}
                key={cameraKey}
                facing={cameraFacing}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
                onBarcodeScanned={({ data }) => {
                    handleQrCode(data);
                }}
            >
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: 8,
                        paddingVertical: 16,
                    }}
                >
                    <Toolbar />
                    <View className="flex h-fit items-center">
                        <Text className="text-xl text-sky-600">
                            <Text className="font-bold">{`${playerName}`}</Text>
                            {`'s turn`}
                        </Text>
                    </View>
                    <View className="flex h-fit flex-row justify-between">
                        {store.cardVisible &&
                            myCards?.map((card, index) => (
                                <Text
                                    key={index}
                                    className="text-sm text-slate-400"
                                >
                                    {card}
                                </Text>
                            ))}
                    </View>
                    <View className="flex-1 flex-row gap-2 items-center justify-center">
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
                    </View>
                </View>
            </CameraView>
        </View>
    );
};

export default Player;

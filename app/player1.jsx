import { View, Text, ToastAndroid, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack } from "expo-router";
import Toolbar from "../components/Toolbar";
import useSecureStorage from "../utils/store";
import SingleCard from "../components/SingleCard";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";

const Player1 = () => {
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

    useEffect(() => {
        // Set myCards from store
        setMyCards(store.player1CurrentCards || []);
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
            store.playerToMove === "player1"
        ) {
            store.setCurrentCard(currentCard);
            store.setCurrentCard2(currentCard2);
            store.setCurrentCardId(currentCardId);
            store.setCurrentCard2Id(currentCard2Id);
            router.replace("/player1newcard");
        }
    }, [inJunction]);

    const handleQrCode = (data) => {
        if (parseInt(data) > 3) {
            showToast("Invalid card selected");
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

        if (
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
                    {`'s turn`}
                </Text>
            </View>
            <View className="flex flex-row justify-between">
                {currentCardId < 4 && (
                    <View className="flex w-1/5">
                        <SingleCard
                            id={currentCardId + 1}
                            name={myCards[currentCardId]}
                            currentCard={currentCardId}
                            currentCard2={currentCard2Id}
                        />
                    </View>
                )}
                {currentCard2Id < 4 && (
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
        </SafeAreaView>
    );
};

export default Player1;

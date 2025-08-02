import {
    View,
    Text,
    ToastAndroid,
    TouchableOpacity,
    Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import useSecureStorage from "../utils/store";
import SingleCard from "../components/SingleCard";
import { CameraView, useCameraPermissions } from "expo-camera";
import Toolbar from "./Toolbar";
import { randomActionCardCurrentJunction } from "../utils/functions";

const Player = ({
    myCards,
    storeMyCards,
    playerName,
    playerToMove,
    cameraKey,
    key = "",
    onQrCode,
    showNewCardUI,
    newCard1,
    newCard2,
    currentCardId,
    currentCard2Id,
    isLoading,
    onContinue,
    showBlock,
    handleNoValidMove,
}) => {
    const store = useSecureStorage();
    const [permission, requestPermission] = useCameraPermissions();
    const [cameraFacing, setCameraFacing] = useState("back");
    const [cameraKeyState] = useState(cameraKey || 0); // Stabilize cameraKeyState

    useEffect(() => {
        setCameraFacing(store.cameraFacing || "back");
        if (!permission?.granted) {
            requestPermission();
        }
    }, [store.cameraFacing, permission]);

    return (
        <View className="flex-1 flex-row" key={key}>
            <View className="flex px-6 py-4 w-[30%] relative">
                {showBlock && (
                    <Image
                        source={require("../assets/images/block.png")}
                        className="rounded-lg absolute z-10"
                        style={{
                            top: 150,
                            right: -50,
                            transform: [{ scale: 0.5 }],
                        }}
                    />
                )}
                <Toolbar />
                <View className="flex h-fit items-center mt-10 z-0">
                    <Text className="text-3xl text-violet-100">
                        <Text className="font-bold">{`${playerName}`}</Text>
                        {`'s turn`}
                    </Text>
                    <Text className="text-base text-slate-400">
                        Current State : {store.currentJunction}
                    </Text>
                </View>
                {showNewCardUI ? (
                    <View className="flex items-center mt-8 z-0">
                        <Text className="text-xl text-slate-200">
                            Card {currentCardId + 1}
                            {currentCard2Id !== 4
                                ? ` and ${currentCard2Id + 1}`
                                : ""}{" "}
                            has been changed to...
                        </Text>
                        <View className="flex-col justify-center gap-2">
                            {currentCardId < 4 && (
                                <View className="flex w-60">
                                    <SingleCard
                                        id={currentCardId + 1}
                                        name={newCard1}
                                        height="h-60"
                                    />
                                </View>
                            )}
                            {currentCard2Id < 4 && (
                                <View className="flex w-60 my-2">
                                    <SingleCard
                                        id={currentCard2Id + 1}
                                        name={newCard2}
                                        height="h-60"
                                    />
                                </View>
                            )}
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={onContinue}
                            disabled={isLoading}
                            className="flex items-center p-4 w-1/2 bg-blue-500 rounded-lg mt-4"
                        >
                            <Text className="text-white font-bold">
                                Continue
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View className="flex flex-wrap h-fit mt-2 flex-row justify-between z-0">
                        {store.cardVisible &&
                            myCards?.map((card, index) => (
                                <View key={index} className="flex w-1/2 mb-6">
                                    <SingleCard
                                        id={index + 1}
                                        name={card}
                                        height="h-60"
                                        currentCard={currentCardId + 1 || 4}
                                        currentCard2={currentCard2Id + 1 || 4}
                                    />
                                </View>
                            ))}
                    </View>
                )}
                {!showNewCardUI && (
                    <View className="flex items-center mt-4">
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={handleNoValidMove}
                            className="flex items-center p-4 w-1/2 bg-cyan-950 rounded-lg"
                        >
                            <Text className="text-slate-400 font-bold">
                                No valid move
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <View className="m-4 mt-10 rounded-xl border-4 border-violet-200 overflow-hidden flex-1">
                <CameraView
                    style={{ flex: 1 }}
                    key={cameraKey}
                    facing={cameraFacing}
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr"],
                    }}
                    onBarcodeScanned={
                        showNewCardUI ? undefined : ({ data }) => onQrCode(data)
                    }
                >
                    <View className="flex-1"></View>
                </CameraView>
            </View>
        </View>
    );
};

export default Player;

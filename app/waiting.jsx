import { View, Text, ToastAndroid, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack } from "expo-router";
import Toolbar from "../components/Toolbar";
import useSecureStorage from "../utils/store";
import { Button } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";

const WaitingPage = () => {
    const store = useSecureStorage();
    const isFocused = useIsFocused();
    const [cameraKey, setCameraKey] = useState(0);
    const [cameraFacing, setCameraFacing] = useState("back");
    const [permission, requestPermission] = useCameraPermissions();

    const showToast = (message) => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    };

    const handleReceivedData = (data) => {
        if (data.trim() === store.junctionCommand) {
            if (store.currentJunction === 30) {
                store.setIsGameFinished(true);
            } else {
                store.setInJunction(true);
            }
        }
    };

    const listenForData = async (device) => {
        device.onDataReceived((data) => {
            showToast(`Received: ${data.data}`);
            handleReceivedData(data.data);
        });
    };

    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    }, []);

    useEffect(() => {
        setCameraFacing(store.cameraFacing || "back");
    }, [store.cameraFacing]);

    useEffect(() => {
        setCameraKey((prevKey) => prevKey + 1);
    }, [isFocused]);

    useEffect(() => {
        if (store.connectedDevice) {
            listenForData(store.connectedDevice);
        }
    }, []);

    useEffect(() => {
        if (store.inJunction === true) {
            showToast("You have reached junction " + store.currentJunction);
            if (store.playerToMove === "player1") {
                router.replace("/temproute1", {
                    nextRoute: "/player1",
                });
            } else {
                router.replace("/temproute2", {
                    nextRoute: "/player2",
                });
            }
        }
    }, [store.inJunction]);

    useEffect(() => {
        if (store.isGameFinished) {
            if (store.playerToMove === "player1") {
                store.setWinner(store.player2Name);
            } else {
                store.setWinner(store.player1Name);
            }
            router.replace("/gameover");
        }
    }, [store.isGameFinished]);

    return (
        <View className="flex-1 w-full h-full">
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <View className="flex-1">
                <CameraView
                    style={{ flex: 1 }}
                    key={cameraKey}
                    facing={cameraFacing}
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr"],
                    }}
                >
                    <View className="flex-1 px-2 py-4">
                        <Toolbar />
                        <View className="flex-1 justify-between">
                            <View className="flex h-12 items-center justify-center">
                                <Text className="text-xl text-slate-400">
                                    Waiting to reach a junction...
                                </Text>
                            </View>
                            <View className="flex-row justify-end items-center gap-2">
                                <Button
                                    onPress={() => store.setInJunction(true)}
                                    title="Set Junction True"
                                />
                                <Button
                                    onPress={() =>
                                        store.setIsGameFinished(true)
                                    }
                                    title="Finish Game"
                                />
                            </View>
                        </View>
                    </View>
                </CameraView>
            </View>
        </View>
    );
};

export default WaitingPage;

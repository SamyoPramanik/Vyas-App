import { View, Text, ToastAndroid, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack } from "expo-router";
import Toolbar from "../components/Toolbar";
import useSecureStorage from "../utils/store";
import { Button } from "react-native";

const WaitingPage = () => {
    const store = useSecureStorage();
    const [device, setDevice] = useState(null);

    const showToast = (message) => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    };

    const handleReceivedData = (data) => {
        if (data === store.junctionCommand) {
            store.setInJunction(true);
            showToast("You have reached a junction!");
        } else if (data === store.finishCommand) {
            store.setIsGameFinished(true);
        }
    };

    const listenForData = async (device) => {
        device.onDataReceived((data) => {
            console.log(`Received: ${data.data}`);
            handleReceivedData(data.data);
        });
    };

    useEffect(() => {
        setDevice(store.connectedDevice);
    }, []);

    useEffect(() => {
        if (device) {
            listenForData(device);
        }
    }, [device]);

    useEffect(() => {
        if (store.inJunction === true) {
            showToast("You have reached a junction!");
            if (store.playerToMove === "player1") {
                router.replace("/player1", {
                    key: store.player1Name,
                });
            } else {
                router.replace("/player2", {
                    key: store.player2Name,
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
        <SafeAreaView className="flex-1 p-6 box-border">
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <Toolbar />
            <View className="flex h-12 items-center justify-center">
                <Text className="text-xl">Waiting to reach a junction...</Text>
            </View>
            <Button
                onPress={() => store.setInJunction(true)}
                title="Set Junction True"
            />
            <Button
                onPress={() => store.setIsGameFinished(true)}
                title="Finish Game"
            />
        </SafeAreaView>
    );
};

export default WaitingPage;

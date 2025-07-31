import { View, Text, TouchableOpacity, ToastAndroid } from "react-native";
import React, { useEffect, useState } from "react";
import Toolbar from "../components/Toolbar";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack } from "expo-router";
import useSecureStorage from "../utils/store";
import SingleCard from "../components/SingleCard";

const CardsPage = () => {
    const store = useSecureStorage();
    const [player1Cards, setPlayer1Cards] = useState([]);
    const [player2Cards, setPlayer2Cards] = useState([]);

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
    };

    useEffect(() => {
        setPlayer1Cards(store.player1CurrentCards);
        setPlayer2Cards(store.player2CurrentCards);
    }, []);

    const handleContinue = () => {
        sendCommand("T"); //T for autonomous mode
        router.replace("/waiting");
    };

    return (
        <SafeAreaView className="flex-1 px-2 box-border w-full h-full bg-black">
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <Toolbar />
            <View className="flex w-full gap-4">
                <View className="flex items-center gap-6">
                    <View className="flex w-1/2">
                        <View className="flex w-full items-center">
                            <Text className="text-xl">
                                <Text className="font-bold text-slate-400">{`${store.player1Name}`}</Text>
                                {` cards`}
                            </Text>
                        </View>
                        <View className="flex-row w-full gap-1">
                            {player1Cards.map((card, index) => (
                                <View key={index} className="flex w-1/4">
                                    <SingleCard
                                        id={index + 1}
                                        name={card}
                                        height="h-80"
                                    />
                                </View>
                            ))}
                        </View>
                    </View>
                    {/* <View className="bg-slate-300 w-[1px]"></View> */}
                    <View className="flex w-1/2">
                        <View className="flex w-full items-center">
                            <Text className="text-xl">
                                <Text className="font-bold text-slate-400">{`${store.player2Name}`}</Text>
                                {` cards`}
                            </Text>
                        </View>
                        <View className="flex-row w-full gap-1">
                            {player2Cards.map((card, index) => (
                                <View key={index} className="flex w-1/4">
                                    <SingleCard
                                        id={index + 1}
                                        name={card}
                                        height="h-80"
                                    />
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
                <View className="flex items-center w-full">
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={handleContinue}
                        className="flex items-center py-3 px-4 w-1/2 bg-blue-500 rounded-lg"
                    >
                        <Text className="text-white font-bold">Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default CardsPage;

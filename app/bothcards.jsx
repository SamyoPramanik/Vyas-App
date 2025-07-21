import { View, Text, TouchableOpacity } from "react-native";
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

    useEffect(() => {
        setPlayer1Cards(store.player1CurrentCards);
        setPlayer2Cards(store.player2CurrentCards);
    }, []);

    const handleContinue = () => {
        router.replace("/waiting");
    };

    return (
        <SafeAreaView className="flex-1 px-2 box-border w-full h-full">
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <Toolbar />
            <View className="flex w-full gap-2">
                <View className="flex flex-row">
                    <View className="flex w-1/2">
                        <View className="flex w-full items-center">
                            <Text className="text-xl">
                                <Text className="font-bold">{`${store.player1Name}`}</Text>
                                {` cards`}
                            </Text>
                        </View>
                        <View className="flex-row w-full">
                            {player1Cards.map((card, index) => (
                                <View key={index} className="flex w-1/4">
                                    <SingleCard
                                        id={index + 1}
                                        name={card}
                                        currentCard={10}
                                        currentCard2={10}
                                    />
                                </View>
                            ))}
                        </View>
                    </View>
                    <View className="bg-slate-300 w-[1px]"></View>
                    <View className="flex w-1/2">
                        <View className="flex w-full items-center">
                            <Text className="text-xl">
                                <Text className="font-bold">{`${store.player2Name}`}</Text>
                                {` cards`}
                            </Text>
                        </View>
                        <View className="flex-row w-full">
                            {player2Cards.map((card, index) => (
                                <View key={index} className="flex w-1/4">
                                    <SingleCard
                                        id={index + 1}
                                        name={card}
                                        currentCard={10}
                                        currentCard2={10}
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
                        className="flex items-center py-2 px-4 w-1/2 bg-blue-500 rounded-lg"
                    >
                        <Text className="text-white font-bold">Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default CardsPage;

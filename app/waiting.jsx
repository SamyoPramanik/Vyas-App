import { View, Text, ToastAndroid, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack } from "expo-router";
import Toolbar from "../components/Toolbar";
import useSecureStorage from "../utils/store";
import { Button } from "react-native";

const WaitingPage = () => {
    const store = useSecureStorage();

    const showToast = (message) => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    };

    useEffect(() => {
        if (store.inJunction === true) {
            showToast("You have reached a junction!");
            if (store.playerToMove === "player1") {
                router.replace("/player1");
            } else {
                router.replace("/player2");
            }
        }
    }, [store.inJunction]);

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
        </SafeAreaView>
    );
};

export default WaitingPage;

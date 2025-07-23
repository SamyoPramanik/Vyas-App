import { View, Text, ToastAndroid, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack } from "expo-router";
import Toolbar from "../components/Toolbar";
import useSecureStorage from "../utils/store";
import SingleCard from "../components/SingleCard";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
import Player from "../components/Player";

const Player1 = () => {
    const isFocused = useIsFocused();
    const [cameraKey, setCameraKey] = useState(0);
    const store = useSecureStorage();
    // Force remount camera when screen gets focused
    useEffect(() => {
        if (isFocused) {
            setCameraKey((prev) => prev + 1);
        }
    }, [isFocused]);
    return (
        <SafeAreaView className="flex-1 px-2 box-border">
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <Toolbar />
            <Player
                storeMyCards={store.player1CurrentCards}
                playerName={store.player1Name}
                playerToMove={"player1"}
                playerNewCardRoute="/player1newcard"
                cameraKey={cameraKey}
            />
        </SafeAreaView>
    );
};

export default Player1;

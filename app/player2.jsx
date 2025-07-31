import { View, Text, ToastAndroid, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack, useLocalSearchParams } from "expo-router";
import Toolbar from "../components/Toolbar";
import useSecureStorage from "../utils/store";
import SingleCard from "../components/SingleCard";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
import Player from "../components/Player";

const Player2 = () => {
    const { key } = useLocalSearchParams();

    const store = useSecureStorage();
    const isFocused = useIsFocused();
    const [cameraKey, setCameraKey] = useState(0);
    // Force remount camera when screen gets focused
    useEffect(() => {
        if (isFocused) {
            setCameraKey((prev) => prev + 1);
        }
    }, [isFocused]);
    return (
        <View className="flex-1 w-full h-full box-border bg-black">
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <Player
                storeMyCards={store.player2CurrentCards}
                playerName={store.player2Name}
                playerToMove={"player2"}
                playerNewCardRoute="/player2newcard"
                cameraKey={cameraKey}
                key={key}
            />
        </View>
    );
};

export default Player2;

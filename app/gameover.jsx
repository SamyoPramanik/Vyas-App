import {
    PermissionsAndroid,
    Platform,
    Text,
    Touchable,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import useSecureStorage from "../utils/store";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
    duration: 2000, // Duration in milliseconds
    fade: true,
});

export default function GameOver() {
    const store = useSecureStorage();
    const [winner, setWinner] = useState("");

    useEffect(() => {
        if (store.isGameFinished) {
            // Show game over screen
            setWinner(store.winner);
        }
    }, []);

    return (
        <SafeAreaView className="flex-1">
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <View className="flex-1 items-center justify-center">
                <Text className="text-3xl font-bold">Game over!!!</Text>
                <Text className="text-4xl mt-4">
                    Winner: {winner || "No winner yet"}
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        router.replace("/");
                    }}
                    className="mt-6 p-4 bg-blue-500 rounded-lg"
                    activeOpacity={0.7}
                >
                    <Text className="text-lg w-full px-6 text-white font-bold">
                        Play Again
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

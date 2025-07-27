import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import useSecureStorage from "../utils/store";

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
        <SafeAreaView className="flex-1 bg-black">
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <View className="flex-1 items-center justify-center">
                <Text className="text-3xl text-slate-400 font-bold">
                    Game over!!!
                </Text>
                <Text className="text-4xl mt-4 text-slate-400">
                    Winner: {winner || "No winner yet"}
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        router.replace("/names");
                    }}
                    className="mt-6 p-4 bg-blue-500 rounded-lg"
                    activeOpacity={0.7}
                >
                    <Text className="text-lg w-full px-6 text-white font-semibold">
                        Play Again
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

import { Text, TouchableOpacity, View, Image } from "react-native";
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
        <SafeAreaView className="flex-1 bg-gray-900">
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <View className="flex-1 items-center justify-center relative">
                <Image
                    source={require('../assets/images/confetti.png')}
                    className="rounded-lg absolute z-10"
                    style={{
                        top: 100,
                        right: 400,
                        transform: [{ scale: 1.5 }],
                        opacity: 0.06,
                        zIndex:-1
                    }}
                />
                <Text className="text-3xl text-slate-100 font-bold ">
                    Game Over
                </Text>
                <Text className="text-4xl mt-4 text-slate-400">
                    {winner || "No winner yet"} won
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        router.replace("/names");
                    }}
                    className="mt-6 p-4 bg-cyan-950 rounded-lg"
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

import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";

const TempRoute = () => {
    useEffect(() => {
        setTimeout(() => {
            router.replace("/player1");
        }, 300);
    }, []);

    return (
        <View className="flex-1 bg-black">
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
        </View>
    );
};

export default TempRoute;

import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { router } from "expo-router";

const Toolbar = () => {
    return (
        <View className="flex-row gap-4 items-end justify-end h-12">
            <TouchableOpacity
                onPress={() => {
                    router.push("/bluetooth");
                }}
                activeOpacity={0.5}
            >
                <Image
                    source={require("../assets/images/connection.png")}
                    style={{ width: 24, height: 24 }}
                />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    router.push("/settings");
                }}
                activeOpacity={0.5}
            >
                <Image
                    source={require("../assets/images/settings.png")}
                    style={{ width: 24, height: 24 }}
                />
            </TouchableOpacity>
        </View>
    );
};

export default Toolbar;

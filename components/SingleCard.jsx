import { View, Text } from "react-native";
import React from "react";

const SingleCard = ({ id, name }) => {
    return (
        <View className="flex w-1/4 p-1 items-center justify-center">
            <View className="flex items-center justify-center bg-sky-200 rounded-xl w-full h-60 mb-2">
                <Text className="text-2xl font-white font-bold">{id}</Text>
            </View>
            <Text className="text-sm">{name}</Text>
        </View>
    );
};

export default SingleCard;

import { View, Text } from "react-native";
import React from "react";

const SingleCard = ({ id, name, currentCard, currentCard2 }) => {
    const setCardColor = () => {
        if (id === currentCard + 1) {
            return "bg-sky-500";
        }
        if (id === currentCard2 + 1) {
            return "bg-sky-400";
        }
        return "bg-sky-200";
    };
    return (
        <View className="flex w-full p-1 items-center justify-center">
            <View
                className={`flex items-center justify-center ${setCardColor()} rounded-xl w-full h-60 mb-2`}
            >
                <Text className="text-2xl font-white font-bold">{id}</Text>
            </View>
            <Text className="text-sm">{name}</Text>
        </View>
    );
};

export default SingleCard;

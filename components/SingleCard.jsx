import { View, Text } from "react-native";
import React from "react";
import { actionCards, powerCards } from "../utils/constants";

const SingleCard = ({ id, name, height }) => {
    const setCardColor = () => {
        for (const card of actionCards) {
            if (card === name) {
                console.log(name, "action card");
                return "bg-[#d8ead2]";
            }
        }

        for (const card of powerCards) {
            if (card === name) {
                return "bg-[#dad2e9]";
            }
        }
        return "bg-[#f0f0f0]";
    };

    return (
        <View className="flex w-full p-1 items-center justify-center">
            <View
                className={`flex items-center justify-center rounded-xl w-full ${height} mb-1 ${setCardColor()}`}
            >
                <Text className="text-2xl font-white font-bold">{id}</Text>
            </View>
            <Text
                className="text-md text-slate-400"
                style={{
                    textShadowColor: "#000",
                    textShadowOffset: { width: -1, height: 1 },
                    textShadowRadius: 1,
                }}
            >
                {name}
            </Text>
        </View>
    );
};

export default SingleCard;

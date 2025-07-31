import { View, Text, ImageBackground } from "react-native";
import React from "react";
import { actionCards, powerCards } from "../utils/constants";

const SingleCard = ({ id, name, height, currentCard }) => {
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

    const getCurrentCardUi = () => {
        if (currentCard === id) {
            return "scale-110";
        }
        return "scale-100";
    };

    const getImageSource = () => {
        switch (id) {
            case 1:
                return require("../assets/images/1.png");
            case 2:
                return require("../assets/images/2.png");
            case 3:
                return require("../assets/images/3.png");
            default:
                return require("../assets/images/4.png");
        }
    };

    return (
        <View
            className={`flex w-full p-1 items-center justify-center ${getCurrentCardUi()}`}
        >
            <ImageBackground
                className={`flex items-center justify-center rounded-xl w-full ${height} mb-1 ${setCardColor()}`}
                source={getImageSource()}
            ></ImageBackground>
            <Text
                className="text-md text-slate-400 scale-125"
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

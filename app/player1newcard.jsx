import { View, Text, ToastAndroid, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack } from "expo-router";
import Toolbar from "../components/Toolbar";
import useSecureStorage from "../utils/store";

import PlayerNewCard from "../components/PlayerNewCard";

const Player1NewCard = () => {
    const store = useSecureStorage();
    const [currentCards, setCurrentCards] = useState(
        store.getPlayer1CurrentCards()
    );

    const updateCurrentCards = (cards) => {
        store.setPlayer1CurrentCards(cards);
    };

    const updateMyMoves = (card) => {
        store.setPlayer1Moves((prev) => [...prev, card]);
    };

    useEffect(() => {
        const fetchCards = async () => {
            const cards = await store.getPlayer1CurrentCards();
            setCurrentCards(cards);
        };
        fetchCards();
    }, []);
    return (
        <SafeAreaView className="flex-1 px-2 box-border">
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <Toolbar />
            <PlayerNewCard
                player="player1"
                playerName={store.player1Name}
                otherPlayer="player2"
                playerRoute="/player1"
                otherPlayerRoute="/player2"
                playerCurrentCards={currentCards}
                setPlayerCurrentCards={updateCurrentCards}
                updateMyMoves={updateMyMoves}
            />
        </SafeAreaView>
    );
};

export default Player1NewCard;

import { View, Text, ToastAndroid, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack } from "expo-router";
import Toolbar from "../components/Toolbar";
import useSecureStorage from "../utils/store";

import PlayerNewCard from "../components/PlayerNewCard";

const Player2NewCard = () => {
    const store = useSecureStorage();
    const [currentCards, setCurrentCards] = useState(
        store.getPlayer2CurrentCards()
    );

    const updateCurrentCards = (cards) => {
        store.setPlayer2CurrentCards(cards);
    };

    const updateMyMoves = (card) => {
        const player2Moves = store.player2Moves;
        store.setPlayer2Moves([...player2Moves, card]);
    };

    useEffect(() => {
        const fetchCards = async () => {
            const cards = await store.getPlayer2CurrentCards();
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
                player="player2"
                playerName={store.player2Name}
                otherPlayer="player1"
                playerRoute="/player2"
                otherPlayerRoute="/player1"
                playerCurrentCards={currentCards}
                setPlayerCurrentCards={updateCurrentCards}
                updateMyMoves={updateMyMoves}
            />
        </SafeAreaView>
    );
};

export default Player2NewCard;

import React, { useEffect, useState } from "react";
import { SafeAreaView, ToastAndroid } from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import useSecureStorage from "../utils/store";
import Player from "../components/Player";
import { findAction, isValidMove, addAction, randomActionCard, genNewCard } from "../utils/functions";

const PlayerScreen = () => {
    const { key, player } = useLocalSearchParams();
    const isFocused = useIsFocused();
    const [cameraKey, setCameraKey] = useState(0);
    const store = useSecureStorage();

    const currentPlayer = store.playerToMove;
    const isPlayer2 = currentPlayer === "player2";
    const playerName = isPlayer2 ? store.player2Name : store.player1Name;
    const [myCards, setMyCards] = useState(isPlayer2 ? store.getPlayer2CurrentCards() : store.getPlayer1CurrentCards());
    const [currentCard, setCurrentCard] = useState("");
    const [currentCard2, setCurrentCard2] = useState("");
    const [currentCardId, setCurrentCardId] = useState(4);
    const [currentCard2Id, setCurrentCard2Id] = useState(4);
    const [showNewCardUI, setShowNewCardUI] = useState(false);
    const [newCard1, setNewCard1] = useState("");
    const [newCard2, setNewCard2] = useState("");
    const [action, setAction] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [confirmMove, setConfirmMove] = useState(false);
    const [showBlock, setShowBlock] = useState(false);

    useEffect(() => {
        if (isFocused) {
            setCameraKey((prev) => prev + 1);
        }
    }, [isFocused]);

    useEffect(() => {
        if (isPlayer2) {
            setMyCards(store.getPlayer2CurrentCards());
        } else {
            setMyCards(store.getPlayer1CurrentCards());
        }
    }, [isPlayer2, store.player1CurrentCards, store.player2CurrentCards]);

    const showToast = (message) => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    };

    const getCommand = (commandName) => {
        if (commandName === "forward") return store.forwardCommand;
        if (commandName === "backward") return store.backwardCommand;
        if (commandName === "left") return store.leftCommand;
        if (commandName === "right") return store.rightCommand;
        return "";
    };

    const sendCommand = async (command) => {
        if (store.connectedDevice && command) {
            try {
                await store.connectedDevice.write(command + "\n");
                showToast(`Sent: ${command}`);
            } catch (err) {
                showToast(`Send failed: ${err}`);
            }
        }
    };

    const handleQrCode = (data) => {
        const idx = parseInt(data);
        if (idx > 3) {
            showToast("Invalid QR code");
            setCurrentCard("");
            setCurrentCard2("");
            setCurrentCardId(4);
            setCurrentCard2Id(4);
            return;
        }
        const card = myCards[idx];
        if (card === undefined) {
            showToast("Invalid card selected");
            return;
        }
        if (card === "block" || card === "ban") {
            setCurrentCard(card);
            setCurrentCardId(idx);
            setCurrentCard2("");
            setCurrentCard2Id(4);
            setShowNewCardUI(false);
        } else if (
            (currentCard === "block" || currentCard === "ban") &&
            (card === "forward" || card === "backward" || card === "left" || card === "right")) {

            setCurrentCard2(card);
            setCurrentCard2Id(idx);
            setShowNewCardUI(true);
        } else {
            setCurrentCard(card);
            setCurrentCard2("");
            setCurrentCardId(idx);
            setCurrentCard2Id(4);
            setShowNewCardUI(true);
        }
    };
    useEffect(() => {
        if (store.currentJunction === 30 || store.currentJunction === 31) {
            store.setIsGameFinished(true);
            if (store.playerToMove === "player1") {
                store.setWinner(store.player2Name);
            } else {
                store.setWinner(store.player1Name);
            }
            router.replace("/gameover");
        }
    }, [store.currentJunction]);

    useEffect(() => {
        if (!showNewCardUI) return;
        let tempaction = "";
        if (currentCard === "skip") {
            setAction("");
            setConfirmMove(true);

            return;
        }
        tempaction = findAction(currentPlayer, currentCard, currentCard2, store.currentJunction);
        if (!isValidMove(tempaction, currentPlayer, true)) {
            setShowNewCardUI(false);
            return;
        }
        addAction(currentPlayer, currentCard, currentCard2, tempaction);
        setAction(tempaction);
        setConfirmMove(true);
    }, [showNewCardUI]);

    useEffect(() => {
        if (!showNewCardUI || !confirmMove) return;
        const card1 = genNewCard(currentCard);
        setNewCard1(card1);
        const updated = [...myCards];
        updated[currentCardId] = card1;
        if (currentCard === "block" || currentCard === "ban") {
            const card2 = randomActionCard();
            setNewCard2(card2);
            updated[currentCard2Id] = card2;
        }
        setMyCards(updated);
        if (isPlayer2) store.setPlayer2CurrentCards(updated);
        else store.setPlayer1CurrentCards(updated);

        if (currentCard !== "skip") {
            const command = getCommand(action);
            console.log("Sending Command : " + command);
            sendCommand(command);
        } else {
            showToast("You skipped this turn.");
        }
    }, [confirmMove]);

    return (
        <SafeAreaView className="flex-1 w-full h-full box-border bg-gray-900">
            <Stack.Screen options={{ headerShown: false }} />
            <Player
                myCards={myCards}
                storeMyCards={setMyCards}
                playerName={playerName}
                playerToMove={player}
                cameraKey={cameraKey}
                key={key}
                onQrCode={handleQrCode}
                showNewCardUI={showNewCardUI}
                newCard1={newCard1}
                newCard2={newCard2}
                currentCardId={currentCardId}
                currentCard2Id={currentCard2Id}
                isLoading={isLoading}
                onContinue={() => {
                    if (currentCard !== "block" && validMoveExists) {
                        if (isPlayer2) {
                            store.setPlayer2CurrentCards([...myCards]);
                            store.setPlayerToMove("player1");
                        } else {
                            store.setPlayer1CurrentCards([...myCards]);
                            store.setPlayerToMove("player2");
                        }
                    } else {
                        if (isPlayer2) {
                            store.setPlayer2CurrentCards([...myCards]);
                            store.setPlayerToMove("player1");
                            setShowBlock(true);
                            setTimeout(() => {
                                setShowBlock(false);
                                store.setPlayer1CurrentCards([...myCards]);
                                store.setPlayerToMove("player2");
                            }, 2000);
                        } else {
                            store.setPlayer1CurrentCards([...myCards]);
                            store.setPlayerToMove("player2");
                            setShowBlock(true);
                            setTimeout(() => {
                                setShowBlock(false);
                                store.setPlayer2CurrentCards([...myCards]);
                                store.setPlayerToMove("player1");
                            }, 2000);
                        }

                    }
                    setShowNewCardUI(false);
                    setCurrentCard("");
                    setCurrentCard2("");
                    setCurrentCardId(4);
                    setCurrentCard2Id(4);
                    setNewCard1("");
                    setNewCard2("");
                    setAction("");
                    setConfirmMove(false);
                }}
                showBlock={showBlock}
                handleNoValidMove={() => {
                    // when no card can result in valid move. To prevent this kind of situation, we have to check all the possibilities beforehand and I fear that might be expensive enough that a seperate button to call such exception might be better option. In future, I might try to implement that :) 
                    showToast("Oopsie... Better luck next time.");
                    if (isPlayer2) {
                        store.setPlayer2CurrentCards([...myCards]);
                        store.setPlayerToMove("player1");
                    } else {
                        store.setPlayer1CurrentCards([...myCards]);
                        store.setPlayerToMove("player2");
                    }
                }}
            />
        </SafeAreaView>
    );
};

export default PlayerScreen;
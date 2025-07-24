import { create } from "zustand";

const useSecureStorage = create((set, get) => ({
    player1Moves: [],
    player2Moves: [],
    player1Name: "",
    player2Name: "",
    connectedDevice: null,
    player1CurrentCards: [],
    player2CurrentCards: [],
    recentMoves: [],
    isGameFinished: false,
    winner: "",
    forwardCommand: "f",
    backwardCommand: "b",
    leftCommand: "l",
    rightCommand: "r",
    junctionCommand: "junction",
    finishCommand: "finish",
    playerToMove: "player1",
    cameraFacing: "back",
    inJunction: false,
    currentJunction: 0,
    currentCard: "",
    currentCard2: "",
    currentCardId: 40,
    currentCard2Id: 40,
    cardVisible: false,
    setPlayer1Moves: (moves) => set({ player1Moves: moves }),
    setPlayer2Moves: (moves) => set({ player2Moves: moves }),
    setPlayer1Name: (name) => set({ player1Name: name }),
    setPlayer2Name: (name) => set({ player2Name: name }),
    setConnectedDevice: (device) => set({ connectedDevice: device }),
    setPlayer1CurrentCards: (cards) => set({ player1CurrentCards: cards }),
    setPlayer2CurrentCards: (cards) => set({ player2CurrentCards: cards }),
    setIsGameFinished: (isFinished) => set({ isGameFinished: isFinished }),
    setWinner: (winner) => set({ winner }),
    setRecentMoves: (moves) => set({ recentMoves: moves }),
    setForwardCommand: (command) => set({ forwardCommand: command }),
    setBackwardCommand: (command) => set({ backwardCommand: command }),
    setLeftCommand: (command) => set({ leftCommand: command }),
    setRightCommand: (command) => set({ rightCommand: command }),
    setJunctionCommand: (command) => set({ junctionCommand: command }),
    setFinishCommand: (command) => set({ finishCommand: command }),
    setPlayerToMove: (player) => set({ playerToMove: player }),
    setCameraFacing: (facing) => set({ cameraFacing: facing }),
    setInJunction: (inJunction) => set({ inJunction }),
    setCurrentJunction: (junction) => set({ currentJunction: junction }),
    setCurrentCard: (card) => set({ currentCard: card }),
    setCurrentCard2: (card) => set({ currentCard2: card }),
    setCurrentCardId: (id) => set({ currentCardId: id }),
    setCurrentCard2Id: (id) => set({ currentCard2Id: id }),
    getPlayer1CurrentCards: () => get().player1CurrentCards,
    getPlayer2CurrentCards: () => get().player2CurrentCards,
    setCardVisible: (visible) => set({ cardVisible: visible }),
    addRecentMove: (move) =>
        set((state) => ({
            recentMoves: [...state.recentMoves, move],
        })),
    addPlayer1Move: (move) =>
        set((state) => ({
            player1Moves: [...state.player1Moves, move],
        })),
    addPlayer2Move: (move) =>
        set((state) => ({
            player2Moves: [...state.player2Moves, move],
        })),

    resetStore: () =>
        set({
            player1Moves: [],
            player2Moves: [],
            player1Name: "",
            player2Name: "",
            connectedDevice: null,
        }),
}));

export default useSecureStorage;

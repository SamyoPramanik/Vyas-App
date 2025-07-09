import {
    View,
    Text,
    ToastAndroid,
    Touchable,
    TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import Toolbar from "../components/Toolbar";
import useSecureStorage from "../utils/store";
import SingleCard from "../components/SingleCard";
import { CameraView, useCameraPermissions } from "expo-camera";

const Player1 = () => {
    const store = useSecureStorage();
    const [myCards, setMyCards] = useState([]);
    const [qrCodeData, setQrCodeData] = useState("");
    const [permission, requestPermission] = useCameraPermissions();

    const showToast = (message) => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    };

    useEffect(() => {
        // Set myCards from store
        setMyCards(store.player1CurrentCards || []);
    }, []);
    return (
        <SafeAreaView className="flex-1 p-6 box-border">
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <Toolbar />
            <View className="flex h-12 items-center justify-center">
                <Text className="text-xl">
                    <Text className="font-bold">{`${store.player1Name}`}</Text>
                    {`'s turn`}
                </Text>
            </View>
            <View className="flex-row items-center justify-between">
                {myCards.map((card, index) => (
                    <SingleCard key={index} id={index + 1} name={card} />
                ))}
            </View>
            <View className="flex-1">
                {permission?.granted ? (
                    <CameraView
                        className="flex"
                        facing="back"
                        barcodeScannerSettings={{
                            barcodeTypes: ["qr"],
                        }}
                        onBarcodeScanned={({ data }) => {
                            setQrCodeData(data);
                        }}
                    >
                        <View className="flex h-full"></View>
                    </CameraView>
                ) : (
                    <TouchableOpacity>
                        <Text
                            className="text-lg text-blue-500"
                            onPress={requestPermission}
                        >
                            Grant Camera Permission
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

export default Player1;

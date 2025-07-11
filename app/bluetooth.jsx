import {
    View,
    Text,
    ToastAndroid,
    FlatList,
    Touchable,
    TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import useSecureStorage from "../utils/store";
import RNBluetoothClassic from "react-native-bluetooth-classic";

const BlueToothPage = () => {
    const store = useSecureStorage();
    const [devices, setDevices] = useState([]);

    const showToast = (message) => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    };

    useEffect(() => {
        (async () => {
            try {
                const pairedDevices =
                    await RNBluetoothClassic.getBondedDevices();
                setDevices(pairedDevices);
            } catch (error) {
                console.error("Error fetching paired devices:", error);
            }
        })();
    }, []);

    const connectToDevice = async (device) => {
        try {
            const success = await device.connect();
            if (success) {
                store.setConnectedDevice(device);
                showToast(`Connected to ${device.name}`);
            } else {
                showToast(`Failed to connect to ${device.name}`);
            }
        } catch (err) {
            showToast(`Connection error: ${err}`);
        }
    };

    return (
        <SafeAreaView className="flex-1 box-border">
            <Stack.Screen
                options={{
                    title: "Bluetooth Devices",
                }}
            />
            <View className="flex">
                <FlatList
                    data={devices}
                    keyExtractor={(item) => item.address}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            className="flex border-b border-gray-300 py-4 px-2 w-full"
                            onPress={() => connectToDevice(item)}
                            activeOpacity={0.7}
                        >
                            <Text>{item.name}</Text>{" "}
                        </TouchableOpacity>
                    )}
                />
            </View>
        </SafeAreaView>
    );
};

export default BlueToothPage;

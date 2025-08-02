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
        <SafeAreaView className="flex-1 box-border bg-gray-900">
            <Stack.Screen
                name="BluetoothDevices"
                options={{
                    title: "Bluetooth Devices",
                    headerStyle: {
                        backgroundColor: '#1e293b', // e.g., slate-800
                    },
                    headerTintColor: '#f1f5f9',   // text/icon color (e.g., slate-100)
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />
            <View className="flex">
                <FlatList
                    data={devices}
                    keyExtractor={(item) => item.address}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            className="flex border-b bg-gray-800 py-4 px-2 w-full"
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

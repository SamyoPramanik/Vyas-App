import {
    ScrollView,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import useSecureStorage from "../utils/store";
import Toolbar from "../components/Toolbar";

export default function ConfigPage() {
    const [log, setLog] = useState([]);
    const commands = [
        "R",
        "L",
        "F",
        "S",
        "B",
        "C",
        "K",
        "I",
        "D",
        "P",
        "Q",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        "T",
    ];
    const store = useSecureStorage();

    const showToast = (message) => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    };

    const sendCommand = async (command) => {
        showToast(`Sending command: ${command}`);
        setLog((prev) => [...prev, `Sent: ${command}`]);
        if (store.connectedDevice && command) {
            try {
                await store.connectedDevice.write(command + "\n");
                showToast(`Sent: ${command}`);
            } catch (err) {
                showToast(`Send failed: ${err}`);
            }
        }
    };

    const listenForData = async (device) => {
        device.onDataReceived((data) => {
            showToast(`Received: ${data.data}`);
            setLog((prev) => [...prev, `Received: ${data.data}`]);
        });
    };

    useEffect(() => {
        if (store.connectedDevice) {
            listenForData(store.connectedDevice);
        }
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-black">
            <Stack.Screen
                options={{
                    headerTitle: () => (
                        <View className="flex-row items-center justify-between">
                            <Text className="text-slate-400 font-semibold text-xl">
                                Configuration
                            </Text>
                            <Toolbar />
                        </View>
                    ),
                    headerStyle: {
                        backgroundColor: "#000",
                    },
                    headerTitleStyle: {
                        color: "#94a3b8",
                    },
                    headerTintColor: "#94a3b8",
                }}
            />
            <View className="flex-row flex-wrap gap-3 items-center justify-center -mt-5">
                {commands.map((command) => (
                    <Button
                        key={command}
                        command={command}
                        sendCommand={sendCommand}
                    />
                ))}
            </View>
            <View className="flex-1 p-4">
                <Text className="text-slate-400 font-semibold mb-2">
                    Command Log
                </Text>
                <ScrollView
                    className="bg-gray-800 rounded-lg p-3"
                    contentContainerStyle={{ paddingBottom: 20 }}
                >
                    {log.map((entry, index) => (
                        <Text key={index} className="text-slate-400 mb-1">
                            {`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} ${entry}`}
                        </Text>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const Button = ({ command, sendCommand }) => {
    return (
        <TouchableOpacity
            onPress={() => sendCommand(command)}
            className="bg-blue-500 text-white w-10 h-12 items-center justify-center rounded-md"
            activeOpacity={0.7}
        >
            <Text className="text-white text-lg font-bold">{command}</Text>
        </TouchableOpacity>
    );
};

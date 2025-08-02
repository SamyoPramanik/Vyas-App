import {
    KeyboardAvoidingView,
    ScrollView,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";
import useSecureStorage from "../utils/store";
import Toolbar from "../components/Toolbar";
import { TextInput } from "react-native";

export default function ConfigPage() {
    const scrollViewRef = useRef(null);
    const [log, setLog] = useState([]);
    const [textInput, setTextInput] = useState("");
    const commands = [
        "R", //0
        "L", //1
        "F", //2
        "S", //3
        "B", //4
        "C", //5
        "K", //6
        "I", //7
        "D", //8
        "E", //9
        "T", //10
    ];
    const titles = [
        "Right", //0
        "Left", //1
        "Forward", //2
        "Slow", //3
        "Break", //4
        "Calibrate", //5
        "Info", //6
        "M+", //7
        "M-", //8
        "Eprom", //9
        "Switch", //10
    ];
    const store = useSecureStorage();

    const showToast = (message) => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    };

    const sendCommand = async (command) => {
        // showToast(`Sending command: ${command}`);
        if (store.connectedDevice && command) {
            try {
                await store.connectedDevice.write(command + "\n");
                // showToast(`Sent: ${command}`);
                setLog((prev) => [...prev, `Sent: ${command}`]);
            } catch (err) {
                showToast(`Send failed: ${err}`);
            }
        }
    };

    const listenForData = async (device) => {
        device.onDataReceived((data) => {
            // showToast(`Received: ${data.data}`);
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
            <KeyboardAvoidingView behavior="padding" className="flex-1">
                <View className="flex-row flex-wrap gap-3 items-center justify-center -mt-5">
                    {commands.map((command, index) => (
                        <Button
                            key={index}
                            title={titles[index]}
                            command={command}
                            sendCommand={sendCommand}
                        />
                    ))}
                </View>
                <View className="flex-1 p-4 gap-1">
                    <Text className="text-slate-400 font-semibold">
                        Command Log
                    </Text>
                    <ScrollView
                        ref={scrollViewRef}
                        className="bg-gray-800 rounded-lg p-3 flex-1"
                        contentContainerStyle={{ paddingBottom: 20 }}
                        onContentSizeChange={() =>
                            scrollViewRef.current?.scrollToEnd({
                                animated: true,
                            })
                        }
                    >
                        {log.map((entry, index) => (
                            <Text key={index} className="text-slate-400 mb-1">
                                {`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} ${entry}`}
                            </Text>
                        ))}
                    </ScrollView>
                    <View className="flex flex-row items-center justify-center gap-1">
                        <TextInput
                            className="border border-slate-500 text-slate-400 rounded-lg p-2 flex-1"
                            placeholder="Type your command..."
                            value={textInput}
                            onChangeText={(text) => setTextInput(text)}
                        />
                        <TouchableOpacity
                            className="bg-blue-500 rounded-lg p-2"
                            onPress={() => {
                                sendCommand(textInput);
                                setTextInput("");
                            }}
                        >
                            <Text className="text-white text-lg font-bold">
                                Send
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const Button = ({ command, sendCommand, title }) => {
    return (
        <TouchableOpacity
            onPress={() => sendCommand(command)}
            className="bg-blue-500 text-white px-2 h-12 items-center justify-center rounded-md"
            activeOpacity={0.7}
        >
            <Text className="text-white text-lg font-bold">{title}</Text>
        </TouchableOpacity>
    );
};

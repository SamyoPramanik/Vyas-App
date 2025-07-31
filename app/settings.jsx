import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ToastAndroid,
    ScrollView,
    Switch,
} from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import useSecureStorage from "../utils/store";
import { Picker } from "@react-native-picker/picker";

const SettingsPage = () => {
    const [settings, setSettings] = useState({
        forwardCommand: "f",
        backwardCommand: "b",
        leftCommand: "l",
        rightCommand: "r",
        junctionCommand: "junction",
        finishCommand: "finish",
        cameraFacing: "back",
        cardVisible: false,
    });
    const store = useSecureStorage();

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const forwardCommand =
                    (await SecureStore.getItemAsync("forwardCommand")) || "f";
                const backwardCommand =
                    (await SecureStore.getItemAsync("backwardCommand")) || "b";
                const leftCommand =
                    (await SecureStore.getItemAsync("leftCommand")) || "l";
                const rightCommand =
                    (await SecureStore.getItemAsync("rightCommand")) || "r";
                const junctionCommand =
                    (await SecureStore.getItemAsync("junctionCommand")) ||
                    "junction";
                const finishCommand =
                    (await SecureStore.getItemAsync("finishCommand")) ||
                    "finish";
                const cameraFacing =
                    (await SecureStore.getItemAsync("cameraFacing")) || "back";
                const cardVisible =
                    (await SecureStore.getItemAsync("cardVisible")) === "true";

                setSettings({
                    forwardCommand,
                    backwardCommand,
                    leftCommand,
                    rightCommand,
                    junctionCommand,
                    finishCommand,
                    cameraFacing,
                    cardVisible,
                });
            } catch (error) {
                console.error("Error loading settings:", error);
            }
        };

        loadSettings();
    }, []);

    const showToast = (message) => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    };

    const handleSaveSettings = async () => {
        try {
            store.setForwardCommand(settings.forwardCommand);
            store.setBackwardCommand(settings.backwardCommand);
            store.setLeftCommand(settings.leftCommand);
            store.setRightCommand(settings.rightCommand);
            store.setJunctionCommand(settings.junctionCommand);
            store.setFinishCommand(settings.finishCommand);
            store.setCameraFacing(settings.cameraFacing);
            store.setCardVisible(settings.cardVisible);

            await SecureStore.setItemAsync(
                "forwardCommand",
                settings.forwardCommand
            );
            await SecureStore.setItemAsync(
                "backwardCommand",
                settings.backwardCommand
            );
            await SecureStore.setItemAsync("leftCommand", settings.leftCommand);
            await SecureStore.setItemAsync(
                "rightCommand",
                settings.rightCommand
            );
            await SecureStore.setItemAsync(
                "junctionCommand",
                settings.junctionCommand
            );
            await SecureStore.setItemAsync(
                "finishCommand",
                settings.finishCommand
            );
            await SecureStore.setItemAsync(
                "cameraFacing",
                settings.cameraFacing
            );
            await SecureStore.setItemAsync(
                "cardVisible",
                settings.cardVisible.toString()
            );
            showToast("Settings saved successfully!");
        } catch (error) {
            console.error("Error saving settings:", error);
            showToast("Failed to save settings.");
        }
    };

    const handleInputChange = (key, value) => {
        setSettings((prevSettings) => ({
            ...prevSettings,
            [key]: value,
        }));
    };
    return (
        <SafeAreaView className="flex-1 w-full px-6 box-border bg-black">
            <Stack.Screen
                options={{
                    title: "Settings",
                    headerStyle: {
                        backgroundColor: "#000",
                    },
                    headerTitleStyle: {
                        color: "#94a3b8",
                    },
                    headerTintColor: "#94a3b8",
                }}
            />
            <ScrollView className="flex-1 w-full -mt-4">
                <View className="flex gap-1 w-1/2">
                    <View className="flex gap-1">
                        <Text className="font-semibold text-slate-400">
                            Forward Command
                        </Text>
                        <TextInput
                            onChangeText={(text) =>
                                handleInputChange("forwardCommand", text)
                            }
                            value={settings.forwardCommand}
                            className="border border-slate-500 text-slate-400 p-3 rounded-md mb-4"
                            placeholder="Forward Command"
                        />
                    </View>
                    <View className="flex gap-1">
                        <Text className="font-semibold text-slate-400">
                            Backward Command
                        </Text>
                        <TextInput
                            onChangeText={(text) =>
                                handleInputChange("backwardCommand", text)
                            }
                            value={settings.backwardCommand}
                            className="border border-slate-500 text-slate-400 p-3 rounded-md mb-4"
                            placeholder="Backward Command"
                        />
                    </View>
                    <View className="flex gap-1">
                        <Text className="font-semibold text-slate-400">
                            Left Command
                        </Text>
                        <TextInput
                            onChangeText={(text) =>
                                handleInputChange("leftCommand", text)
                            }
                            value={settings.leftCommand}
                            className="border border-slate-500 text-slate-400 p-3 rounded-md mb-4"
                            placeholder="Left Command"
                        />
                    </View>
                    <View className="flex gap-1">
                        <Text className="font-semibold text-slate-400">
                            Right Command
                        </Text>
                        <TextInput
                            onChangeText={(text) =>
                                handleInputChange("rightCommand", text)
                            }
                            value={settings.rightCommand}
                            className="border border-slate-500 text-slate-400 p-3 rounded-md mb-4"
                            placeholder="Right Command"
                        />
                    </View>
                    <View className="flex gap-1">
                        <Text className="font-semibold text-slate-400">
                            Junction Command
                        </Text>
                        <TextInput
                            onChangeText={(text) =>
                                handleInputChange("junctionCommand", text)
                            }
                            value={settings.junctionCommand}
                            className="border border-slate-500 text-slate-400 p-3 rounded-md mb-4"
                            placeholder="Junction Command"
                        />
                    </View>
                    <View className="flex gap-1">
                        <Text className="font-semibold text-slate-400">
                            Finish Command
                        </Text>
                        <TextInput
                            onChangeText={(text) =>
                                handleInputChange("finishCommand", text)
                            }
                            value={settings.finishCommand}
                            className="border border-slate-500 text-slate-400 p-3 rounded-md mb-4"
                            placeholder="Finish Command"
                        />
                    </View>
                    <View className="flex gap-1 flex-row items-center justify-between">
                        <Text className="text-lg font-semibold text-slate-400">
                            Card Visibility
                        </Text>
                        <Switch
                            value={settings.cardVisible}
                            onValueChange={(value) =>
                                handleInputChange("cardVisible", value)
                            }
                        />
                    </View>
                    <View className="flex gap-1">
                        <Text className="font-semibold text-slate-400">
                            Camera Facing
                        </Text>
                        <View className="border border-slate-500 text-slate-400 rounded-md">
                            <Picker
                                selectedValue={settings.cameraFacing}
                                onValueChange={(itemValue) =>
                                    handleInputChange("cameraFacing", itemValue)
                                }
                                style={{
                                    padding: 0,
                                    margin: 0,
                                    height: 50,
                                    backgroundColor: "#1f2937",
                                    color: "#94a3b8",
                                }}
                            >
                                <Picker.Item label="Back" value="back" />
                                <Picker.Item label="Front" value="front" />
                            </Picker>
                        </View>
                    </View>
                    <View className="flex mt-6 gap-1 items-end">
                        <TouchableOpacity
                            onPress={handleSaveSettings}
                            activeOpacity={0.7}
                            className="bg-blue-500 text-white w-full px-4 py-4 items-center justify-center rounded-md"
                        >
                            <Text className="text-white font-bold">
                                Save Settings
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                router.push("/config");
                            }}
                            activeOpacity={0.7}
                            className="bg-blue-500 text-white px-4 py-2 items-center justify-center rounded-md"
                        >
                            <Text className="text-white font-semibold text-sm">
                                Configure
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SettingsPage;

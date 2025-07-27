import {
    ImageBackground,
    PermissionsAndroid,
    Platform,
    Text,
    Touchable,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
    duration: 2000, // Duration in milliseconds
    fade: true,
});

export default function App() {
    const [appIsReady, setAppIsReady] = useState(false);

    const requestPermissions = async () => {
        if (Platform.OS === "android") {
            const permissions = [
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ];
            for (const perm of permissions) {
                const granted = await PermissionsAndroid.request(perm);
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    alert(
                        `Permission ${perm} is required for the app to function properly.`
                    );
                    return;
                }
            }
        }
    };

    async function prepare() {
        try {
            requestPermissions();

            await new Promise((resolve) => setTimeout(resolve, 2000));
        } catch (e) {
            console.warn(e);
        } finally {
            setAppIsReady(true);
            SplashScreen.hideAsync();
        }
    }
    if (!appIsReady) {
        prepare();
        return null; // Render nothing while loading
    }
    return (
        <View className="flex-1">
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <ImageBackground
                source={require("../assets/images/homepage.jpg")}
                resizeMode="cover"
                className="flex-1 items-center justify-center"
            >
                <View className="flex w-full h-full items-center justify-center bg-black/50">
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-3xl font-bold text-slate-200">
                            Welcome to Vyas!
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                router.replace("/names");
                            }}
                            className="mt-6 p-4 bg-blue-500 rounded-lg"
                            activeOpacity={0.7}
                        >
                            <Text className="text-lg w-full px-6 text-white font-bold">
                                Start Game
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}

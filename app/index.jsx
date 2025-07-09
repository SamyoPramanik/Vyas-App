import { PermissionsAndroid, Platform, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useState } from "react";

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
        <SafeAreaView className="flex-1">
            <Stack.Screen
                options={{
                    title: "Home",
                    headerTitleAlign: "center",
                    headerShown: true,
                }}
            />
            <Text className="text-xl font-bold text-blue-500">
                Welcome to Nativewind!
            </Text>
        </SafeAreaView>
    );
}

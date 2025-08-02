import { View } from "react-native";
import { CameraView } from "expo-camera";

const Camera = ({ cameraKey,cameraFacing, showNewCardUI, onQrCode}) => {
    return (
        <View className="m-4 mt-10 rounded-xl border-4 border-violet-200 overflow-hidden flex-1">
            <CameraView
                style={{ flex: 1 }}
                key={cameraKey}
                facing={cameraFacing}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
                onBarcodeScanned={showNewCardUI ? undefined : ({ data }) => onQrCode(data)}
            >
                <View className="flex-1"></View>
            </CameraView>
        </View>
    );
};

export default Camera;
import React, { useRef, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const App = () => {
  const webViewRef = useRef(null);
  const [webViewLoaded, setWebViewLoaded] = useState(false);

  const handleDownload = async (base64Data) => {
    try {
      const fileUri = FileSystem.documentDirectory + "artboard.png";
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      }
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const onMessage = (event) => {
    handleDownload(event.nativeEvent.data);
  };

  return (
    <View style={styles.container}>
      {!webViewLoaded && (
        <ActivityIndicator size="large" style={styles.loader} />
      )}
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={require("./tldraw.html")}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={(event) => {
          if (event.nativeEvent.data === "LOADED") {
            setWebViewLoaded(true);
          } else {
            onMessage(event);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -25,
    marginTop: -25,
  },
});

export default App;

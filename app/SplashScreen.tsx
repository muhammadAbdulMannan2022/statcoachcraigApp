// SplashScreen.tsx
import { Dimensions, Image, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/splash-screen.png")}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width, // scale based on device width
    height: height, // scale based on device height
  },
});

export default SplashScreen;

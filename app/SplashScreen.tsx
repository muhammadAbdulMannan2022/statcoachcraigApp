// SplashScreen.tsx
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

const SplashScreen = () => {
  const navigation = useRouter();

  useEffect(() => {
    // Simulate loading (or wait for async stuff like assets or API)
    const timeout = setTimeout(() => {
      navigation.replace("/"); // navigate to main screen
    }, 2000); // 2 seconds splash

    return () => clearTimeout(timeout);
  }, [navigation]);

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

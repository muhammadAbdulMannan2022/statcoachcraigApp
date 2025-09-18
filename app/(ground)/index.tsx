import TopPart from "@/components/GroundsPard/TopPart";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function index() {
  return (
    <View className="flex-1 w-full h-full">
      <LinearGradient
        className="flex-1 w-full h-full"
        colors={["#101A10", "#324E33"]}
      >
        <SafeAreaView>
          {/* top part of the ground */}
          <TopPart />
          <Text> Ground</Text>
        </SafeAreaView>
      </LinearGradient>
      <StatusBar style="light" />
    </View>
  );
}

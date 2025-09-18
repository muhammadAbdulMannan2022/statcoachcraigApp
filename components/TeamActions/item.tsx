import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";
export default function SideBarItem({
  time,
  action,
}: {
  time: string;
  action: string;
}) {
  return (
    <View className="flex-row justify-between bg-white py-3 px-2 border border-gray-200 rounded-md mb-2">
      <View className="flex-row gap-2">
        <Text>({time})</Text>
        <Text>({action})</Text>
      </View>
      <View className="flex-row gap-2">
        <FontAwesome5 name="check-circle" size={20} color="#2A9B20" />
        <Ionicons name="trash-outline" size={20} color="#C94747" />
      </View>
    </View>
  );
}

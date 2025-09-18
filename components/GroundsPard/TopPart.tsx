import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Octicons from "@expo/vector-icons/Octicons";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

export default function TopPart() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [value, setValue] = useState(null);
  const QuaterData = [
    { label: "Quarter 1", value: "Q1" },
    { label: "Quarter 2", value: "Q2" },
    { label: "Quarter 3", value: "Q3" },
    { label: "Quarter 4", value: "Q4" },
  ];
  // Toggle play/pause
  const toggleTimer = () => setIsRunning(!isRunning);

  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1); // increment seconds
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Convert seconds to HH:MM:SS
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <View className="w-full">
      <View className="px-[3%] flex-row justify-between items-center">
        <View className="flex-row items-center gap-3">
          <AntDesign name="arrowleft" size={24} color="#fff" />
          <Text className="text-white">Game Schedules</Text>
        </View>

        <View className="flex-row items-center justify-between p-2 bg-white rounded-full px-4 gap-5">
          <View className="w-36 bg-[#EAEAF0] text-center py-2 px-4 rounded-full justify-start">
            <Dropdown
              data={QuaterData}
              labelField="label"
              valueField="value"
              value={value}
              onChange={(item) => setValue(item.value)}
              containerStyle={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                paddingHorizontal: 12,
                backgroundColor: "#fff",
                width: 150,
                marginTop: 20,
                marginLeft: -20,
              }}
              itemTextStyle={{ color: "#2D8609" }}
              iconColor="#2D8609"
              selectedTextStyle={{
                color: "#2D8609",
                fontWeight: "bold",
              }}
            />
          </View>
          <View className="flex-row items-center gap-4">
            <TouchableOpacity className="items-center flex-row gap-2">
              <Text className="text-[#2D8609] text-sm font-bold">Undo</Text>
              <MaterialCommunityIcons
                name="undo-variant"
                size={24}
                color="#2D8609"
              />
            </TouchableOpacity>
            <TouchableOpacity className="items-center flex-row gap-2">
              <MaterialCommunityIcons
                name="redo-variant"
                size={24}
                color="#2D8609"
              />
              <Text className="text-[#2D8609] text-sm font-bold">Redo</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity className="bg-[#2D8609] px-4 py-2 rounded-full">
            <Text className="text-white text-base font-semibold">
              Generate Report
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center gap-3">
          <Text className="text-white">Start Quarter</Text>
          <TouchableOpacity onPress={toggleTimer}>
            <FontAwesome
              name={isRunning ? "pause-circle" : "play-circle"}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
          <View className="flex-row items-center gap-3">
            <Text className="text-white">{formatTime(time)}</Text>
            <Octicons name="dot-fill" size={24} color="#D15F42" />
          </View>
        </View>
      </View>
    </View>
  );
}

import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Octicons from "@expo/vector-icons/Octicons";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AppModal from "../ui/Modals/ModalScaliton";

interface PropIntrface {
  isRunning: boolean;
  setIsRunning: (data: boolean) => void;
  value: "1" | "2" | "3" | "4";
  setValue: (data: "1" | "2" | "3" | "4") => void;
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
}

export default function TopPart({
  isRunning,
  setIsRunning,
  value,
  setValue,
  time,
  setTime,
}: PropIntrface) {
  const QuaterData = [
    { label: "Quarter 1", value: "1" },
    { label: "Quarter 2", value: "2" },
    { label: "Quarter 3", value: "3" },
    { label: "Quarter 4", value: "4" },
  ];

  const [pendingQuarter, setPendingQuarter] = useState<
    "1" | "2" | "3" | "4" | null
  >(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [skipWarningVisible, setSkipWarningVisible] = useState(false); // New state for skip warning modal

  // Toggle play/pause
  const toggleTimer = () => {
    if (isRunning) {
      setIsRunning(false);

      const current = Number(value);
      if (current < 4) {
        setPendingQuarter(String(current + 1) as "1" | "2" | "3" | "4");
        setConfirmVisible(true);
      } else {
        setGameFinished(true);
      }
    } else {
      setIsRunning(true); // resume
    }
  };

  // Timer interval
  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => setTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Handle dropdown change
  const changeQuarterDropdownValue = (item: {
    value: "1" | "2" | "3" | "4";
    label: string;
  }) => {
    const current = Number(value);
    const next = Number(item.value);

    if (next > current + 1) {
      console.log("❌ Can't skip quarters");
      setSkipWarningVisible(true); // Show warning modal for skipping quarters
      return;
    }
    if (next < current) {
      console.log("❌ Can't go back to previous quarter");
      return;
    }
    if (current === 4) {
      setGameFinished(true);
      return;
    }

    setPendingQuarter(item.value);
    setConfirmVisible(true);

    // Reset dropdown to current value to prevent skipping
    setValue(value);
  };

  // Confirm quarter change
  const confirmChangeQuarter = () => {
    if (pendingQuarter) {
      setTime(0); // reset timer only after confirmation
      setValue(pendingQuarter);
      console.log("✅ Moved to quarter:", pendingQuarter);
    }
    setConfirmVisible(false);
    setPendingQuarter(null);
  };

  // Format seconds to HH:MM:SS
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
        <View className="flex-row items-center gap-3 w-[25%]">
          <AntDesign name="arrowleft" size={24} color="#fff" />
          <Text className="text-white">Game Schedules</Text>
        </View>

        <View className="flex-row items-center justify-between p-2 bg-[#F8F8FA] rounded-full px-4 gap-5">
          <View className="w-36 bg-[#EAEAF0] text-center py-2 px-4 rounded-full justify-start">
            <Dropdown
              data={QuaterData}
              labelField="label"
              valueField="value"
              value={value}
              onChange={changeQuarterDropdownValue}
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
              selectedTextStyle={{ color: "#2D8609", fontWeight: "bold" }}
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

        <View className="flex-row items-center gap-3 w-[25%] justify-end">
          <Text className="text-white">
            {isRunning ? "End Quarter" : "Start Quarter"}
          </Text>
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

      {/* Confirm Modal */}
      <AppModal
        visible={confirmVisible}
        onClose={() => setConfirmVisible(false)}
      >
        <View className="items-center">
          <Text className="text-lg font-bold mb-4">
            Move to Quarter {pendingQuarter}?
          </Text>
          <Text className="text-gray-600 mb-6 text-center">
            The current quarter will end and the timer will reset.
          </Text>
          <View className="flex-row gap-4">
            <TouchableOpacity
              className="px-4 py-2 rounded-lg border border-gray-400"
              onPress={() => setConfirmVisible(false)}
            >
              <Text className="text-gray-600">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: "#2D8609" }}
              onPress={confirmChangeQuarter}
            >
              <Text className="text-white">Yes, Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </AppModal>

      {/* Skip Quarter Warning Modal */}
      <AppModal
        visible={skipWarningVisible}
        onClose={() => setSkipWarningVisible(false)}
      >
        <View className="items-center">
          <Text className="text-lg font-bold mb-4 text-red-600">
            Cannot Skip Quarters
          </Text>
          <Text className="text-gray-600 mb-6 text-center">
            You cannot skip quarters. Please select the next quarter (Quarter{" "}
            {Number(value) + 1}).
          </Text>
          <View className="flex-row gap-4">
            <TouchableOpacity
              className="px-4 py-2 rounded-lg border border-gray-400"
              onPress={() => setSkipWarningVisible(false)}
            >
              <Text className="text-gray-600">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </AppModal>

      {/* Game Finished Modal */}
      <AppModal visible={gameFinished} onClose={() => setGameFinished(false)}>
        <View className="items-center">
          <Text className="text-lg font-bold mb-4">Game Finished</Text>
          <Text className="text-gray-600 mb-6 text-center">
            All four quarters are complete. You can reset the game or generate
            the full report.
          </Text>
          <View className="flex-row gap-4">
            <TouchableOpacity
              className="px-4 py-2 rounded-lg border border-gray-400"
              onPress={() => {
                setGameFinished(false);
                setValue("1");
                setTime(0);
                setIsRunning(false);
              }}
            >
              <Text className="text-gray-600">Reset Game</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: "#2D8609" }}
              onPress={() => console.log("Generate Report")}
            >
              <Text className="text-white">Generate Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </AppModal>
    </View>
  );
}

import TopPart from "@/components/GroundsPard/TopPart";
import CustomDropdown from "@/components/teamStratagy/TeamStratagy";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function index() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState<string | null>(null);

  const QuaterData = [
    { label: "Quarter 1", value: "Q1" },
    { label: "Quarter 2", value: "Q2" },
    { label: "Quarter 3", value: "Q3" },
    { label: "Quarter 4", value: "Q4" },
  ];

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item: { label: string; value: string }) => {
    console.log("User clicked:", item);
    setSelectedQuarter(item.value);
  };
  return (
    <View className="flex-1 w-full h-full">
      <LinearGradient
        className="flex-1 w-full h-full"
        colors={["#101A10", "#324E33"]}
      >
        <SafeAreaView>
          {/* top part of the ground */}
          <TopPart />
          {/* left team */}
          <View className="absolute top-[100px] left-0">
            <CustomDropdown
              items={QuaterData}
              title={"Script HQ"}
              onClickItem={handleItemClick}
              isOpen={isOpen}
              onToggle={handleToggle}
              alignment="left"
            />
          </View>
          {/* right team */}
          <View className="absolute top-[100px] right-0">
            <CustomDropdown
              items={QuaterData}
              title={"Script RH"}
              onClickItem={handleItemClick}
              isOpen={isOpen}
              onToggle={handleToggle}
              alignment="right"
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
      <StatusBar style="light" />
    </View>
  );
}

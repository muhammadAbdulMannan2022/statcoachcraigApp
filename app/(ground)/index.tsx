import TopPart from "@/components/GroundsPard/TopPart";
import LeftSidebar from "@/components/TeamActions/LeftSideBar";
import RightSidebar from "@/components/TeamActions/RightSidebar";
import CustomDropdown from "@/components/teamStratagy/TeamStratagy";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function index() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState<string | null>(null);

  // sidebars
  const [isLeftSideBarOpen, setIsLeftSideBarOpen] = useState(false);
  const [isRightSideBarOpen, setIsRightSideBarOpen] = useState(false);

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
        {/* Main content area wrapped in SafeAreaView */}
        <SafeAreaView className="flex-1">
          {/* top part of the ground */}
          <TopPart />
          {/* left team dropdown */}
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
          {/* right team dropdown */}
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

        {/* Sidebars are rendered as siblings to SafeAreaView, but still within LinearGradient */}
        {/* They will now correctly position themselves absolutely relative to the LinearGradient */}
        <LeftSidebar
          isOpen={isLeftSideBarOpen}
          onClose={() => setIsLeftSideBarOpen(false)}
          toggle={() => setIsLeftSideBarOpen((prev) => !prev)}
          title="Left Menu"
        />
        <RightSidebar
          isOpen={isRightSideBarOpen}
          onClose={() => setIsRightSideBarOpen(false)}
          toggle={() => setIsRightSideBarOpen((prev) => !prev)}
          title="Right Menu"
        />
      </LinearGradient>
      <StatusBar style="light" />
    </View>
  );
}

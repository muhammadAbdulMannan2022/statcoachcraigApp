import TopPart from "@/components/GroundsPard/TopPart";
import LeftSidebar from "@/components/TeamActions/LeftSideBar";
import RightSidebar from "@/components/TeamActions/RightSidebar";
import CustomDropdown from "@/components/teamStratagy/TeamStratagy";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function index() {
  // topbar data start
  const [isRunning, setIsRunning] = useState(false);
  const [timer, setTimer] = useState(0);
  const [activeQuater, setActiveQuater] = useState<"1" | "2" | "3" | "4">("1");
  // topbar data end
  const [isOpen, setIsOpen] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState<string | null>(null);

  // sidebars
  const [isLeftSideBarOpen, setIsLeftSideBarOpen] = useState(false);
  const [isRightSideBarOpen, setIsRightSideBarOpen] = useState(false);
  // way of kick
  const [wayOfKick, setWayOfKick] = useState("");

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
        <SafeAreaView className="flex-1 items-center">
          {/* top part of the ground */}
          <TopPart
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            value={activeQuater}
            setValue={setActiveQuater}
            time={timer}
            setTime={setTimer}
          />
          {/* way to kick */}
          {wayOfKick === "" && (
            <View className="mx-auto justify-between items-center flex-row mt-6 gap-6">
              <TouchableOpacity
                onPress={() => setWayOfKick("left")}
                className="bg-[#2D8609] w-12 h-12 rounded-full items-center justify-center"
              >
                <FontAwesome5 name="angle-left" size={24} color="#fff" />
              </TouchableOpacity>
              <View className="bg-[#F8F8FA] px-5 py-3 rounded-full">
                <Text className="text-[#5E5871] text-lg font-semibold">
                  Select which way you are kicking
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setWayOfKick("right")}
                className="bg-[#2D8609] w-12 h-12 rounded-full items-center justify-center"
              >
                <FontAwesome5 name="angle-right" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
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

const style = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,

    // Android Shadow
    elevation: 5,
  },
});

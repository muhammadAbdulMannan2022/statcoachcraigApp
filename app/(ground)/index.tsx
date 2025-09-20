import TopPart from "@/components/GroundsPard/TopPart";
import LeftSidebar from "@/components/TeamActions/LeftSideBar";
import RightSidebar from "@/components/TeamActions/RightSidebar";
import CustomDropdown from "@/components/teamStratagy/TeamStratagy";
import AppModal from "@/components/ui/Modals/ModalScaliton";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Ellipse } from "react-native-svg";

interface ClickEvent {
  position: { x: number; y: number };
  type: "ellipse" | "ellipse left" | "ellipse right";
}

export default function Index() {
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [timer, setTimer] = useState(0);
  const [activeQuater, setActiveQuater] = useState<"1" | "2" | "3" | "4">("1");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState<string | null>(null);
  const [isLeftSideBarOpen, setIsLeftSideBarOpen] = useState(false);
  const [isRightSideBarOpen, setIsRightSideBarOpen] = useState(false);
  const [wayOfKick, setWayOfKick] = useState("");
  const [clicks, setClicks] = useState<ClickEvent[]>([]);
  const [showAllDots, setShowAllDots] = useState(false);
  const [wornNextQ, setWornNextQ] = useState(true);

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

  const handleLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setParentSize({ width, height });
  };

  const svgSize = parentSize.height > 0 ? parentSize.height : 200;
  const ellipseRx = svgSize * 0.4;
  const ellipseRy = svgSize * 0.25;

  // Function to check if a point (x, y) lies within the ellipse
  const isPointInEllipse = (
    x: number,
    y: number,
    cx: number,
    cy: number,
    rx: number,
    ry: number
  ): boolean => {
    setIsOpen(true);
    // Ellipse equation: ((x - cx)^2 / rx^2) + ((y - cy)^2 / ry^2) <= 1
    return (x - cx) ** 2 / rx ** 2 + (y - cy) ** 2 / ry ** 2 <= 1;
  };

  // Handle clicks on the ellipse (non-overlapping parts)
  const handleEllipseClick = (e: any) => {
    const { locationX, locationY } = e.nativeEvent;
    setIsOpen(true);
    const clickEvent: ClickEvent = {
      position: { x: locationX, y: locationY },
      type: "ellipse",
    };
    setClicks([...clicks, clickEvent]);
    console.log(clickEvent);
  };

  // Handle clicks on the left circle (only if overlapping with ellipse)
  const handleLeftCircleClick = (e: any) => {
    const { locationX, locationY } = e.nativeEvent;
    const ellipseCx = svgSize;
    const ellipseCy = svgSize / 2;
    const adjustedRx = ellipseRx * 1.6;
    const adjustedRy = ellipseRy * 1.7;

    if (
      isPointInEllipse(
        locationX,
        locationY,
        ellipseCx,
        ellipseCy,
        adjustedRx,
        adjustedRy
      )
    ) {
      const clickEvent: ClickEvent = {
        position: { x: locationX, y: locationY },
        type: "ellipse left",
      };
      setClicks([...clicks, clickEvent]);
      console.log(clickEvent);
    } else {
      console.log("Left circle clicked outside ellipse overlap. Not counted.");
    }
  };

  // Handle clicks on the right circle (only if overlapping with ellipse)
  const handleRightCircleClick = (e: any) => {
    const { locationX, locationY } = e.nativeEvent;
    const ellipseCx = svgSize;
    const ellipseCy = svgSize / 2;
    const adjustedRx = ellipseRx * 1.6;
    const adjustedRy = ellipseRy * 1.7;

    if (
      isPointInEllipse(
        locationX,
        locationY,
        ellipseCx,
        ellipseCy,
        adjustedRx,
        adjustedRy
      )
    ) {
      const clickEvent: ClickEvent = {
        position: { x: locationX, y: locationY },
        type: "ellipse right",
      };
      setClicks([...clicks, clickEvent]);
      console.log(clickEvent);
    } else {
      console.log("Right circle clicked outside ellipse overlap. Not counted.");
    }
  };

  return (
    <View className="flex-1 w-full h-full">
      <LinearGradient
        className="flex-1 w-full h-full"
        colors={["#101A10", "#324E33"]}
      >
        <SafeAreaView className="flex-1 items-center">
          <TopPart
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            value={activeQuater}
            setValue={setActiveQuater}
            time={timer}
            setTime={setTimer}
          />
          {wayOfKick === "" && (
            <View className="mx-auto justify-between items-center flex-row mt-6 gap-6 absolute top-24 z-50">
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
          <View className="flex-1 w-full">
            <ImageBackground
              source={require("@/assets/ground.png")}
              className="h-full items-center justify-center"
              resizeMode="contain"
              onLayout={handleLayout}
            >
              {parentSize.height > 0 && (
                <Svg width={svgSize * 2} height={svgSize}>
                  <Ellipse
                    cx={svgSize}
                    cy={svgSize / 2}
                    rx={ellipseRx * 1.6}
                    ry={ellipseRy * 1.7}
                    stroke="black"
                    strokeWidth="0"
                    fill="none"
                    onPress={handleEllipseClick}
                  />
                  {/* Left Circle */}
                  <Circle
                    cx={svgSize / 2.66}
                    cy={svgSize / 1.99}
                    r={ellipseRy * 1.6 * 0.9}
                    stroke="black"
                    strokeWidth="0"
                    fill="none"
                    onPress={handleLeftCircleClick}
                  />
                  {/* Right Circle */}
                  <Circle
                    cx={svgSize * 1.62}
                    cy={svgSize / 1.99}
                    r={ellipseRy * 1.6 * 0.9}
                    stroke="black"
                    strokeWidth="0"
                    fill="none"
                    onPress={handleRightCircleClick}
                  />
                  {/* Render dots for clicks */}
                  {showAllDots
                    ? clicks.map((click, index) => (
                        <Circle
                          key={index}
                          cx={click.position.x}
                          cy={click.position.y}
                          r={5}
                          fill="red"
                        />
                      ))
                    : clicks.length > 0 && (
                        <Circle
                          cx={clicks[clicks.length - 1].position.x}
                          cy={clicks[clicks.length - 1].position.y}
                          r={5}
                          fill="red"
                        />
                      )}
                </Svg>
              )}
            </ImageBackground>
          </View>
          {/* Toggle button for showing all dots */}
          {/* <TouchableOpacity
            onPress={() => setShowAllDots(!showAllDots)}
            className="bg-[#2D8609] px-4 py-2 rounded-full absolute bottom-4"
          >
            <Text className="text-white font-semibold">
              {showAllDots ? "Show Last Dot" : "Show All Dots"}
            </Text>
          </TouchableOpacity> */}
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

      {/* Start game Modal */}
      <AppModal onClose={() => setWornNextQ(false)} visible={wornNextQ}>
        <View className="flex flex-col items-center justify-center">
          {/* Title */}
          <Text className="text-2xl font-bold mb-3 text-center">
            Start the Game
          </Text>

          {/* Description */}
          <Text className="text-base text-gray-600 mb-6 text-center px-4">
            This AFL tool helps coaches track, monitor, and analyze the game in
            real time.
          </Text>

          {/* Buttons */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="px-6 py-3 rounded-lg border border-[#2D8609]"
              onPress={() => console.log("Close")}
            >
              <Text className="text-[#2D8609] font-semibold text-lg">
                Close
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-6 py-3 rounded-lg"
              style={{ backgroundColor: "#2D8609" }}
              onPress={() => console.log("Game Started!")}
            >
              <Text className="text-white font-semibold text-lg">Start</Text>
            </TouchableOpacity>
          </View>
        </View>
      </AppModal>
    </View>
  );
}

// const style = StyleSheet.create({
//   shadow: {
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 5,
//   },
// });

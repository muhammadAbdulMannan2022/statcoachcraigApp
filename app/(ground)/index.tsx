import TopPart from "@/components/GroundsPard/TopPart";
import LeftSidebar from "@/components/TeamActions/LeftSideBar";
import RightSidebar from "@/components/TeamActions/RightSidebar";
import CustomDropdown from "@/components/teamStratagy/TeamStratagy";
import AppModal from "@/components/ui/Modals/ModalScaliton";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  RadialGradient,
  Stop,
} from "react-native-svg";

interface ClickEvent {
  position: { x: number; y: number };
  type: "ellipse" | "ellipse left" | "ellipse right";
  team: string;
  item: string;
  time: string;
  isComplete: boolean;
}

export default function Index() {
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [timer, setTimer] = useState(0);
  const [activeQuater, setActiveQuater] = useState<"1" | "2" | "3" | "4">("1");
  const [isLeftDropdownOpen, setIsLeftDropdownOpen] = useState(false);
  const [isRightDropdownOpen, setIsRightDropdownOpen] = useState(false);
  const [isLeftSideBarOpen, setIsLeftSideBarOpen] = useState(false);
  const [isRightSideBarOpen, setIsRightSideBarOpen] = useState(false);
  const [wayOfKick, setWayOfKick] = useState("");
  const [clicks, setClicks] = useState<ClickEvent[]>([]);
  const [pendingClickIndex, setPendingClickIndex] = useState<number | null>(
    null
  );
  const [showAllDots, setShowAllDots] = useState(false);
  const [wornNextQ, setWornNextQ] = useState(true);
  const [team] = useState(["Script HQ", "Script RH"]);
  const renderCount = useRef(0);

  // Detect excessive renders
  renderCount.current += 1;
  useEffect(() => {
    if (renderCount.current > 100) {
      console.warn("Excessive renders detected:", renderCount.current);
      renderCount.current = 0;
      // Uncomment to halt execution for debugging
      // throw new Error("Render loop detected. Check state updates.");
    }
  }, []);

  const QuaterData = useMemo(
    () => [
      { label: "Turn Over", value: "turn_over" },
      { label: "Inside 50", value: "inside_50" },
      { label: "Fumble", value: "fumble" },
      { label: "Content", value: "content" },
      { label: "Tackle", value: "tackle" },
    ],
    []
  );

  const handleLayout = useCallback((event: any) => {
    console.time("Layout");
    const { width, height } = event.nativeEvent.layout;
    setParentSize((prev) => {
      if (prev.width !== width || prev.height !== height) {
        console.log("Layout updated:", { width, height });
        return { width, height };
      }
      return prev;
    });
    console.timeEnd("Layout");
  }, []);

  const svgSize = useMemo(
    () => (parentSize.height > 0 ? parentSize.height : 200),
    [parentSize.height]
  );
  const ellipseRx = useMemo(() => svgSize * 0.4, [svgSize]);
  const ellipseRy = useMemo(() => svgSize * 0.25, [svgSize]);

  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const isPointInEllipse = useCallback(
    (
      x: number,
      y: number,
      cx: number,
      cy: number,
      rx: number,
      ry: number
    ): boolean => {
      return (x - cx) ** 2 / rx ** 2 + (y - cy) ** 2 / ry ** 2 <= 1;
    },
    []
  );

  const handleEllipseClick = useCallback(
    (e: any) => {
      if (pendingClickIndex !== null) {
        console.log(
          "Please select an action from the dropdown before clicking again."
        );
        return;
      }
      console.time("DotPlacement");
      const { locationX, locationY } = e.nativeEvent;
      setClicks((prev) => {
        const newClick: ClickEvent = {
          position: { x: locationX, y: locationY },
          type: "ellipse",
          team: "",
          item: "",
          time: formatTime(timer),
          isComplete: false,
        };
        console.log("Adding click:", newClick);
        setPendingClickIndex(prev.length);
        return [...prev, newClick];
      });
      setIsLeftDropdownOpen(true);
      setIsRightDropdownOpen(true);
      console.timeEnd("DotPlacement");
    },
    [pendingClickIndex, timer, formatTime]
  );

  const handleLeftCircleClick = useCallback(
    (e: any) => {
      if (pendingClickIndex !== null) {
        console.log(
          "Please select an action from the dropdown before clicking again."
        );
        return;
      }
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
        console.time("DotPlacement");
        setClicks((prev) => {
          const newClick: ClickEvent = {
            position: { x: locationX, y: locationY },
            type: "ellipse left",
            team: "",
            item: "",
            time: formatTime(timer),
            isComplete: false,
          };
          console.log("Adding click:", newClick);
          setPendingClickIndex(prev.length);
          return [...prev, newClick];
        });
        setIsLeftDropdownOpen(true);
        setIsRightDropdownOpen(true);
        console.timeEnd("DotPlacement");
      } else {
        console.log(
          "Left circle clicked outside ellipse overlap. Not counted."
        );
      }
    },
    [
      pendingClickIndex,
      timer,
      formatTime,
      svgSize,
      ellipseRx,
      ellipseRy,
      isPointInEllipse,
    ]
  );

  const handleRightCircleClick = useCallback(
    (e: any) => {
      if (pendingClickIndex !== null) {
        console.log(
          "Please select an action from the dropdown before clicking again."
        );
        return;
      }
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
        console.time("DotPlacement");
        setClicks((prev) => {
          const newClick: ClickEvent = {
            position: { x: locationX, y: locationY },
            type: "ellipse right",
            team: "",
            item: "",
            time: formatTime(timer),
            isComplete: false,
          };
          console.log("Adding click:", newClick);
          setPendingClickIndex(prev.length);
          return [...prev, newClick];
        });
        setIsLeftDropdownOpen(true);
        setIsRightDropdownOpen(true);
        console.timeEnd("DotPlacement");
      } else {
        console.log(
          "Right circle clicked outside ellipse overlap. Not counted."
        );
      }
    },
    [
      pendingClickIndex,
      timer,
      formatTime,
      svgSize,
      ellipseRx,
      ellipseRy,
      isPointInEllipse,
    ]
  );

  const handleItemClick = useCallback(
    (item: { label: string; value: string }, teamSelected: string) => {
      if (pendingClickIndex === null) {
        console.log("No pending click to associate with this selection.");
        return;
      }

      console.time("ItemSelection");
      setClicks((prevClicks) => {
        const updatedClicks = prevClicks.map((click, index) =>
          index === pendingClickIndex
            ? {
                ...click,
                team: teamSelected,
                item: item.value,
                isComplete: true,
              }
            : click
        );
        console.log("Click event completed:", {
          position: updatedClicks[pendingClickIndex]?.position,
          type: updatedClicks[pendingClickIndex]?.type,
          team: teamSelected,
          item: item.value,
          time: updatedClicks[pendingClickIndex]?.time,
        });
        return updatedClicks;
      });
      setPendingClickIndex(null);
      setIsLeftDropdownOpen(false);
      setIsRightDropdownOpen(false);
      console.timeEnd("ItemSelection");
    },
    [pendingClickIndex]
  );

  const sidebarItems = useMemo(
    () =>
      clicks
        .filter((click) => click.isComplete)
        .map((click) => ({
          time: click.time,
          action:
            QuaterData.find((item) => item.value === click.item)?.label ||
            click.item,
          team: click.team,
        })),
    [clicks, QuaterData]
  );

  const svgCircles = useMemo(() => {
    const dotsToRender = showAllDots ? clicks.slice(0, 100) : clicks.slice(-1);
    return dotsToRender.map((click, index) => (
      <Circle
        key={clicks.length - dotsToRender.length + index}
        cx={click.position.x}
        cy={click.position.y}
        r={dotsToRender.length > 1 ? 25 : 5}
        fill={
          dotsToRender.length > 1
            ? `url(#${click.isComplete ? "redGradient" : "orangeGradient"})`
            : click.isComplete
              ? "red"
              : "orange"
        }
      />
    ));
  }, [clicks, showAllDots]);

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
                  <Defs>
                    <RadialGradient id="redGradient" cx="50%" cy="50%" r="50%">
                      <Stop offset="0" stopColor="red" stopOpacity="0.7" />
                      <Stop offset="0.3" stopColor="yellow" stopOpacity="0.5" />
                      <Stop offset="1" stopColor="yellow" stopOpacity="0" />
                    </RadialGradient>
                    <RadialGradient
                      id="orangeGradient"
                      cx="50%"
                      cy="50%"
                      r="50%"
                    >
                      <Stop offset="0" stopColor="orange" stopOpacity="0.7" />
                      <Stop offset="0.3" stopColor="yellow" stopOpacity="0.5" />
                      <Stop offset="1" stopColor="yellow" stopOpacity="0" />
                    </RadialGradient>
                  </Defs>
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
                  <Circle
                    cx={svgSize / 2.66}
                    cy={svgSize / 1.99}
                    r={ellipseRy * 1.6 * 0.9}
                    stroke="black"
                    strokeWidth="0"
                    fill="none"
                    onPress={handleLeftCircleClick}
                  />
                  <Circle
                    cx={svgSize * 1.62}
                    cy={svgSize / 1.99}
                    r={ellipseRy * 1.6 * 0.9}
                    stroke="black"
                    strokeWidth="0"
                    fill="none"
                    onPress={handleRightCircleClick}
                  />
                  {svgCircles}
                </Svg>
              )}
            </ImageBackground>
          </View>
          <TouchableOpacity
            onPress={() => setShowAllDots(!showAllDots)}
            className="bg-[#2D8609] px-4 py-2 rounded-full absolute bottom-4"
          >
            <Text className="text-white font-semibold">
              {showAllDots ? "Show Last Dot" : "Show All Dots"}
            </Text>
          </TouchableOpacity>
          <View className="absolute top-[100px] left-0">
            <CustomDropdown
              items={QuaterData}
              title={team[0]}
              onClickItem={(item) => handleItemClick(item, team[0])}
              isOpen={isLeftDropdownOpen}
              onToggle={() => {
                // do nothing
              }}
              alignment="left"
            />
          </View>
          <View className="absolute top-[100px] right-0">
            <CustomDropdown
              items={QuaterData}
              title={team[1]}
              onClickItem={(item) => handleItemClick(item, team[1])}
              isOpen={isLeftDropdownOpen}
              onToggle={() => {
                // do nothing
              }}
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
      <AppModal onClose={() => setWornNextQ(false)} visible={wornNextQ}>
        <View className="flex flex-col items-center justify-center">
          <Text className="text-2xl font-bold mb-3 text-center">
            Start the Game
          </Text>
          <Text className="text-base text-gray-600 mb-6 text-center px-4">
            This AFL tool helps coaches track, monitor, and analyze the game in
            real time.
          </Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="px-6 py-3 rounded-lg border border-[#2D8609]"
              onPress={() => setWornNextQ(false)}
            >
              <Text className="text-[#2D8609] font-semibold text-lg">
                Close
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-6 py-3 rounded-lg"
              style={{ backgroundColor: "#2D8609" }}
              onPress={() => {
                setWornNextQ(false);
                setIsRunning(true);
                console.log("Game Started!");
              }}
            >
              <Text className="text-white font-semibold text-lg">Start</Text>
            </TouchableOpacity>
          </View>
        </View>
      </AppModal>
    </View>
  );
}

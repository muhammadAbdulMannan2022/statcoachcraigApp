import TopPart from "@/components/GroundsPard/TopPart";
import LeftSidebar from "@/components/TeamActions/LeftSideBar";
import RightSidebar from "@/components/TeamActions/RightSidebar";
import CustomDropdown from "@/components/teamStratagy/TeamStratagy";
import AppModal from "@/components/ui/Modals/ModalScaliton";
import { useHistory } from "@/hooks/useHistory";
import { useCreateGameMutation } from "@/redux/apis/api";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  Line,
  RadialGradient,
  Stop,
} from "react-native-svg";

interface ClickEvent {
  position: { x: number; y: number };
  position2?: { x: number; y: number };
  type: "ellipse" | "ellipse left" | "ellipse right";
  team: string;
  item: string;
  time: string;
  isComplete: boolean;
  pairId?: number;
}

interface LineClick {
  position: { x: number; y: number };
  type: "ellipse left" | "ellipse right";
  time: string;
  pairId: number;
}

interface CurrentLine {
  position: { x: number; y: number };
  to: { x: number; y: number };
  isComplete: boolean;
  pairId: number;
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
  const [quarteredClicks, setQuarteredClicks] = useState<
    { quarter: "1" | "2" | "3" | "4"; clicks: ClickEvent[] }[]
  >([]);
  const [pendingClickIndex, setPendingClickIndex] = useState<number | null>(
    null
  );
  const [pendingInside50Index, setPendingInside50Index] = useState<
    number | null
  >(null);
  const [pendingLineClick, setPendingLineClick] = useState<LineClick | null>(
    null
  );
  const [currentLine, setCurrentLine] = useState<CurrentLine | null>(null);
  const [completedLines, setCompletedLines] = useState<CurrentLine[]>([]);
  const [showAllDots, setShowAllDots] = useState(false);
  const [wornNextQ, setWornNextQ] = useState(true);
  const [team] = useState(["MY TEAM", "OTHER TEAM"]);
  const pairIdCounter = useRef(0);
  const renderCount = useRef(0);
  // Sidebar openers removed — parent won't auto-open sidebars from modal
  // all rtk and its functions
  const [createGame, { isLoading: isCreateGameLoading }] =
    useCreateGameMutation();

  // rtks functions
  const handleCreateGame = async () => {
    try {
      const res = await createGame({}).unwrap();
      if (res.game_id) {
        setWornNextQ(false);
        // setIsRunning(true);
        await SecureStore.setItemAsync("game_id", res.game_id.toString());
        console.log(res.game_id);
        console.log("Game Started!");
      } else {
        throw new Error("No game_id returned");
      }
    } catch (error) {
      console.log(error, "line 82 index.tsx");
    }
  };

  const resetApp = useCallback(() => {
    setIsRunning(false);
    setTimer(0);
    setActiveQuater("1");
    setIsLeftDropdownOpen(false);
    setIsRightDropdownOpen(false);
    setIsLeftSideBarOpen(false);
    setIsRightSideBarOpen(false);
    setWayOfKick("");
    setClicks([]);
    setQuarteredClicks([]);
    setPendingClickIndex(null);
    setPendingInside50Index(null);
    setPendingLineClick(null);
    setCurrentLine(null);
    setCompletedLines([]);
    setShowAllDots(false);
    setWornNextQ(true);
  }, []);

  // Initialize useHistory hook
  const { updateHistory, undo, redo, clearHistory } = useHistory(
    clicks,
    setClicks,
    setCurrentLine,
    pendingLineClick,
    setPendingLineClick
  );

  // Archive current clicks into quarteredClicks before clearing history
  const clearAndArchive = useCallback(() => {
    try {
      setQuarteredClicks((prev) => [
        ...prev,
        { quarter: activeQuater, clicks: clicks.slice() },
      ]);
    } catch (err) {
      console.log("Error archiving clicks:", err);
    }
    // Clear history and related state
    clearHistory();
  }, [activeQuater, clicks, clearHistory]);

  // Detect excessive renders
  renderCount.current += 1;
  useEffect(() => {
    if (renderCount.current > 100) {
      console.warn("Excessive renders detected:", renderCount.current);
      renderCount.current = 0;
      // throw new Error("Render loop detected. Check state updates.");
    }
  }, []);

  const QuaterData = useMemo(
    () => [
      { label: "Inside 50", value: "inside_50" },
      { label: "Clearance", value: "clearance" },
      { label: "Tackle", value: "tackle" },
      { label: "Fumble", value: "fumble" },
      { label: "Uncontested mark", value: "uncontested_mark" },
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
      if (!isRunning) return;
      console.time("DotPlacement");
      const { locationX, locationY } = e.nativeEvent;
      const currentTime = formatTime(timer);

      // Check for duplicate click at same position and time
      const isDuplicate = clicks.some(
        (click) =>
          click.position.x === locationX &&
          click.position.y === locationY &&
          click.time === currentTime
      );
      if (isDuplicate) {
        console.log("Duplicate click detected, ignoring:", {
          x: locationX,
          y: locationY,
          time: currentTime,
        });
        return;
      }

      setCurrentLine(null); // Clear previous line
      setCompletedLines([]); // Clear completed lines on new action
      setClicks((prev) => {
        const newClick: ClickEvent = {
          position: { x: locationX, y: locationY },
          type: "ellipse",
          team: "",
          item: "",
          time: currentTime,
          isComplete: false,
        };
        console.log("Adding ellipse click:", newClick);
        const updatedClicks = [...prev, newClick];
        setPendingClickIndex(updatedClicks.length - 1);
        // Defer updateHistory until team selection
        return updatedClicks;
      });
      setIsLeftDropdownOpen(true);
      setIsRightDropdownOpen(true);
      console.timeEnd("DotPlacement");
    },
    [timer, formatTime, clicks, isRunning]
  );

  const handleLeftCircleClick = useCallback(
    (e: any) => {
      if (!isRunning) return;
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
        if (pendingInside50Index !== null) {
          // Second click for inside_50
          setClicks((prev) => {
            const updatedClicks = prev.map((click, index) => {
              if (index === pendingInside50Index) {
                return {
                  ...click,
                  position2: { x: locationX, y: locationY },
                  isComplete: true,
                };
              }
              return click;
            });
            console.log("Second position for inside_50:", {
              position2: { x: locationX, y: locationY },
            });
            updateHistory(updatedClicks, true);
            return updatedClicks;
          });
          setCompletedLines((prev) => [
            ...prev,
            {
              position: clicks[pendingInside50Index!].position,
              to: { x: locationX, y: locationY },
              isComplete: true,
              pairId: 0,
            },
          ]);
          setPendingInside50Index(null);
          setIsLeftDropdownOpen(false);
          setIsRightDropdownOpen(false);
          setPendingClickIndex(null);
          return;
        }

        // Normal event on circle
        if (pendingClickIndex !== null) {
          console.log(
            "Please select an action from the dropdown before clicking again."
          );
          return;
        }
        // Check for duplicate click
        const currentTime = formatTime(timer);
        const isDuplicate = clicks.some(
          (click) =>
            click.position.x === locationX &&
            click.position.y === locationY &&
            click.time === currentTime
        );
        if (isDuplicate) {
          console.log("Duplicate click detected, ignoring:", {
            x: locationX,
            y: locationY,
            time: currentTime,
          });
          return;
        }
        setCurrentLine(null); // Clear previous line
        setCompletedLines([]); // Clear completed lines on new action
        setClicks((prev) => {
          const newClick: ClickEvent = {
            position: { x: locationX, y: locationY },
            type: "ellipse left",
            team: "",
            item: "",
            time: currentTime,
            isComplete: false,
          };
          console.log("Adding circle click:", newClick);
          const updatedClicks = [...prev, newClick];
          setPendingClickIndex(updatedClicks.length - 1);
          // Defer updateHistory until team selection
          return updatedClicks;
        });
        setIsLeftDropdownOpen(true);
        setIsRightDropdownOpen(true);
      } else {
        console.log(
          "Left circle clicked outside ellipse overlap. Not counted."
        );
      }
    },
    [
      pendingInside50Index,
      updateHistory,
      setPendingClickIndex,
      formatTime,
      timer,
      clicks,
      svgSize,
      ellipseRx,
      ellipseRy,
      isPointInEllipse,
      isRunning,
    ]
  );

  const handleRightCircleClick = useCallback(
    (e: any) => {
      if (!isRunning) return;
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
        if (pendingInside50Index !== null) {
          // Second click for inside_50
          setClicks((prev) => {
            const updatedClicks = prev.map((click, index) => {
              if (index === pendingInside50Index) {
                return {
                  ...click,
                  position2: { x: locationX, y: locationY },
                  isComplete: true,
                };
              }
              return click;
            });
            console.log("Second position for inside_50:", {
              position2: { x: locationX, y: locationY },
            });
            updateHistory(updatedClicks, true);
            return updatedClicks;
          });
          setCompletedLines((prev) => [
            ...prev,
            {
              position: clicks[pendingInside50Index!].position,
              to: { x: locationX, y: locationY },
              isComplete: true,
              pairId: 0,
            },
          ]);
          setPendingInside50Index(null);
          setIsLeftDropdownOpen(false);
          setIsRightDropdownOpen(false);
          setPendingClickIndex(null);
          return;
        }

        // Normal event on circle
        if (pendingClickIndex !== null) {
          console.log(
            "Please select an action from the dropdown before clicking again."
          );
          return;
        }
        // Check for duplicate click
        const currentTime = formatTime(timer);
        const isDuplicate = clicks.some(
          (click) =>
            click.position.x === locationX &&
            click.position.y === locationY &&
            click.time === currentTime
        );
        if (isDuplicate) {
          console.log("Duplicate click detected, ignoring:", {
            x: locationX,
            y: locationY,
            time: currentTime,
          });
          return;
        }
        setCurrentLine(null); // Clear previous line
        setCompletedLines([]); // Clear completed lines on new action
        setClicks((prev) => {
          const newClick: ClickEvent = {
            position: { x: locationX, y: locationY },
            type: "ellipse right",
            team: "",
            item: "",
            time: currentTime,
            isComplete: false,
          };
          console.log("Adding circle click:", newClick);
          const updatedClicks = [...prev, newClick];
          setPendingClickIndex(updatedClicks.length - 1);
          // Defer updateHistory until team selection
          return updatedClicks;
        });
        setIsLeftDropdownOpen(true);
        setIsRightDropdownOpen(true);
      } else {
        console.log(
          "Right circle clicked outside ellipse overlap. Not counted."
        );
      }
    },
    [
      pendingInside50Index,
      updateHistory,
      setPendingClickIndex,
      formatTime,
      timer,
      clicks,
      svgSize,
      ellipseRx,
      ellipseRy,
      isPointInEllipse,
      isRunning,
    ]
  );

  const handleItemClick = useCallback(
    (item: { label: string; value: string }, teamSelected: string) => {
      if (!isRunning) return;
      if (pendingClickIndex === null) {
        console.log("No pending click to associate with this selection.");
        return;
      }

      console.time("ItemSelection");
      setClicks((prevClicks) => {
        let updatedClicks = prevClicks.map((click, index) => {
          if (index === pendingClickIndex) {
            if (item.value === "inside_50") {
              return {
                ...click,
                team: teamSelected,
                item: item.value,
                isComplete: false,
              };
            } else {
              return {
                ...click,
                team: teamSelected,
                item: item.value,
                isComplete: true,
              };
            }
          }
          return click;
        });

        console.log("Click event:", {
          position: updatedClicks[pendingClickIndex]?.position,
          type: updatedClicks[pendingClickIndex]?.type,
          team: teamSelected,
          item: item.value,
          time: updatedClicks[pendingClickIndex]?.time,
          isComplete: item.value === "inside_50" ? false : true,
        });
        if (item.value !== "inside_50") {
          // Save to history only when action is complete
          updateHistory(updatedClicks, true);
        }
        return updatedClicks;
      });
      if (item.value === "inside_50") {
        setPendingInside50Index(pendingClickIndex);
      } else {
        setPendingClickIndex(null);
        setIsLeftDropdownOpen(false);
        setIsRightDropdownOpen(false);
      }
      console.timeEnd("ItemSelection");
    },
    [pendingClickIndex, updateHistory, isRunning]
  );

  const leftSidebarItems = useMemo(
    () =>
      clicks
        .filter((click) => click.isComplete && click.team === "MY TEAM")
        .map((click) => ({
          time: click.time,
          action:
            QuaterData.find((item) => item.value === click.item)?.label ||
            click.item,
        })),
    [clicks, QuaterData]
  );

  const rightSidebarItems = useMemo(
    () =>
      clicks
        .filter((click) => click.isComplete && click.team === "OTHER TEAM")
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
    // Build the set of dots to render. When showing all dots, include
    // archived (quartered) clicks as well as current clicks.
    let dotsToRender: ClickEvent[] = [];
    if (showAllDots) {
      const archived = quarteredClicks
        .slice(-3) // limit to last 3 archived quarters
        .reduce((acc, q) => acc.concat(q.clicks), [] as ClickEvent[]);
      dotsToRender = [...archived, ...clicks];
    } else {
      dotsToRender = clicks.slice(-1);
    }

    const limited = dotsToRender.slice(-200); // cap rendering

    const circles: any[] = [];
    limited.forEach((click, index) => {
      circles.push(
        <Circle
          key={`${index}-1`}
          cx={click.position.x}
          cy={click.position.y}
          r={limited.length > 1 ? 25 : 5}
          fill={
            limited.length > 1
              ? `url(#${click.isComplete ? "redGradient" : "orangeGradient"})`
              : click.isComplete
                ? "red"
                : "orange"
          }
          opacity={0.9}
        />
      );
      if (click.position2) {
        circles.push(
          <Circle
            key={`${index}-2`}
            cx={click.position2.x}
            cy={click.position2.y}
            r={limited.length > 1 ? 25 : 5}
            fill={
              limited.length > 1
                ? `url(#${click.isComplete ? "redGradient" : "orangeGradient"})`
                : click.isComplete
                  ? "red"
                  : "orange"
            }
            opacity={0.9}
          />
        );
      }
    });

    return circles;
  }, [clicks, showAllDots, quarteredClicks]);

  const svgLine = useMemo(() => {
    const lines: any[] = [];
    if (currentLine) {
      lines.push(
        <Line
          key="current"
          x1={currentLine.position.x}
          y1={currentLine.position.y}
          x2={currentLine.to.x}
          y2={currentLine.to.y}
          stroke={currentLine.isComplete ? "red" : "orange"}
          strokeWidth="2"
        />
      );
    }
    // Add completed lines
    completedLines.forEach((line, index) => {
      lines.push(
        <Line
          key={`completed-${index}`}
          x1={line.position.x}
          y1={line.position.y}
          x2={line.to.x}
          y2={line.to.y}
          stroke="red"
          strokeWidth="2"
        />
      );
    });
    // Add lines for all inside_50 clicks with position2
    let dotsToRender: ClickEvent[] = [];
    if (showAllDots) {
      const archived = quarteredClicks
        .slice(-3) // limit to last 3 archived quarters
        .reduce((acc, q) => acc.concat(q.clicks), [] as ClickEvent[]);
      dotsToRender = [...archived, ...clicks];
    } else {
      dotsToRender = clicks.slice(-1);
    }
    const limited = dotsToRender.slice(-200); // cap rendering
    limited.forEach((click, index) => {
      if (click.item === "inside_50" && click.position2) {
        lines.push(
          <Line
            key={`inside50-${index}`}
            x1={click.position.x}
            y1={click.position.y}
            x2={click.position2.x}
            y2={click.position2.y}
            stroke="red"
            strokeWidth="2"
          />
        );
      }
    });
    return lines.length > 0 ? lines : null;
  }, [currentLine, completedLines, showAllDots, quarteredClicks, clicks]);

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
            undo={undo}
            redo={redo}
            wayOfKick={wayOfKick}
            setWayOfKick={setWayOfKick}
            clicks={clicks}
            setClicks={setClicks}
            clearHistory={clearAndArchive}
            setWornNextQ={setWornNextQ}
            updateHistory={updateHistory}
            setShowAllDots={setShowAllDots}
            showAllDots={showAllDots}
            setCompletedLines={setCompletedLines}
            setQuarteredClicks={setQuarteredClicks}
            resetApp={resetApp}
          />
          {wayOfKick === "" && (
            <View className="mx-auto justify-between items-center flex-row mt-6 gap-6 absolute top-24 z-50">
              <TouchableOpacity
                onPress={async () => {
                  setWayOfKick("left");
                  setIsRunning(true);
                }}
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
                onPress={async () => {
                  setWayOfKick("right");
                  setIsRunning(true);
                }}
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
                  {svgLine}
                  {svgCircles}
                </Svg>
              )}
            </ImageBackground>
          </View>
          <View className="flex-row gap-4 absolute bottom-4">
            {/* <TouchableOpacity
              onPress={undo}
              className="bg-[#2D8609] px-4 py-2 rounded-full"
            >
              <Text className="text-white font-semibold">Undo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={redo}
              className="bg-[#2D8609] px-4 py-2 rounded-full"
            >
              <Text className="text-white font-semibold">Redo</Text>
            </TouchableOpacity> */}
            {/* <TouchableOpacity
              onPress={() => setShowAllDots(!showAllDots)}
              className="bg-[#2D8609] px-4 py-2 rounded-full"
            >
              <Text className="text-white font-semibold">
                {showAllDots ? "Show Last Dot" : "Show All Dots"}
              </Text>
            </TouchableOpacity> */}
          </View>
          <View className="absolute top-[100px] left-0">
            <CustomDropdown
              items={QuaterData}
              title={team[wayOfKick === "left" ? 1 : 0]}
              onClickItem={(item) =>
                handleItemClick(item, team[wayOfKick === "left" ? 1 : 0])
              }
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
              title={team[wayOfKick === "left" ? 0 : 1]}
              onClickItem={(item) =>
                handleItemClick(item, team[wayOfKick === "left" ? 0 : 1])
              }
              isOpen={isRightDropdownOpen}
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
          items={leftSidebarItems}
        />
        <RightSidebar
          isOpen={isRightSideBarOpen}
          onClose={() => setIsRightSideBarOpen(false)}
          toggle={() => setIsRightSideBarOpen((prev) => !prev)}
          title="Right Menu"
          items={rightSidebarItems}
        />
      </LinearGradient>
      <StatusBar style="light" />
      <AppModal onClose={() => {}} visible={wornNextQ}>
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
              className="px-6 py-3 rounded-lg"
              style={{ backgroundColor: "#2D8609" }}
              disabled={isCreateGameLoading}
              onPress={() => {
                handleCreateGame();
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

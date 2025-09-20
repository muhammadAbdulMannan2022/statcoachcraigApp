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
  const [pendingLineClick, setPendingLineClick] = useState<LineClick | null>(
    null
  );
  const [currentLine, setCurrentLine] = useState<CurrentLine | null>(null);
  const [showAllDots, setShowAllDots] = useState(false);
  const [wornNextQ, setWornNextQ] = useState(true);
  const [team] = useState(["MY TEAM", "OTHER TEAM"]);
  const pairIdCounter = useRef(0);
  const renderCount = useRef(0);
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

  const assignTeamToPendingPairs = useCallback(
    (teamSelected: string, newClicks: ClickEvent[]) => {
      return newClicks.map((click) => {
        if (
          click.item === "inside_50" &&
          !click.isComplete &&
          click.team === ""
        ) {
          return { ...click, team: teamSelected, isComplete: true };
        }
        return click;
      });
    },
    []
  );

  const handleEllipseClick = useCallback(
    (e: any) => {
      if (!isRunning) return;
      if (pendingClickIndex !== null) {
        console.log(
          "Please select an action from the dropdown before clicking again."
        );
        return;
      }
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
      if (pendingLineClick !== null) {
        // Second click for Inside 50
        const newClick: ClickEvent = {
          position: { x: locationX, y: locationY },
          type: "ellipse",
          team: "",
          item: "inside_50",
          time: currentTime,
          isComplete: false,
          pairId: pendingLineClick.pairId,
        };
        setClicks((prev) => {
          const updatedClicks = [
            ...prev,
            {
              position: pendingLineClick.position,
              type: pendingLineClick.type,
              team: "",
              item: "inside_50",
              time: pendingLineClick.time,
              isComplete: false,
              pairId: pendingLineClick.pairId,
            },
            newClick,
          ];
          setPendingClickIndex(updatedClicks.length - 2); // Point to first click
          setCurrentLine({
            position: pendingLineClick.position,
            to: { x: locationX, y: locationY },
            isComplete: false,
            pairId: pendingLineClick.pairId,
          });
          // Defer updateHistory until team selection
          console.log("Second click for Inside 50:", {
            x: locationX,
            y: locationY,
          });
          return updatedClicks;
        });
        setPendingLineClick(null);
        setIsLeftDropdownOpen(true);
        setIsRightDropdownOpen(true);
      } else {
        // Normal ellipse click
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
      }
      console.timeEnd("DotPlacement");
    },
    [pendingClickIndex, pendingLineClick, timer, formatTime, clicks]
  );

  const handleLeftCircleClick = useCallback(
    (e: any) => {
      if (!isRunning) return;
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
      const currentTime = formatTime(timer);

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
        // Check for duplicate click
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

        console.time("DotPlacement");
        setCurrentLine(null); // Clear previous line
        if (pendingLineClick === null) {
          // First click: Store pending line click and add point
          const newPairId = pairIdCounter.current++;
          setPendingLineClick({
            position: { x: locationX, y: locationY },
            type: "ellipse left",
            time: currentTime,
            pairId: newPairId,
          });
          setClicks((prev) => {
            const newClick: ClickEvent = {
              position: { x: locationX, y: locationY },
              type: "ellipse left",
              team: "",
              item: "inside_50",
              time: currentTime,
              isComplete: false,
              pairId: newPairId,
            };
            console.log("First left circle click stored:", {
              x: locationX,
              y: locationY,
            });
            const updatedClicks = [...prev, newClick];
            // Defer updateHistory until team selection
            return updatedClicks;
          });
        } else {
          // Second click for Inside 50
          setClicks((prev) => {
            const newClick: ClickEvent = {
              position: { x: locationX, y: locationY },
              type: "ellipse left",
              team: "",
              item: "inside_50",
              time: currentTime,
              isComplete: false,
              pairId: pendingLineClick.pairId,
            };
            const updatedClicks = [...prev, newClick];
            setPendingClickIndex(updatedClicks.length - 2); // Point to first click
            setCurrentLine({
              position: pendingLineClick.position,
              to: { x: locationX, y: locationY },
              isComplete: false,
              pairId: pendingLineClick.pairId,
            });
            // Defer updateHistory until team selection
            console.log("Second click for Inside 50:", {
              x: locationX,
              y: locationY,
            });
            return updatedClicks;
          });
          setPendingLineClick(null);
          setIsLeftDropdownOpen(true);
          setIsRightDropdownOpen(true);
        }
        console.timeEnd("DotPlacement");
      } else {
        console.log(
          "Left circle clicked outside ellipse overlap. Not counted."
        );
      }
    },
    [
      pendingClickIndex,
      pendingLineClick,
      timer,
      formatTime,
      svgSize,
      ellipseRx,
      ellipseRy,
      isPointInEllipse,
      clicks,
    ]
  );

  const handleRightCircleClick = useCallback(
    (e: any) => {
      if (!isRunning) return;
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
      const currentTime = formatTime(timer);

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
        // Check for duplicate click
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

        console.time("DotPlacement");
        setCurrentLine(null); // Clear previous line
        if (pendingLineClick === null) {
          // First click: Store pending line click and add point
          const newPairId = pairIdCounter.current++;
          setPendingLineClick({
            position: { x: locationX, y: locationY },
            type: "ellipse right",
            time: currentTime,
            pairId: newPairId,
          });
          setClicks((prev) => {
            const newClick: ClickEvent = {
              position: { x: locationX, y: locationY },
              type: "ellipse right",
              team: "",
              item: "inside_50",
              time: currentTime,
              isComplete: false,
              pairId: newPairId,
            };
            console.log("First right circle click stored:", {
              x: locationX,
              y: locationY,
            });
            const updatedClicks = [...prev, newClick];
            // Defer updateHistory until team selection
            return updatedClicks;
          });
        } else {
          // Second click for Inside 50
          setClicks((prev) => {
            const newClick: ClickEvent = {
              position: { x: locationX, y: locationY },
              type: "ellipse right",
              team: "",
              item: "inside_50",
              time: currentTime,
              isComplete: false,
              pairId: pendingLineClick.pairId,
            };
            const updatedClicks = [...prev, newClick];
            setPendingClickIndex(updatedClicks.length - 2); // Point to first click
            setCurrentLine({
              position: pendingLineClick.position,
              to: { x: locationX, y: locationY },
              isComplete: false,
              pairId: pendingLineClick.pairId,
            });
            // Defer updateHistory until team selection
            console.log("Second click for Inside 50:", {
              x: locationX,
              y: locationY,
            });
            return updatedClicks;
          });
          setPendingLineClick(null);
          setIsLeftDropdownOpen(true);
          setIsRightDropdownOpen(true);
        }
        console.timeEnd("DotPlacement");
      } else {
        console.log(
          "Right circle clicked outside ellipse overlap. Not counted."
        );
      }
    },
    [
      pendingClickIndex,
      pendingLineClick,
      timer,
      formatTime,
      svgSize,
      ellipseRx,
      ellipseRy,
      isPointInEllipse,
      clicks,
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
          if (
            index === pendingClickIndex ||
            (item.value === "inside_50" &&
              index === pendingClickIndex + 1 &&
              click.pairId === prevClicks[pendingClickIndex]?.pairId)
          ) {
            return {
              ...click,
              team: teamSelected,
              item: item.value === "inside_50" ? "inside_50" : item.value,
              isComplete: true,
            };
          }
          return click;
        });

        // Assign team to any incomplete Inside 50 pairs
        updatedClicks = assignTeamToPendingPairs(teamSelected, updatedClicks);

        console.log("Click event completed:", {
          position: updatedClicks[pendingClickIndex]?.position,
          type: updatedClicks[pendingClickIndex]?.type,
          team: teamSelected,
          item: item.value,
          time: updatedClicks[pendingClickIndex]?.time,
        });
        // Save to history only when action is complete
        updateHistory(updatedClicks, true);
        return updatedClicks;
      });
      setCurrentLine((prev) => (prev ? { ...prev, isComplete: true } : null));
      setPendingClickIndex(null);
      setIsLeftDropdownOpen(false);
      setIsRightDropdownOpen(false);
      console.timeEnd("ItemSelection");
    },
    [pendingClickIndex, updateHistory, assignTeamToPendingPairs]
  );

  const leftSidebarItems = useMemo(
    () =>
      clicks
        .filter((click) => click.isComplete && click.team === "Script HQ")
        .map((click) => ({
          time: click.time,
          action:
            QuaterData.find((item) => item.value === click.item)?.label ||
            click.item,
          team: click.team,
        })),
    [clicks, QuaterData]
  );

  const rightSidebarItems = useMemo(
    () =>
      clicks
        .filter((click) => click.isComplete && click.team === "Script RH")
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

    return limited.map((click, index) => (
      <Circle
        key={index}
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
    ));
  }, [clicks, showAllDots, quarteredClicks]);

  const svgLine = useMemo(() => {
    if (!currentLine) return null;
    return (
      <Line
        x1={currentLine.position.x}
        y1={currentLine.position.y}
        x2={currentLine.to.x}
        y2={currentLine.to.y}
        stroke={currentLine.isComplete ? "red" : "orange"}
        strokeWidth="2"
      />
    );
  }, [currentLine]);

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
          />
          {wayOfKick == "" && (
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

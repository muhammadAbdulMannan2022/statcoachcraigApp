import {
  useGetGameDataQuery,
  useGetQuaterDataQuery,
  useSendQuaterDataMutation,
} from "@/redux/apis/api";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Octicons from "@expo/vector-icons/Octicons";
import { skipToken } from "@reduxjs/toolkit/query";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AppModal from "../ui/Modals/ModalScaliton";
import StrategyModal from "../ui/Modals/ReportModal";

interface ClickEvent {
  position: { x: number; y: number };
  type: "ellipse" | "ellipse left" | "ellipse right";
  team: string;
  item: string;
  time: string;
  isComplete: boolean;
  pairId?: number;
}

interface PropIntrface {
  isRunning: boolean;
  setIsRunning: (data: boolean) => void;
  value: "1" | "2" | "3" | "4";
  setValue: (data: "1" | "2" | "3" | "4") => void;
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  undo: () => void;
  redo: () => void;
  wayOfKick: string;
  setWayOfKick: (data: "" | "left" | "right") => void;
  clicks: ClickEvent[];
  clearHistory: () => void;
  setWornNextQ: (data: boolean) => void;
  setClicks: (data: any) => void;
  updateHistory: any;
  setShowAllDots: any;
  showAllDots: any;
}

export default function TopPart({
  isRunning,
  setIsRunning,
  value,
  setValue,
  time,
  setTime,
  undo,
  redo,
  wayOfKick,
  setWayOfKick,
  clicks,
  clearHistory,
  setWornNextQ,
  setClicks,
  updateHistory,
  setShowAllDots,
  showAllDots,
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
  const [skipWarningVisible, setSkipWarningVisible] = useState(false);
  const [quarterReportVisible, setQuarterReportVisible] = useState(false);
  const [submitConfirmVisible, setSubmitConfirmVisible] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isReportVisible, setReportVisible] = useState(false);
  const [game_id, setGameId] = useState<string | null>(null);
  const [reportQuarter, setReportQuarter] = useState<
    "1" | "2" | "3" | "4" | null | string
  >(null);
  const [submitQuaterData, { isLoading: issubmitQuaterLoading }] =
    useSendQuaterDataMutation();
  const {
    data: quaterData,
    isLoading: isQuaterDataLoading,
    error: quaterDataError,
    refetch,
  } = useGetQuaterDataQuery(
    game_id && reportQuarter ? { game_id, quater_id: reportQuarter } : skipToken
  );
  const {
    data: gameData,
    isLoading: isGameDataLoading,
    error: gameDataError,
  } = useGetGameDataQuery(game_id ?? skipToken);

  // Log query state for debugging
  useEffect(() => {
    console.log(
      "quaterData:",
      quaterData,
      "isLoading:",
      isQuaterDataLoading,
      "error:",
      quaterDataError
    );
    console.log(
      "gameData:",
      gameData,
      "isLoading:",
      isGameDataLoading,
      "error:",
      gameDataError
    );
  }, [
    quaterData,
    isQuaterDataLoading,
    quaterDataError,
    gameData,
    isGameDataLoading,
    gameDataError,
  ]);

  // Process game data to flatten all quarters into a single array
  const processGameData = (data: any) => {
    if (!data || !data.data) return { data: [] };

    const allQuarters = [
      ...(data.data.quarter_a || []),
      ...(data.data.quarter_b || []),
      ...(data.data.quarter_c || []),
      ...(data.data.quarter_d || []),
    ];

    return { data: allQuarters };
  };

  // Handle filtered data from StrategyModal
  const handleStrategySelect = (filteredData: any[]) => {
    // If DataItem and ClickEvent are structurally compatible, you can cast:
    const clickEvents = filteredData as ClickEvent[];
    clearHistory(); // Clear existing history to start fresh
    setClicks(clickEvents); // Update clicks state
    updateHistory(clickEvents); // Assuming filtered data is complete
    console.log("Clicks updated with filtered data:", clickEvents);
  };

  // Fetch game report for the specified quarter or final report
  const handleGetGameReport = async (quarter: "1" | "2" | "3" | "4") => {
    try {
      const id = await SecureStore.getItemAsync("game_id");
      if (id) {
        setGameId(id);
        let quater_id: "a" | "b" | "c" | "d";
        switch (quarter) {
          case "1":
            quater_id = "a";
            break;
          case "2":
            quater_id = "b";
            break;
          case "3":
            quater_id = "c";
            break;
          case "4":
            quater_id = "d";
            break;
          default:
            quater_id = "a"; // Fallback
        }
        setReportQuarter(quarter === "4" ? null : quater_id);
        if (quarter === "4") {
          if (!isGameDataLoading && gameData && !gameDataError) {
            const processedData = processGameData(gameData);
            setReportVisible(true);
            console.log("Processed Game Data:", processedData);
          } else if (gameDataError) {
            setSubmitError("Failed to load game data");
            setSkipWarningVisible(true);
          }
        } else {
          if (!isQuaterDataLoading && quaterData && !quaterDataError) {
            setReportVisible(true);
          } else if (quaterDataError) {
            setSubmitError("Failed to load quarter data");
            setSkipWarningVisible(true);
          }
        }
      } else {
        setSubmitError("No game ID found");
        setSkipWarningVisible(true);
      }
    } catch (error) {
      console.log(error, "line 117 top part.tsx");
      setSubmitError("Failed to fetch report data");
      setSkipWarningVisible(true);
    }
  };

  // Trigger refetch when game_id or reportQuarter changes
  useEffect(() => {
    if (game_id && reportQuarter) {
      refetch();
    }
  }, [game_id, reportQuarter, refetch]);

  // Open StrategyModal when data is ready
  useEffect(() => {
    if (
      game_id &&
      !isGameDataLoading &&
      gameData &&
      !gameDataError &&
      !reportQuarter
    ) {
      setReportVisible(true);
    } else if (
      game_id &&
      reportQuarter &&
      !isQuaterDataLoading &&
      quaterData &&
      !quaterDataError
    ) {
      setReportVisible(true);
    } else if (quaterDataError || gameDataError) {
      setSubmitError("Failed to load data");
      setSkipWarningVisible(true);
    }
  }, [
    quaterData,
    isQuaterDataLoading,
    quaterDataError,
    gameData,
    isGameDataLoading,
    gameDataError,
    game_id,
    reportQuarter,
  ]);

  // Submit quarter data
  const handleSubmitQuarterData = async () => {
    if (showAllDots) {
      // Skip database submission
      return true;
    }
    if (time === 0) {
      setSubmitError("Cannot submit quarter with time 00:00:00");
      setSkipWarningVisible(true);
      return false;
    }
    try {
      const game_id = await SecureStore.getItemAsync("game_id");
      let quater_name;
      switch (value) {
        case "1":
          quater_name = "a";
          break;
        case "2":
          quater_name = "b";
          break;
        case "3":
          quater_name = "c";
          break;
        case "4":
          quater_name = "d";
          break;
      }
      const res = await submitQuaterData({
        game_id,
        quarter_name: quater_name,
        quarter_data: clicks,
      }).unwrap();
      console.log(res, "line 152 top part");
      return true;
    } catch (err) {
      console.log(err, "line 154 top part.tsx");
      setSubmitError("Failed to submit quarter data");
      setSkipWarningVisible(true);
      return false;
    }
  };

  // Confirm submission and proceed
  const confirmSubmitQuarter = async () => {
    const success = await handleSubmitQuarterData();
    if (success) {
      setQuarterReportVisible(true);
    }
    setSubmitConfirmVisible(false);
  };

  // Toggle play/pause
  const toggleTimer = async () => {
    if (wayOfKick === "") return;
    if (isRunning) {
      setIsRunning(false);
      setSubmitConfirmVisible(true);
      const current = Number(value);
      if (current < 4) {
        setPendingQuarter(String(current + 1) as "1" | "2" | "3" | "4");
      } else {
        setGameFinished(true);
      }
    } else {
      setIsRunning(true);
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

    if (time === 0) {
      setSubmitError("Cannot change quarter with time 00:00:00");
      setSkipWarningVisible(true);
      return;
    }
    if (next > current + 1) {
      console.log("❌ Can't skip quarters");
      setSubmitError("Cannot skip quarters");
      setSkipWarningVisible(true);
      return;
    }
    if (next < current) {
      console.log("❌ Can't go back to previous quarter");
      setSubmitError("Cannot go back to previous quarter");
      return;
    }
    if (current === 4) {
      setGameFinished(true);
      return;
    }

    setPendingQuarter(item.value);
    setSubmitConfirmVisible(true);
  };

  // Confirm quarter change
  const confirmChangeQuarter = () => {
    if (pendingQuarter) {
      setValue(pendingQuarter);
      setWayOfKick("");
      setTime(0);
      clearHistory();
      setShowAllDots(false); // Add this line
      console.log("✅ Moved to quarter:", pendingQuarter);
    }
    setQuarterReportVisible(false);
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
            <TouchableOpacity
              onPress={undo}
              className="items-center flex-row gap-2"
            >
              <Text className="text-[#2D8609] text-sm font-bold">Undo</Text>
              <MaterialCommunityIcons
                name="undo-variant"
                size={24}
                color="#2D8609"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={redo}
              className="items-center flex-row gap-2"
            >
              <MaterialCommunityIcons
                name="redo-variant"
                size={24}
                color="#2D8609"
              />
              <Text className="text-[#2D8609] text-sm font-bold">Redo</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="bg-[#2D8609] px-4 py-2 rounded-full"
            onPress={() => handleGetGameReport(value)}
          >
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

      {/* Submit Confirmation Modal */}
      <AppModal
        visible={submitConfirmVisible}
        onClose={() => setSubmitConfirmVisible(false)}
      >
        <View className="items-center">
          <Text className="text-lg font-bold mb-4">
            Submit Quarter {value}?
          </Text>
          <Text className="text-gray-600 mb-6 text-center">
            Once submitted, you cannot edit this quarter's data. Are you sure
            you want to submit?
          </Text>
          <View className="flex-row gap-4">
            <TouchableOpacity
              className="px-4 py-2 rounded-lg border border-gray-400"
              onPress={() => {
                setSubmitConfirmVisible(false);
                if (gameFinished) setGameFinished(true);
              }}
            >
              <Text className="text-gray-600">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: "#2D8609" }}
              onPress={confirmSubmitQuarter}
            >
              <Text className="text-white">Yes, Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </AppModal>

      {/* Confirm Quarter Change Modal */}
      <AppModal
        visible={confirmVisible}
        onClose={() => setConfirmVisible(false)}
      >
        <View className="items-center">
          <Text className="text-lg font-bold mb-4">
            Move to Quarter {pendingQuarter}?
          </Text>
          <Text className="text-gray-600 mb-6 text-center">
            The timer will reset for the new quarter.
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

      {/* Quarter Report Modal */}
      <AppModal
        visible={quarterReportVisible}
        onClose={() => setQuarterReportVisible(false)}
      >
        <View className="items-center">
          <Text className="text-lg font-bold mb-4">
            Quarter {value} Submitted
          </Text>
          <Text className="text-gray-600 mb-6 text-center">
            Quarter data has been submitted. Would you like to see the quarter
            reports?
          </Text>
          <View className="flex-row gap-4">
            <TouchableOpacity
              className="px-4 py-2 rounded-lg border border-gray-400"
              onPress={() => {
                setQuarterReportVisible(false);
                if (pendingQuarter && !gameFinished) setConfirmVisible(true);
              }}
            >
              <Text className="text-gray-600">Continue</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: "#2D8609" }}
              onPress={() => {
                setQuarterReportVisible(false);
                handleGetGameReport(value);
                if (pendingQuarter && !gameFinished) setConfirmVisible(true);
              }}
            >
              <Text className="text-white">See Quarter Reports</Text>
            </TouchableOpacity>
          </View>
        </View>
      </AppModal>

      {/* Skip Quarter Warning Modal */}
      <AppModal
        visible={skipWarningVisible}
        onClose={() => {
          setSkipWarningVisible(false);
          setSubmitError(null);
        }}
      >
        <View className="items-center">
          <Text className="text-lg font-bold mb-4 text-red-600">
            {submitError ? submitError : "Cannot Skip Quarters"}
          </Text>
          <Text className="text-gray-600 mb-6 text-center">
            {submitError
              ? "Please ensure valid data before proceeding."
              : "You cannot skip quarters. Please select the next quarter and ensure time is not 00:00:00 (Quarter " +
                (Number(value) + 1) +
                ")."}
          </Text>
          <View className="flex-row gap-4">
            <TouchableOpacity
              className="px-4 py-2 rounded-lg border border-gray-400"
              onPress={() => {
                setSkipWarningVisible(false);
                setSubmitError(null);
              }}
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
            All four quarters are complete. You can reset the game or view the
            final report.
          </Text>
          <View className="flex-row gap-4">
            <TouchableOpacity
              className="px-4 py-2 rounded-lg border border-gray-400"
              onPress={() => {
                setGameFinished(false);
                setValue("1");
                setTime(0);
                setIsRunning(false);
                setWayOfKick("");
                clearHistory();
                setWornNextQ(true);
              }}
            >
              <Text className="text-gray-600">Reset Game</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: "#2D8609" }}
              onPress={() => {
                setGameFinished(false);
                handleGetGameReport("4");
              }}
            >
              <Text className="text-white">View Final Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </AppModal>

      {/* Report Modal */}
      {isReportVisible && (
        <StrategyModal
          isLoading={reportQuarter ? isQuaterDataLoading : isGameDataLoading}
          data={
            reportQuarter
              ? quaterData || []
              : processGameData(gameData) || { data: [] }
          }
          visible={isReportVisible}
          onClose={() => {
            setReportVisible(false);
            setReportQuarter(null);
          }}
          onStrategySelect={handleStrategySelect} // Pass callback
          setShowAllDots={setShowAllDots}
        />
      )}
    </View>
  );
}

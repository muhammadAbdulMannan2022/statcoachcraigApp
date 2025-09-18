import Feather from "@expo/vector-icons/Feather";
import { useEffect, useRef } from "react";
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// Removed: import { SafeAreaView } from "react-native-safe-area-context";
import SideBarItem from "./item";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  toggle: () => void;
}

const SIDEBAR_WIDTH = 250;
const items = [
  {
    time: "26:01:30",
    action: "Turn Over",
  },
  {
    time: "26:01:30",
    action: "Inside 50",
  },
  {
    time: "26:01:30",
    action: "Fumble",
  },
  {
    time: "26:01:30",
    action: "Content",
  },
  {
    time: "26:01:30",
    action: "Tackle",
  },
  {
    time: "26:01:30",
    action: "Turn Over",
  },
  {
    time: "26:01:30",
    action: "Inside 50",
  },
  {
    time: "26:01:30",
    action: "Fumble",
  },
  {
    time: "26:01:30",
    action: "Content",
  },
  {
    time: "26:01:30",
    action: "Tackle",
  },
  {
    time: "26:01:30",
    action: "Turn Over",
  },
  {
    time: "26:01:30",
    action: "Inside 50",
  },
  {
    time: "26:01:30",
    action: "Fumble",
  },
  {
    time: "26:01:30",
    action: "Content",
  },
  {
    time: "26:01:30",
    action: "Tackle",
  },
  {
    time: "26:01:30",
    action: "Turn Over",
  },
  {
    time: "26:01:30",
    action: "Inside 50",
  },
  {
    time: "26:01:30",
    action: "Fumble",
  },
  {
    time: "26:01:30",
    action: "Content",
  },
  {
    time: "26:01:30",
    action: "Tackle",
  },
  {
    time: "26:01:30",
    action: "Turn Over",
  },
  {
    time: "26:01:30",
    action: "Inside 50",
  },
  {
    time: "26:01:30",
    action: "Fumble",
  },
  {
    time: "26:01:30",
    action: "Content",
  },
  {
    time: "26:01:30",
    action: "Tackle",
  },
];

export default function LeftSidebar({
  isOpen,
  onClose,
  title,
  toggle,
}: SidebarProps) {
  const translateX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOpen ? 0 : -SIDEBAR_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  return (
    // <View className="h-screen border-2 border-red-600">
    <>
      {isOpen && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          className="absolute inset-0 bg-black/0 z-10 h-screen"
        />
      )}

      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: SIDEBAR_WIDTH,
          transform: [{ translateX }],
        }}
        className="bg-white flex-1 z-20 border-r border-gray-700"
      >
        {/* Changed SafeAreaView to View */}
        <View className="flex-1">
          {/* Scrollable items */}
          <ScrollView
            contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
          >
            {title && (
              <Text className="text-white bg-[#5E5871] text-2xl font-medium py-3 rounded-lg mb-4 text-center">
                {title}
              </Text>
            )}

            {items.map((item, i) => (
              <SideBarItem key={i} time={item.time} action={item.action} />
            ))}
          </ScrollView>

          {/* Toggle button outside ScrollView */}
          <TouchableOpacity
            onPress={toggle}
            className="absolute top-[90%] -right-16 w-16 h-12 bg-white justify-center items-center rounded-r-full"
          >
            <Feather
              name={isOpen ? "arrow-left" : "arrow-right"}
              size={24}
              color="#2D8609"
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
      {/* </View> */}
    </>
  );
}

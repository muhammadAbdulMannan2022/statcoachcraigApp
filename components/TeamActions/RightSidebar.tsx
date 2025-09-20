import Feather from "@expo/vector-icons/Feather";
import { useEffect, useRef } from "react";
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SideBarItem from "./item";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  toggle: () => void;
  items: any;
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

export default function RightSidebar({
  isOpen,
  onClose,
  title,
  toggle,
  items: data,
}: SidebarProps) {
  const translateX = useRef(new Animated.Value(SIDEBAR_WIDTH)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOpen ? 0 : SIDEBAR_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  return (
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
          right: 0,
          width: SIDEBAR_WIDTH,
          transform: [
            {
              translateX: translateX.interpolate({
                inputRange: [0, SIDEBAR_WIDTH],
                outputRange: [0, SIDEBAR_WIDTH],
              }),
            },
          ],
        }}
        className="bg-white z-20 border-l border-gray-700 h-screen"
      >
        <View className="flex-1">
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

          <TouchableOpacity
            onPress={toggle}
            className="absolute top-[90%] -left-16 w-16 h-12 bg-white justify-center items-center rounded-l-full"
          >
            <Feather
              name={isOpen ? "arrow-right" : "arrow-left"}
              size={24}
              color="#2D8609"
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
}

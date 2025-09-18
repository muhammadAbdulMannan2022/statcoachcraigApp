import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Text, TouchableOpacity, View } from "react-native";
interface DropdownItem {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  items: DropdownItem[];
  title: string;
  onClickItem: (item: any) => void;
  isOpen: boolean;
  onToggle: () => void;
  alignment?: "left" | "right";
}

export default function CustomDropdown({
  items,
  title,
  onClickItem,
  isOpen,
  onToggle,
  alignment = "left",
}: CustomDropdownProps) {
  return (
    <View className="relative w-[150px]">
      {/* Dropdown Button */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={onToggle}
        className={`${alignment === "left" ? "flex-row rounded-r-full" : "flex-row-reverse rounded-l-full"} items-center justify-between h-[44px] px-3 bg-[#5E5871]`}
      >
        <Text className="text-white font-bold line-clamp-1">{title}</Text>
        <Entypo
          style={{
            fontWeight: "900",
          }}
          name="chevron-small-down"
          size={24}
          color="#fff"
        />
      </TouchableOpacity>

      {/* Dropdown List */}
      {isOpen && (
        <View
          className={`absolute top-full w-full border border-gray-300 ${alignment === "left" ? "rounded-r-lg" : "rounded-l-lg"} bg-white shadow-md z-10 ${
            alignment === "right" ? "right-0" : "left-0"
          }`}
        >
          {items.map((item) => (
            <TouchableOpacity
              key={item.value}
              onPress={() => {
                onClickItem(item);
                onToggle();
              }}
              className={`py-3 px-3 ${alignment === "left" ? "flex-row" : "flex-row-reverse"} items-center justify-between`}
            >
              <Text className="text-[#5E5871] line-clamp-1 font-bold">
                {item.label}
              </Text>
              <FontAwesome5 name="check-circle" size={24} color="#2D8609" />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

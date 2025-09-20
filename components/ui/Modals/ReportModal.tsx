import { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type DataItem = {
  position: { x: number; y: number };
  type: string;
  team: string;
  item: string;
  time: string;
  isComplete: boolean;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  data?: { data?: DataItem[] } | DataItem[]; // works for both {data:[]} and []
  isLoading: boolean;
};

export default function StrategyModal({
  visible,
  onClose,
  data,
  isLoading,
}: Props) {
  // aggregate counts
  const aggregated = useMemo(() => {
    if (isLoading) return [];
    console.log(data);
    // normalize data
    const rawData: DataItem[] = Array.isArray(data) ? data : (data?.data ?? []);

    const counts: Record<string, { our: number; other: number }> = {};

    rawData.length > 0 &&
      rawData.forEach((d) => {
        if (!counts[d.item]) counts[d.item] = { our: 0, other: 0 };
        if (d.team === "MY TEAM") counts[d.item].our += 1;
        else counts[d.item].other += 1;
      });

    return Object.keys(counts).map((key) => ({
      strategy: key,
      our: counts[key].our,
      other: counts[key].other,
      difference: counts[key].our - counts[key].other,
    }));
  }, [data, isLoading]);

  const renderRow = ({ item }: any) => (
    <View className="flex-row items-center justify-center border-b border-gray-200 py-2 pe-4">
      <Text className="flex-1 text-center">{item.strategy}</Text>
      <Text className="flex-1 text-center">{item.our}</Text>
      <Text className="flex-1 text-center">{item.other}</Text>
      <Text className="flex-1 text-center">{item.difference}</Text>
      <TouchableOpacity className="">
        <Text className="text-[#2D8609]">Click here</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Overlay with outside click */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 justify-center items-center">
          {/* Inner box (stop propagation) */}
          <TouchableWithoutFeedback>
            <View className="bg-white rounded-2xl p-6 w-11/12 max-w-2xl">
              <Text className="text-xl font-bold mb-4 text-center text-black">
                Strategies Applied (Q1)
              </Text>

              {/* Header */}
              <View className="flex-row bg-[#6F6295] py-2 border-b border-gray-300">
                <Text className="flex-1 font-semibold text-center text-white">
                  Action
                </Text>
                <Text className="flex-1 font-semibold text-center text-white">
                  Crocodile
                </Text>
                <Text className="flex-1 font-semibold text-center text-white">
                  Shark Pal
                </Text>
                <Text className="flex-1 font-semibold text-center text-white">
                  Differential
                </Text>
                <Text className="flex-1 font-semibold text-center text-white">
                  Heatmap
                </Text>
              </View>
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <FlatList
                  data={aggregated}
                  keyExtractor={(item) => item.strategy}
                  renderItem={renderRow}
                />
              )}

              <View className="flex items-center justify-center">
                <TouchableOpacity
                  onPress={onClose}
                  className="mt-4 bg-[#6F6295] py-2 px-4 rounded-lg"
                >
                  <Text className="text-white text-center font-semibold">
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

import { Modal, Text, TouchableOpacity, View } from "react-native";

interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function AppModal({
  visible,
  onClose,
  children,
}: AppModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <View className="flex-1 bg-black/50 justify-center items-center">
        {/* Modal Content */}
        <View className="bg-white rounded-2xl p-6 w-11/12 max-w-md">
          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            className="self-end mb-2 px-2 py-1"
          >
            <Text className="text-red-500 font-semibold">✕</Text>
          </TouchableOpacity>

          {/* Whatever the user passes */}
          {children}
        </View>
      </View>
    </Modal>
  );
}

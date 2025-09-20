import { Modal, TouchableWithoutFeedback, View } from "react-native";

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
      {/* Overlay with outside click */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 justify-center items-center">
          {/* Stop propagation when clicking inside box */}
          <TouchableWithoutFeedback>
            <View className="bg-white rounded-2xl p-6 w-11/12 max-w-md">
              {/* Close Button */}
              {/* <TouchableOpacity
                onPress={onClose}
                className="self-end mb-2 px-2 py-1"
              >
                <Text className="text-red-500 font-semibold">✕</Text>
              </TouchableOpacity> */}

              {/* Content */}
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

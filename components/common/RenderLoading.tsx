import { ActivityIndicator, Text, View } from "react-native";

// Loading state component
export const RenderLoading = () => (
  <View className="flex-1 justify-center items-center">
    <ActivityIndicator size="large" color="#ffffff" className="mb-4" />
    <Text className="text-white text-lg">Loading movies...</Text>
  </View>
);

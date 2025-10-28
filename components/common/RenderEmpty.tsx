import { Text, View } from "react-native";

// Empty state component
export const RenderEmpty = () => (
  <View className="flex-1 justify-center mt-6 items-center px-8">
    <Text className="text-white text-lg text-center mb-4">No movies found</Text>
    <Text className="text-gray-400 text-sm text-center">
      Try adjusting your search or check back later for new releases.
    </Text>
  </View>
);

import { Text, View } from "react-native";

// Error state component
export const RenderError = ({ moviesError }: { moviesError: Error }) => (
  <View className="flex-1 justify-center items-center px-8">
    <Text className="text-white text-lg text-center mb-4">
      Oops! Something went wrong
    </Text>
    <Text className="text-gray-400 text-sm text-center">
      {moviesError?.message || "Failed to load movies. Please try again later."}
    </Text>
  </View>
);

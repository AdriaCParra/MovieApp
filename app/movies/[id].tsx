import { router } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";

const MovieDetails = () => {
  return (
    <View className="mt-20">
      <Text>[id]</Text>
      <Button title="Go Back" onPress={() => router.back()} />
    </View>
  );
};

export default MovieDetails;

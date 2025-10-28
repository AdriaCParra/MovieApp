import { images } from "@/constants/images";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const saved = () => {
  return (
    <View className="flex-1 bg-black">
      <Image source={images.bg} className="z-0 w-full absolute"></Image>
      <Text>saved</Text>
    </View>
  );
};

export default saved;

const styles = StyleSheet.create({});

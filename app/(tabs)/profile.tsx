import { images } from "@/constants/images";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const profile = () => {
  return (
    <View className="flex-1 bg-black">
      <Image source={images.bg} className="z-0 w-full absolute"></Image>
      <Text>profile</Text>
    </View>
  );
};

export default profile;

const styles = StyleSheet.create({});
